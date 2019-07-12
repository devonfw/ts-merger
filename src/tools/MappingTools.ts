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
import { GeneralInterface } from '../components/general/GeneralInterface';
import { ArrayLiteralExpression } from '../components/general/ArrayLiteralExpression';
import { PropertyAssignment } from '../components/general/PropertyAssignment';
import { ObjectLiteralExpression } from '../components/general/ObjectLiteralExpression';
import * as ts from 'typescript';
import { BodyMethod } from '../components/classDeclaration/members/method/body/BodyMethod';
import InterfaceProperty from '../components/interfaceDeclaration/members/InterfaceProperty';
import { EnumDeclaration } from '../components/general/EnumDeclaration';
import { EnumElement } from '../components/general/EnumElement';
import { SyntaxKind } from 'typescript';

export function mapFile(sourceFile: ts.SourceFile) {
  let file: TSFile = new TSFile();

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
            mapInterface(<ts.InterfaceDeclaration>child, sourceFile),
          );
          break;
        case ts.SyntaxKind.VariableStatement:
          file.addVariable(
            mapVariableStatement(<ts.VariableStatement>child, sourceFile),
          );
          break;
        case ts.SyntaxKind.FunctionDeclaration:
          file.addFunction(
            mapFunction(<ts.FunctionDeclaration>child, sourceFile),
          );
          break;
        case ts.SyntaxKind.EnumDeclaration:
          file.addEnum(mapEnums(<ts.EnumDeclaration>child, sourceFile));
      }
    });
  return file;
}

export function mapEnums(
  enumfromFile: ts.EnumDeclaration,
  sourceFile: ts.SourceFile,
) {
  let enumOb: EnumDeclaration = new EnumDeclaration();
  enumOb.setName(enumfromFile.name.text);

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

export function mapObjectLiteral(
  objectFromFile: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
) {
  let objLiteral: ObjectLiteralExpression = new ObjectLiteralExpression();
  objectFromFile.properties.forEach((property) => {
    let propertyFromFile = <ts.PropertyAssignment>property;
    let propertyAssignment: PropertyAssignment = new PropertyAssignment();
    propertyAssignment.setIdentifier((<ts.Identifier>property.name).text);
    switch (propertyFromFile.initializer.kind) {
      case ts.SyntaxKind.ArrayLiteralExpression:
        propertyAssignment.setGeneral(
          mapArrayLiteral(
            (<ts.ArrayLiteralExpression>propertyFromFile.initializer).elements,
            sourceFile,
          ),
        );
        break;
      case ts.SyntaxKind.ObjectLiteralExpression:
        propertyAssignment.setGeneral(
          mapObjectLiteral(
            <ts.ObjectLiteralExpression>propertyFromFile.initializer,
            sourceFile,
          ),
        );
        break;
      case ts.SyntaxKind.Identifier:
        propertyAssignment.setGeneral(
          (<ts.Identifier>propertyFromFile.initializer).text,
        );
        break;
      case ts.SyntaxKind.StringLiteral:
        propertyAssignment.setGeneral(
          "'" + (<ts.StringLiteral>propertyFromFile.initializer).text + "'",
        );
        break;
      case ts.SyntaxKind.NullKeyword:
        propertyAssignment.setGeneral('null');
        break;
      case ts.SyntaxKind.CallExpression:
        propertyAssignment.setGeneral(
          mapCallExpression(
            <ts.CallExpression>propertyFromFile.initializer,
            sourceFile,
          ),
        );
        break;
      default:
        propertyAssignment.setGeneral(
          propertyFromFile.initializer.getFullText(sourceFile),
        );
    }
    objLiteral.addProperty(propertyAssignment);
  });

  return objLiteral;
}

export function mapCallExpression(
  node: ts.CallExpression,
  sourceFile: ts.SourceFile,
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
    node.arguments.forEach((argument) => {
      switch (argument.kind) {
        case ts.SyntaxKind.ObjectLiteralExpression:
          expression.addArgument(
            mapObjectLiteral(<ts.ObjectLiteralExpression>argument, sourceFile),
          );
          break;
        case ts.SyntaxKind.StringLiteral:
          expression.addArgument("'" + (<ts.StringLiteral>argument).text + "'");
          break;
        case ts.SyntaxKind.Identifier:
          expression.addArgument((<ts.Identifier>argument).text);
          break;
      }
    });
  }
  return expression;
}

