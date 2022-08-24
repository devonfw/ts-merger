import { FunctionDeclaration } from '../components/general/FunctionDeclaration';
import { VariableStatement } from '../components/general/VariableStatement';
import { TSFile } from '../components/TSFile';
import { ImportDeclaration } from '../components/import/ImportDeclaration';
import { ExportDeclaration } from '../components/export/ExportDeclaration';
import { ClassDeclaration } from '../components/classDeclaration/ClassDeclaration';
import { InterfaceDeclaration } from '../components/interfaceDeclaration/InterfaceDeclaration';
import { InterfaceMethod } from '../components/interfaceDeclaration/members/method/InterfaceMethod';
import { Constructor } from '../components/classDeclaration/members/constructor/Constructor';
import { Parameter } from '../components/classDeclaration/members/method/Parameter';
import { Decorator } from '../components/decorator/Decorator';
import { Method } from '../components/classDeclaration/members/method/Method';
import { PropertyDeclaration } from '../components/classDeclaration/members/property/PropertyDeclaration';
import { CallExpression } from '../components/general/CallExpression';
import { ArrayLiteralExpression } from '../components/general/ArrayLiteralExpression';
import { PropertyAssignment } from '../components/general/PropertyAssignment';
import { ObjectLiteralExpression } from '../components/general/ObjectLiteralExpression';
import * as ts from 'typescript';
import { BodyMethod } from '../components/classDeclaration/members/method/body/BodyMethod';
import InterfaceProperty from '../components/interfaceDeclaration/members/InterfaceProperty';
import { EnumDeclaration } from '../components/general/EnumDeclaration';
import { EnumElement } from '../components/general/EnumElement';
import { ExpressionDeclaration } from '../components/general/ExpressionDeclaration';

export function mapFile(sourceFile: ts.SourceFile) {
  let file: TSFile = new TSFile();
  let counter = 0;

  sourceFile
    .getChildAt(0)
    .getChildren()
    .forEach((child) => {
      switch (child.kind) {
        case ts.SyntaxKind.ImportDeclaration:
          file.addImport(mapImport(<ts.ImportDeclaration>child));
          break;
        case ts.SyntaxKind.ExportDeclaration:
          file.addExport(mapExport(<ts.ExportDeclaration>child));
          break;
        case ts.SyntaxKind.ClassDeclaration:
          file.addClass(mapClass(<ts.ClassDeclaration>child, sourceFile));
          break;
        case ts.SyntaxKind.InterfaceDeclaration:
          file.addInterface(
            mapInterface(<ts.InterfaceDeclaration>child, sourceFile)
          );
          break;
        case ts.SyntaxKind.VariableStatement:
          file.addVariable(
            mapVariableStatement(<ts.VariableStatement>child, sourceFile)
          );
          break;
        case ts.SyntaxKind.FunctionDeclaration:
          file.addFunction(
            mapFunction(<ts.FunctionDeclaration>child, sourceFile)
          );
          break;
        case ts.SyntaxKind.EnumDeclaration:
          file.addEnum(mapEnums(<ts.EnumDeclaration>child));
          break;
        case ts.SyntaxKind.ExpressionStatement:
          file.addExpression(
            mapExpressions(<ts.ExpressionStatement>child, sourceFile)
          );
          break;
        case ts.SyntaxKind.ExportKeyword:
          let lineText: string[] = sourceFile.getText().split('\n');
          file.addExport(
            mapExportKeyword(file, lineText[counter])
          );
          counter++;
      }
    });
  return file;
}