export function mapArrayLiteral(
  elements: ts.NodeArray<any>,
  sourceFile: ts.SourceFile,
) {
  let array: ArrayLiteralExpression = new ArrayLiteralExpression();
  elements.forEach((element) => {
    switch (element.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        array.addElement(
          mapObjectLiteral(<ts.ObjectLiteralExpression>element, sourceFile),
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
          mapCallExpression(<ts.CallExpression>element, sourceFile),
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
              named.propertyName.text + ' as ' + <string>named.name.text,
            );
          } else {
            importElement.addNamed(<string>named.name.text);
          }
        });
      } else {
        importElement.setNamespace(
          (<ts.NamespaceImport>fileImport.importClause.namedBindings).name.text,
        );
      }
    } else if (fileImport.importClause.name) {
      importElement.setClause(
        (<ts.Identifier>fileImport.importClause.name).text,
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
          named.propertyName.text + ' as ' + <string>named.name.text,
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
  sourceFile: ts.SourceFile,
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
            mapPropertyDeclaration(<ts.PropertyDeclaration>member, sourceFile),
          );
          break;
        case ts.SyntaxKind.Constructor:
          let fileCtr: ts.ConstructorDeclaration = <ts.ConstructorDeclaration>(
            member
          );
          let ctr: Constructor = mapConstructor(fileCtr, sourceFile);
          if (fileCtr.body) {
            ctr.setBody(mapBodyMethod(fileCtr.body.getFullText(sourceFile)));
          }
          classTo.setConstructor(ctr);

          break;
        case ts.SyntaxKind.MethodDeclaration:
          let fileMethod: ts.MethodDeclaration = <ts.MethodDeclaration>member;
          let method: Method = mapMethod(fileMethod, sourceFile);

          if (fileMethod.body) {
            method.setBody(
              mapBodyMethod(fileMethod.body.getFullText(sourceFile)),
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
            <string>member.getFullText(sourceFile),
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
            sourceFile,
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
  sourceFile: ts.SourceFile,
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
  if (property.initializer) {
    switch (property.initializer.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        prop.setInitializer(
          mapObjectLiteral(
            <ts.ObjectLiteralExpression>property.initializer,
            sourceFile,
          ),
        );
        break;
      case ts.SyntaxKind.ArrayLiteralExpression:
        prop.setInitializer(
          mapArrayLiteral(
            (<ts.ArrayLiteralExpression>property.initializer).elements,
            sourceFile,
          ),
        );
        break;
      case ts.SyntaxKind.StringLiteral:
        prop.setInitializer(
          "'" + (<ts.StringLiteral>property.initializer).text + "'",
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
          mapCallExpression(
            <ts.CallExpression>property.initializer,
            sourceFile,
          ),
        );
        break;
      default:
        prop.setInitializer(
          property.initializer.getFullText(sourceFile).substr(1),
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
    case ts.SyntaxKind.TypeReference:
      typeToReturn.push(
        (<ts.Identifier>(<ts.TypeReferenceNode>type).typeName).text,
      );
      if ((<ts.TypeReferenceNode>type).typeArguments) {
        typeToReturn.push('<');
        (<ts.TypeReferenceNode>type).typeArguments.forEach((arg) => {
          if (<ts.Identifier>(<ts.TypeReferenceNode>arg).typeName) {
            typeToReturn.push(
              (<ts.Identifier>(<ts.TypeReferenceNode>arg).typeName).text,
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
  sourceFile: ts.SourceFile,
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
  sourceFile: ts.SourceFile,
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
  return param;
}

export function mapMethod(
  fileMethod: ts.MethodDeclaration,
  sourceFile: ts.SourceFile,
) {
  let method: Method = new Method();
  method.setIdentifier(
    (<ts.Identifier>(<ts.MethodDeclaration>fileMethod).name).text,
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
  sourceFile: ts.SourceFile,
) {
  let method: InterfaceMethod = new InterfaceMethod();
  method.setIdentifier(
    (<ts.Identifier>(<ts.MethodDeclaration>fileMethod).name).text,
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
  sourceFile: ts.SourceFile,
) {
  let method: InterfaceMethod = new InterfaceMethod();
  method.setIdentifier(
    (<ts.Identifier>(<ts.MethodDeclaration>fileMethod).name).text,
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
  sourceFile: ts.SourceFile,
) {
  let decorators: Decorator[] = [];
  let decoratorElement: Decorator = new Decorator();

  switch (decorator.expression.kind) {
    case ts.SyntaxKind.CallExpression:
      decoratorElement.setIsCallExpression(true);
      decoratorElement.setIdentifier(
        (<ts.Identifier>(<ts.CallExpression>decorator.expression).expression)
          .text,
      );
      let argumentsArray = (<ts.CallExpression>decorator.expression).arguments;
      if (argumentsArray) {
        argumentsArray.forEach((argument) => {
          switch (argument.kind) {
            case ts.SyntaxKind.ObjectLiteralExpression:
              decoratorElement.addArgument(
                mapObjectLiteral(
                  <ts.ObjectLiteralExpression>argument,
                  sourceFile,
                ),
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
                "'" + (<ts.StringLiteral>argument).text + "'",
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
        (<ts.Identifier>(<ts.Decorator>decorator).expression).text,
      );
      decorators.push(decoratorElement);
      break;
  }
  return decorators;
}

export function mapBodyMethod(body: String) {
  let bodySource: ts.SourceFile = ts.createSourceFile(
    'body',
    <string>body,
    ts.ScriptTarget.ES2016,
    false,
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
                  bodySource,
                ),
              );
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
  source: ts.SourceFile,
) {
  let variable: VariableStatement = new VariableStatement();
  let fileVariable: ts.VariableStatement = <ts.VariableStatement>statement;
  if (fileVariable.getFullText(source).search('const ') > -1) {
    variable.setIsConst(true);
  }

  let properties = [];
  let bindingElements = statement.declarationList.declarations[0].name['elements'];
  if (bindingElements) {
    bindingElements.forEach(bindingElement => {
      if (bindingElement.kind == SyntaxKind.BindingElement) {
        properties.push(bindingElement.name['escapedText'])
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
    (<ts.Identifier>fileVariable.declarationList.declarations[0].name).text,
  );
  if (fileVariable.declarationList.declarations[0].type) {
    variable.setType(
      mapTypes(fileVariable.declarationList.declarations[0].type),
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
            source,
          ),
        );
        break;
      case ts.SyntaxKind.ArrayLiteralExpression:
        variable.setInitializer(
          mapArrayLiteral(
            (<ts.ArrayLiteralExpression>(
              fileVariable.declarationList.declarations[0].initializer
            )).elements,
            source,
          ),
        );
        break;
      case ts.SyntaxKind.StringLiteral:
        variable.setInitializer(
          "'" +
          (<ts.StringLiteral>(
            fileVariable.declarationList.declarations[0].initializer
          )).text +
          "'",
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
          )).text,
        );
        break;
      default:
        variable.setInitializer(
          (<ts.VariableStatement>(
            statement
          )).declarationList.declarations[0].initializer.getFullText(source),
        );
    }
  }
  return variable;
}

export function mapFunction(
  fileFunction: ts.FunctionDeclaration,
  sourceFile: ts.SourceFile,
) {
  let func: FunctionDeclaration = new FunctionDeclaration();
  func.setIdentifier(
    (<ts.Identifier>(<ts.FunctionDeclaration>fileFunction).name).text,
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
    func.setBody(mapBodyMethod(fileFunction.body.getFullText(sourceFile)));
  }

  return func;
}