export function mapExportKeyword(fileExport: TSFile, exportExpression: String) {
  let exportElement: ExportDeclaration = new ExportDeclaration();
  let named: string[];
  let module: string;

  exportExpression = exportExpression.trim();

  // lastIndexOf gets the first index of the last occurance of from
  let firstIndexFromKeyword = exportExpression.lastIndexOf('from');

  //Getting the exports
  named = exportExpression
    .substring(6, firstIndexFromKeyword)
    .trim()
    .split(',');

  //Getting export origins
  module = exportExpression
    .substring(firstIndexFromKeyword + 4)
    .trim()
    .replace(';', '')
    .replace(/['"]+/g, '');

  named.forEach((name) => {
    exportElement.addNamed(name);
  });

  exportElement.setModule(module);

  return exportElement;
}

export function mapEnums(enumfromFile: ts.EnumDeclaration) {
  let enumOb: EnumDeclaration = new EnumDeclaration();
  enumOb.setName(enumfromFile.name.text);

  // export enum
  if (enumfromFile.modifiers) {
    enumfromFile.modifiers.forEach((modifier) => {
      enumOb.addModifier(mapModifier(modifier));
    });
  }

  enumfromFile.members.forEach((member) => {
    let enumElement: EnumElement = new EnumElement();
    if (member.name != null) {
      enumElement.setName((<ts.Identifier>member.name).text);
    }
    if (member.initializer != null) {
      enumElement.setInitializer((<ts.Identifier>member.initializer).text);
    }
    enumOb.addElement(enumElement);
  });

  return enumOb;
}

export function mapExpressions(
  expressionfromFile: ts.ExpressionStatement,
  sourceFile: ts.SourceFile
) {
  let expressionOb: ExpressionDeclaration = new ExpressionDeclaration();

  let innerExpression: any = expressionfromFile.expression;
  if (innerExpression) {
    if (innerExpression.text) {
      expressionOb.setName(innerExpression.text);
    } else {
      let text = (<ts.Identifier>innerExpression.expression).text;
      if (text) {
        expressionOb.setName(text);
      } else {
        // When we have a expression like TestBed.configureTestingModule({...})
        text =
          innerExpression.expression.expression.text +
          '.' +
          innerExpression.expression.name.text;
        expressionOb.setName(text);
      }
      expressionOb.addArguments(
        mapArguments(innerExpression.arguments, sourceFile)
      );
    }
  }

  return expressionOb;
}

export function mapObjectLiteral(
  objectFromFile: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile
) {
  let objLiteral: ObjectLiteralExpression = new ObjectLiteralExpression();
  objectFromFile.properties.forEach((property) => {
    let propertyFromFile = <ts.PropertyAssignment>property;
    let propertyAssignment: PropertyAssignment = new PropertyAssignment();
    // The following lines are needed for destructuring arrays (bla = {...this.bla})
    let propertyText = undefined;
    let nodeObject: any = property;
    if (nodeObject.expression !== undefined) {
      propertyText = nodeObject.expression.name.text;
      propertyAssignment.setIdentifier(propertyText);
      propertyAssignment.setGeneral('...this.' + propertyText);
      objLiteral.addProperty(propertyAssignment);
      return;
    }
    propertyText = (<ts.Identifier>property.name).text;
    propertyAssignment.setIdentifier(propertyText);
    if (propertyFromFile.initializer) {
      setExtractedObjectValues(
        propertyFromFile,
        propertyAssignment,
        sourceFile
      );
    }
    objLiteral.addProperty(propertyAssignment);
  });

  return objLiteral;
}

function setExtractedObjectValues(
  readObject,
  extractedObject,
  sourceFile: ts.SourceFile
): void {
  switch (readObject.initializer.kind) {
    case ts.SyntaxKind.Identifier:
      extractedObject.setGeneral((<ts.Identifier>readObject.initializer).text);
      break;
    case ts.SyntaxKind.ArrayLiteralExpression:
      extractedObject.setGeneral(
        mapArrayLiteral(
          (<ts.ArrayLiteralExpression>readObject.initializer).elements,
          sourceFile
        )
      );
      break;
    case ts.SyntaxKind.ObjectLiteralExpression:
      extractedObject.setGeneral(
        mapObjectLiteral(
          <ts.ObjectLiteralExpression>readObject.initializer,
          sourceFile
        )
      );
      break;
    case ts.SyntaxKind.StringLiteral:
      extractedObject.setGeneral(
        "'" + (<ts.StringLiteral>readObject.initializer).text + "'"
      );
      break;
    case ts.SyntaxKind.NullKeyword:
      extractedObject.setGeneral('null');
      break;
    case ts.SyntaxKind.CallExpression:
      extractedObject.setGeneral(
        mapCallExpression(<ts.CallExpression>readObject.initializer, sourceFile)
      );
      break;
    default:
      extractedObject.setGeneral(
        readObject.initializer.getFullText(sourceFile)
      );
  }
}

export function mapCallExpression(
  node: ts.CallExpression,
  sourceFile: ts.SourceFile
) {
  let expression: CallExpression = new CallExpression();
  let propExpr = <ts.PropertyAccessExpression>node.expression;
  if (propExpr.expression.kind === ts.SyntaxKind.ThisKeyword) {
    expression.setIdentifier('this');
  } else {
    expression.setIdentifier((<ts.Identifier>propExpr.expression).text);
  }
  expression.setName((<ts.Identifier>propExpr.name).text);
  if (node.arguments) {
    mapArguments(node.arguments, sourceFile).forEach((arg) => {
      expression.addArgument(arg);
    });
  }
  return expression;
}

export function mapArguments(
  argumentsVar: ts.NodeArray<ts.Expression>,
  sourceFile: ts.SourceFile
) {
  let argumentsArray: any[] = [];

  argumentsVar.forEach((argument) => {
    switch (argument.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        argumentsArray.push(
          mapObjectLiteral(<ts.ObjectLiteralExpression>argument, sourceFile)
        );
        break;
      case ts.SyntaxKind.StringLiteral:
        argumentsArray.push("'" + (<ts.StringLiteral>argument).text + "'");
        break;
      case ts.SyntaxKind.Identifier:
        argumentsArray.push((<ts.Identifier>argument).text);
        break;
      case ts.SyntaxKind.ArrowFunction:
        let functionBody: ts.ConciseBody = (<ts.ArrowFunction>argument).body;

        if (functionBody) {
          let bodyMethod = mapBodyMethod(
            functionBody.getFullText(sourceFile),
            true
          );
          bodyMethod.setIsArrowFunction(true);
          argumentsArray.push(bodyMethod);
        }
        break;
    }
  });

  return argumentsArray;
}

export function mapArrayLiteral(
  elements: ts.NodeArray<any>,
  sourceFile: ts.SourceFile
) {
  let array: ArrayLiteralExpression = new ArrayLiteralExpression();
  elements.forEach((element) => {
    switch (element.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        array.addElement(
          mapObjectLiteral(<ts.ObjectLiteralExpression>element, sourceFile)
        );
        break;
      case ts.SyntaxKind.Identifier:
        array.addElement((<ts.Identifier>element).text);
        break;
      case ts.SyntaxKind.StringLiteral:
        array.addElement("'" + (<ts.StringLiteral>element).text + "'");
        break;
      case ts.SyntaxKind.CallExpression:
        array.addElement(
          mapCallExpression(<ts.CallExpression>element, sourceFile)
        );
        break;
      default:
        array.addElement(element.getFullText(sourceFile));
    }
  });
  return array;
}

export function mapImport(fileImport: ts.ImportDeclaration) {
  let importElement: ImportDeclaration = new ImportDeclaration();
  importElement.setModule((<ts.Identifier>fileImport.moduleSpecifier).text);
  if (fileImport.importClause) {
    if (fileImport.importClause.namedBindings) {
      if (
        fileImport.importClause.namedBindings.kind ===
        ts.SyntaxKind.NamedImports
      ) {
        (<ts.NamedImports>(
          fileImport.importClause.namedBindings
        )).elements.forEach((named) => {
          if (named.propertyName) {
            importElement.addNamed(
              named.propertyName.text + ' as ' + <string>named.name.text
            );
          } else {
            importElement.addNamed(<string>named.name.text);
          }
        });
      } else {
        importElement.setNamespace(
          (<ts.NamespaceImport>fileImport.importClause.namedBindings).name.text
        );
      }
    } else if (fileImport.importClause.name) {
      importElement.setClause(
        (<ts.Identifier>fileImport.importClause.name).text
      );
    }
  } else {
    importElement.setSpaceBinding(false);
  }
  return importElement;
}

export function mapExport(fileExport: ts.ExportDeclaration) {
  let exportElement: ExportDeclaration = new ExportDeclaration();
  exportElement.setModule((<ts.Identifier>fileExport.moduleSpecifier).text);
  if (fileExport.exportClause) {
    fileExport.exportClause.elements.forEach((named) => {
      if (named.propertyName) {
        exportElement.addNamed(
          named.propertyName.text + ' as ' + <string>named.name.text
        );
      } else {
        exportElement.addNamed(<string>named.name.text);
      }
    });
  }
  if (!fileExport.exportClause) {
    exportElement.setSpaceBinding(false);
  }
  return exportElement;
}

export function mapClass(
  fileClass: ts.ClassDeclaration,
  sourceFile: ts.SourceFile
) {
  let classTo: ClassDeclaration = new ClassDeclaration();
  classTo.parseComments(fileClass, sourceFile);
  classTo.setIdentifier(fileClass.name.text);
  if (fileClass.decorators) {
    fileClass.decorators.forEach((decorator) => {
      classTo.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }
  if (fileClass.modifiers) {
    fileClass.modifiers.forEach((modifier) => {
      classTo.addModifier(mapModifier(modifier));
    });
  }
  if (fileClass.heritageClauses) {
    fileClass.heritageClauses.forEach((heritage) => {
      classTo.addHeritage(heritage.getFullText(sourceFile));
    });
  }

  if (fileClass.members) {
    fileClass.members.forEach((member) => {
      switch (member.kind) {
        case ts.SyntaxKind.PropertyDeclaration:
          classTo.addProperty(
            mapPropertyDeclaration(<ts.PropertyDeclaration>member, sourceFile)
          );
          break;
        case ts.SyntaxKind.Constructor:
          let fileCtr: ts.ConstructorDeclaration = <ts.ConstructorDeclaration>(
            member
          );
          let ctr: Constructor = mapConstructor(fileCtr, sourceFile);
          if (fileCtr.body) {
            ctr.setBody(
              mapBodyMethod(fileCtr.body.getFullText(sourceFile), false)
            );
          }
          classTo.setConstructor(ctr);

          break;
        case ts.SyntaxKind.MethodDeclaration:
          let fileMethod: ts.MethodDeclaration = <ts.MethodDeclaration>member;
          let method: Method = mapMethod(fileMethod, sourceFile);

          if (fileMethod.body) {
            method.setBody(
              mapBodyMethod(fileMethod.body.getFullText(sourceFile), false)
            );
          }
          classTo.addMethod(method);
          break;
      }
    });
  }
  return classTo;
}

export function mapInterface(fileInterface: any, sourceFile: ts.SourceFile) {
  let interfaceTo: InterfaceDeclaration = new InterfaceDeclaration();
  interfaceTo.parseComments(fileInterface, sourceFile);
  interfaceTo.setIdentifier(fileInterface.name.text);
  if (fileInterface.modifiers) {
    fileInterface.modifiers.forEach((modifier) => {
      interfaceTo.addModifier(mapModifier(modifier));
    });
  }
  if (fileInterface.heritageClauses) {
    fileInterface.heritageClauses.forEach((heritage) => {
      interfaceTo.addHeritage(heritage.getFullText(sourceFile));
    });
  }

  if (fileInterface.members) {
    fileInterface.members.forEach((member) => {
      switch (member.kind) {
        case ts.SyntaxKind.PropertySignature:
          let propertyInterface: InterfaceProperty = mapInterfaceProperty(
            <string>member.name.text,
            <string>member.getFullText(sourceFile)
          );
          interfaceTo.addProperty(propertyInterface);
          break;
        case ts.SyntaxKind.IndexSignature:
          interfaceTo.setIndex(<string>member.getFullText(sourceFile));
          break;
        case ts.SyntaxKind.CallSignature:
          break;
        case ts.SyntaxKind.MethodSignature:
          let fileMethod: ts.MethodDeclaration = <ts.MethodDeclaration>member;
          let method: InterfaceMethod = mapInterfaceMethod(
            fileMethod,
            sourceFile
          );

          interfaceTo.addMethod(method);
          break;
      }
    });
  }
  return interfaceTo;
}

export function mapPropertyDeclaration(
  property: ts.PropertyDeclaration,
  sourceFile: ts.SourceFile
) {
  let prop: PropertyDeclaration = new PropertyDeclaration();
  prop.setIdentifier((<ts.Identifier>property.name).text);
  if (property.type) {
    prop.setType(mapTypes(property.type));
  }

  if (property.modifiers) {
    property.modifiers.forEach((modifier) => {
      prop.addModifier(mapModifier(modifier));
    });
  }

  if (property.decorators) {
    property.decorators.forEach((decorator) => {
      prop.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }

  if (property.questionToken) {
    prop.setIsOptional(true);
  }

  if (property.initializer) {
    switch (property.initializer.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        prop.setInitializer(
          mapObjectLiteral(
            <ts.ObjectLiteralExpression>property.initializer,
            sourceFile
          )
        );
        break;
      case ts.SyntaxKind.ArrayLiteralExpression:
        prop.setInitializer(
          mapArrayLiteral(
            (<ts.ArrayLiteralExpression>property.initializer).elements,
            sourceFile
          )
        );
        break;
      case ts.SyntaxKind.StringLiteral:
        prop.setInitializer(
          "'" + (<ts.StringLiteral>property.initializer).text + "'"
        );
        break;
      case ts.SyntaxKind.TrueKeyword:
        prop.setInitializer('true');
        break;
      case ts.SyntaxKind.FalseKeyword:
        prop.setInitializer('false');
        break;
      case ts.SyntaxKind.Identifier:
        prop.setInitializer((<ts.Identifier>property.initializer).text);
        break;
      case ts.SyntaxKind.CallExpression:
        prop.setInitializer(
          mapCallExpression(<ts.CallExpression>property.initializer, sourceFile)
        );
        break;
      default:
        prop.setInitializer(
          property.initializer.getFullText(sourceFile).substr(1)
        );
    }
  }
  return prop;
}

export function mapInterfaceProperty(id: string, text: string) {
  let prop: InterfaceProperty = new InterfaceProperty();
  prop.setId(id);
  prop.setText(text);

  return prop;
}

export function mapTypes(type: ts.Node) {
  let typeToReturn: String[] = [];
  switch (type.kind) {
    case ts.SyntaxKind.AnyKeyword:
      return 'any';
    case ts.SyntaxKind.NumberKeyword:
      return 'number';
    case ts.SyntaxKind.StringKeyword:
      return 'string';
    case ts.SyntaxKind.BooleanKeyword:
      return 'boolean';
    case ts.SyntaxKind.NullKeyword:
      return 'null';
    case ts.SyntaxKind.UndefinedKeyword:
      return 'undefined';
    case ts.SyntaxKind.TypeReference:
      typeToReturn.push(
        (<ts.Identifier>(<ts.TypeReferenceNode>type).typeName).text
      );
      if ((<ts.TypeReferenceNode>type).typeArguments) {
        typeToReturn.push('<');
        (<ts.TypeReferenceNode>type).typeArguments.forEach((arg) => {
          if (<ts.Identifier>(<ts.TypeReferenceNode>arg).typeName) {
            typeToReturn.push(
              (<ts.Identifier>(<ts.TypeReferenceNode>arg).typeName).text
            );
            if (
              (<ts.TypeReferenceNode>type).typeArguments.indexOf(arg) <
              (<ts.TypeReferenceNode>type).typeArguments.length - 1
            ) {
              typeToReturn.push(', ');
            }
          } else {
            typeToReturn.push(mapTypes(arg));
          }
        });
        typeToReturn.push('>');
      }
      return typeToReturn.join('');
    case ts.SyntaxKind.TupleType:
      let tuple: String[] = [];
      tuple.push('[');
      let elementTypes = (<ts.TupleTypeNode>type).elementTypes;
      elementTypes.forEach((elementType) => {
        tuple.push(mapTypes(<ts.TypeNode>elementType));
        if (elementTypes.indexOf(elementType) < elementTypes.length - 1) {
          tuple.push(', ');
        }
      });
      tuple.push(']');
      return tuple.join('');
    case ts.SyntaxKind.ArrayType:
      return mapTypes((<ts.ArrayTypeNode>type).elementType) + '[]';
    case ts.SyntaxKind.VoidKeyword:
      return 'void';
  }
}

export function mapConstructor(
  fileCtr: ts.ConstructorDeclaration,
  sourceFile: ts.SourceFile
) {
  let ctr: Constructor = new Constructor();

  if (fileCtr.decorators) {
    fileCtr.decorators.forEach((decorator) => {
      ctr.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }
  ctr.setIdentifier('constructor');
  if (fileCtr.parameters) {
    fileCtr.parameters.forEach((parameter) => {
      ctr.addParameter(mapParameter(parameter, sourceFile));
    });
  }

  return ctr;
}

export function mapParameter(
  parameter: ts.ParameterDeclaration,
  sourceFile: ts.SourceFile
) {
  let param: Parameter = new Parameter();
  if (parameter.decorators) {
    parameter.decorators.forEach((decorator) => {
      param.addDecorators(mapDecorator(decorator, sourceFile));
    });
  }
  if (parameter.modifiers) {
    parameter.modifiers.forEach((modifier) => {
      param.addModifier(mapModifier(modifier));
    });
  }
  param.setIdentifier((<ts.Identifier>parameter.name).text);
  if (parameter.type) param.setType(mapTypes(parameter.type));
  if (parameter.initializer) {
    setExtractedObjectValues(parameter, param, sourceFile);
  }
  return param;
}

export function mapMethod(
  fileMethod: ts.MethodDeclaration,
  sourceFile: ts.SourceFile
) {
  let method: Method = new Method();
  method.setIdentifier(
    (<ts.Identifier>(<ts.MethodDeclaration>fileMethod).name).text
  );
  if (fileMethod.type) {
    method.setType(mapTypes(fileMethod.type));
  }

  if (fileMethod.decorators) {
    fileMethod.decorators.forEach((decorator) => {
      method.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }
  if (fileMethod.modifiers) {
    fileMethod.modifiers.forEach((modifier) => {
      method.addModifier(mapModifier(modifier));
    });
  }
  if (fileMethod.parameters) {
    fileMethod.parameters.forEach((parameter) => {
      method.addParameter(mapParameter(parameter, sourceFile));
    });
  }

  return method;
}

export function mapCallSignature(
  fileMethod: ts.MethodDeclaration,
  sourceFile: ts.SourceFile
) {
  let method: InterfaceMethod = new InterfaceMethod();
  method.setIdentifier(
    (<ts.Identifier>(<ts.MethodDeclaration>fileMethod).name).text
  );
  if (fileMethod.type) {
    method.setType(mapTypes(fileMethod.type));
  }

  if (fileMethod.decorators) {
    fileMethod.decorators.forEach((decorator) => {
      method.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }
  if (fileMethod.parameters) {
    fileMethod.parameters.forEach((parameter) => {
      method.addParameter(mapParameter(parameter, sourceFile));
    });
  }

  return method;
}

export function mapInterfaceMethod(
  fileMethod: ts.MethodDeclaration,
  sourceFile: ts.SourceFile
) {
  let method: InterfaceMethod = new InterfaceMethod();
  method.setIdentifier(
    (<ts.Identifier>(<ts.MethodDeclaration>fileMethod).name).text
  );
  if (fileMethod.type) {
    method.setType(mapTypes(fileMethod.type));
  }

  if (fileMethod.decorators) {
    fileMethod.decorators.forEach((decorator) => {
      method.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }
  if (fileMethod.parameters) {
    fileMethod.parameters.forEach((parameter) => {
      method.addParameter(mapParameter(parameter, sourceFile));
    });
  }

  return method;
}

export function mapModifier(modifier: ts.Modifier) {
  switch (modifier.kind) {
    case ts.SyntaxKind.PrivateKeyword:
      return 'private';
    case ts.SyntaxKind.PublicKeyword:
      return 'public';
    case ts.SyntaxKind.ExportKeyword:
      return 'export';
    case ts.SyntaxKind.AsyncKeyword:
      return 'async';
  }
}

export function mapDecorator(
  decorator: ts.Decorator,
  sourceFile: ts.SourceFile
) {
  let decorators: Decorator[] = [];
  let decoratorElement: Decorator = new Decorator();

  switch (decorator.expression.kind) {
    case ts.SyntaxKind.CallExpression:
      decoratorElement.setIsCallExpression(true);
      decoratorElement.setIdentifier(
        (<ts.Identifier>(<ts.CallExpression>decorator.expression).expression)
          .text
      );
      let argumentsArray = (<ts.CallExpression>decorator.expression).arguments;
      if (argumentsArray) {
        argumentsArray.forEach((argument) => {
          switch (argument.kind) {
            case ts.SyntaxKind.ObjectLiteralExpression:
              decoratorElement.addArgument(
                mapObjectLiteral(
                  <ts.ObjectLiteralExpression>argument,
                  sourceFile
                )
              );
              break;
            case ts.SyntaxKind.TrueKeyword:
              decoratorElement.addArgument(true);
              break;
            case ts.SyntaxKind.FalseKeyword:
              decoratorElement.addArgument(false);
              break;
            case ts.SyntaxKind.Identifier:
              decoratorElement.addArgument((<ts.Identifier>argument).text);
              break;
            case ts.SyntaxKind.StringLiteral:
              decoratorElement.addArgument(
                "'" + (<ts.StringLiteral>argument).text + "'"
              );
              break;
            //ADD MORE CASES FOR OTHER NODE TYPES
          }
        });
        decorators.push(decoratorElement);
      }
      break;
    case ts.SyntaxKind.Identifier:
      decoratorElement.setIdentifier(
        (<ts.Identifier>(<ts.Decorator>decorator).expression).text
      );
      decorators.push(decoratorElement);
      break;
  }
  return decorators;
}

export function mapBodyMethod(body: String, isScriptFunction: boolean) {
  let bodySource: ts.SourceFile = ts.createSourceFile(
    'body',
    <string>body,
    ts.ScriptTarget.ES2016,
    false
  );
  let bodyMethod: BodyMethod = new BodyMethod();
  bodySource
    .getChildAt(0)
    .getChildren()
    .forEach((child) => {
      if ((<ts.Block>child).statements) {
        (<ts.Block>child).statements.forEach((statement) => {
          switch (statement.kind) {
            case ts.SyntaxKind.VariableStatement:
              bodyMethod.addStatement(
                mapVariableStatement(
                  <ts.VariableStatement>statement,
                  bodySource
                )
              );
              break;
            case ts.SyntaxKind.ExpressionStatement:
              if (isScriptFunction) {
                bodyMethod.addStatement(
                  mapExpressions(<ts.ExpressionStatement>statement, bodySource)
                );
              } else {
                bodyMethod.addStatement(statement.getFullText(bodySource));
              }
              break;
            default:
              bodyMethod.addStatement(statement.getFullText(bodySource));
          }
        });
      }
    });
  return bodyMethod;
}

export function mapVariableStatement(
  statement: ts.VariableStatement,
  source: ts.SourceFile
) {
  let variable: VariableStatement = new VariableStatement();
  let fileVariable: ts.VariableStatement = <ts.VariableStatement>statement;
  if (fileVariable.getFullText(source).search('const ') > -1) {
    variable.setIsConst(true);
  }

  let properties = [];
  let bindingElements =
    statement.declarationList.declarations[0].name['elements'];
  if (bindingElements) {
    bindingElements.forEach((bindingElement) => {
      if (bindingElement.kind == ts.SyntaxKind.BindingElement) {
        properties.push(bindingElement.name['escapedText']);
      }
    });
    variable.setProperties(properties);
  }

  let text = fileVariable.getFullText(source);
  let index = text.indexOf('await');
  if (index !== -1) {
    let charBefore = text.substr(index - 1, 1);

    if (charBefore === ' ' || charBefore === '=') {
      variable.setIsAsync(true);
    }
  }

  if (fileVariable.modifiers) {
    fileVariable.modifiers.forEach((modifier) => {
      variable.addModifier(mapModifier(modifier));
    });
  }
  if (fileVariable.decorators) {
    fileVariable.decorators.forEach((decorator) => {
      variable.addDecorators(mapDecorator(decorator, source));
    });
  }
  variable.setIdentifier(
    (<ts.Identifier>fileVariable.declarationList.declarations[0].name).text
  );
  if (fileVariable.declarationList.declarations[0].type) {
    variable.setType(
      mapTypes(fileVariable.declarationList.declarations[0].type)
    );
  }
  if (
    (<ts.VariableStatement>statement).declarationList.declarations[0]
      .initializer
  ) {
    switch (
    (<ts.VariableStatement>statement).declarationList.declarations[0]
      .initializer.kind
    ) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        variable.setInitializer(
          mapObjectLiteral(
            <ts.ObjectLiteralExpression>(
              fileVariable.declarationList.declarations[0].initializer
            ),
            source
          )
        );
        break;
      case ts.SyntaxKind.ArrayLiteralExpression:
        variable.setInitializer(
          mapArrayLiteral(
            (<ts.ArrayLiteralExpression>(
              fileVariable.declarationList.declarations[0].initializer
            )).elements,
            source
          )
        );
        break;
      case ts.SyntaxKind.StringLiteral:
        variable.setInitializer(
          "'" +
          (<ts.StringLiteral>(
            fileVariable.declarationList.declarations[0].initializer
          )).text +
          "'"
        );
        break;
      case ts.SyntaxKind.TrueKeyword:
        variable.setInitializer('true');
        break;
      case ts.SyntaxKind.FalseKeyword:
        variable.setInitializer('false');
        break;
      case ts.SyntaxKind.Identifier:
        variable.setInitializer(
          (<ts.Identifier>(
            fileVariable.declarationList.declarations[0].initializer
          )).text
        );
        break;
      default:
        variable.setInitializer(
          (<ts.VariableStatement>(
            statement
          )).declarationList.declarations[0].initializer.getFullText(source)
        );
    }
  }
  return variable;
}

export function mapFunction(
  fileFunction: ts.FunctionDeclaration,
  sourceFile: ts.SourceFile
) {
  let func: FunctionDeclaration = new FunctionDeclaration();
  func.setIdentifier(
    (<ts.Identifier>(<ts.FunctionDeclaration>fileFunction).name).text
  );
  if (fileFunction.type) {
    func.setType(mapTypes(fileFunction.type));
  }

  if (fileFunction.decorators) {
    fileFunction.decorators.forEach((decorator) => {
      func.addDecorators(mapDecorator(<ts.Decorator>decorator, sourceFile));
    });
  }
  if (fileFunction.modifiers) {
    fileFunction.modifiers.forEach((modifier) => {
      func.addModifier(mapModifier(modifier));
    });
  }
  if (fileFunction.parameters) {
    fileFunction.parameters.forEach((parameter) => {
      func.addParameter(mapParameter(parameter, sourceFile));
    });
  }

  if (fileFunction.body) {
    func.setBody(
      mapBodyMethod(fileFunction.body.getFullText(sourceFile), false)
    );
  }

  return func;
}
