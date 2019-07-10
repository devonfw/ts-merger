import { FunctionDeclaration } from './general/FunctionDeclaration';
import { VariableStatement } from './general/VariableStatement';
import { ClassDeclaration } from './classDeclaration/ClassDeclaration';
import { InterfaceDeclaration } from './interfaceDeclaration/InterfaceDeclaration';
import { ImportDeclaration } from './import/ImportDeclaration';
import { ExportDeclaration } from './export/ExportDeclaration';
import { EnumDeclaration } from './general/EnumDeclaration';
import { ExpressionDeclaration } from './general/ExpressionDeclaration';
import * as mergeTools from '../tools/MergerTools';

export class TSFile {
  private importDeclarations: ImportDeclaration[];
  private exportDeclarations: ExportDeclaration[];
  private classes: ClassDeclaration[];
  private interfaces: InterfaceDeclaration[];
  private variables: VariableStatement[];
  private functions: FunctionDeclaration[];
  private enums: EnumDeclaration[];
  private expressions: ExpressionDeclaration[];

  constructor() {
    this.importDeclarations = [];
    this.exportDeclarations = [];
    this.classes = [];
    this.interfaces = [];
    this.variables = [];
    this.functions = [];
    this.enums = [];
    this.expressions = [];
  }

  addImport(importDeclaration: ImportDeclaration) {
    this.importDeclarations.push(importDeclaration);
  }

  addExport(exportDeclaration: ExportDeclaration) {
    this.exportDeclarations.push(exportDeclaration);
  }

  addFunction(functionDecl: FunctionDeclaration) {
    this.functions.push(functionDecl);
  }

  getFunctions() {
    return this.functions;
  }

  setFunctions(functions: FunctionDeclaration[]) {
    this.functions = functions;
  }

  addClass(classToAdd: ClassDeclaration) {
    this.classes.push(classToAdd);
  }

  addEnum(enumToAdd: EnumDeclaration) {
    this.enums.push(enumToAdd);
  }

  getEnums() {
    return this.enums;
  }

  addExpression(expressionToAdd: ExpressionDeclaration) {
    this.expressions.push(expressionToAdd);
  }

  getExpressions() {
    return this.expressions;
  }

  // setClass(classDeclaration: ClassDeclaration){
  //     this.class = classDeclaration;
  // }

  getClasses() {
    return this.classes;
  }

  addInterface(interfaceToAdd: InterfaceDeclaration) {
    this.interfaces.push(interfaceToAdd);
  }

  getInterfaces() {
    return this.interfaces;
  }

  getImports() {
    return this.importDeclarations;
  }

  getExports() {
    return this.exportDeclarations;
  }

  addVariable(variable: VariableStatement) {
    this.variables.push(variable);
  }

  getVariables() {
    return this.variables;
  }

  merge(patchFile: TSFile, patchOverrides: boolean) {
    mergeTools.mergeImports(this, patchFile);
    mergeTools.mergeExports(this, patchFile);
    mergeTools.mergeExpressions(this, patchFile, patchOverrides);
    this.checkAndMergeClasses(patchFile, patchOverrides);
    this.checkAndMergeInterfaces(patchFile, patchOverrides);
    this.checkAndMergeEnums(patchFile, patchOverrides);
  }

  checkAndMergeEnums(patchFile: TSFile, patchOverrides: boolean) {
    let exists: boolean = false;
    patchFile.getEnums().forEach((patchEnum) => {
      exists = false;
      this.getEnums().forEach((baseEnum) => {
        if (patchEnum.getName() === baseEnum.getName()) {
          exists = true;
          patchEnum.merge(baseEnum, patchEnum, patchOverrides);
        }
      });
      if (!exists) {
        this.enums.push(patchEnum);
      }
    });
  }

  checkAndMergeClasses(patchFile: TSFile, patchOverrides: boolean) {
    let exists: boolean = false;
    patchFile.getClasses().forEach((patchClass) => {
      exists = false;
      this.getClasses().forEach((baseClass) => {
        if (patchClass.getIdentifier() === baseClass.getIdentifier()) {
          exists = true;
          mergeTools.mergeClass(baseClass, patchClass, patchOverrides);
        }
      });
      if (!exists) {
        this.classes.push(patchClass);
      }
    });
    if (this.variables.length > 0) {
      mergeTools.mergeVariables(this, patchFile, patchOverrides);
    }
    if (this.functions.length > 0) {
      mergeTools.mergeFunctions(
        this.functions,
        patchFile.getFunctions(),
        patchOverrides,
      );
    }
  }

  checkAndMergeInterfaces(patchFile: TSFile, patchOverrides: boolean) {
    let exists: boolean = false;
    patchFile.getInterfaces().forEach((patchInterface) => {
      exists = false;
      this.getInterfaces().forEach((baseInterface) => {
        if (patchInterface.getIdentifier() === baseInterface.getIdentifier()) {
          exists = true;
          mergeTools.mergeInterface(
            baseInterface,
            patchInterface,
            patchOverrides,
          );
        }
      });
      if (!exists) {
        this.interfaces.push(patchInterface);
      }
    });
    if (this.variables.length > 0) {
      mergeTools.mergeVariables(this, patchFile, patchOverrides);
    }
    if (this.functions.length > 0) {
      mergeTools.mergeFunctions(
        this.functions,
        patchFile.getFunctions(),
        patchOverrides,
      );
    }
  }

  toString() {
    let file: String[] = [];
    this.importDeclarations.forEach((importDeclaration) => {
      file.push(importDeclaration.toString());
    });
    this.exportDeclarations.forEach((exportDeclaration) => {
      file.push(exportDeclaration.toString());
    });
    file.push('\n');

    this.functions.forEach((func) => {
      file.push(func.toString());
    });
    this.expressions.forEach((expr) => {
      file.push(expr.toString());
    });
    this.variables.forEach((variable) => {
      file.push(variable.toString());
    });
    this.classes.forEach((classToPrint) => {
      file.push(classToPrint.toString());
    });
    this.interfaces.forEach((interfaceToPrint) => {
      file.push(interfaceToPrint.toString());
    });
    this.enums.forEach((enumToPrint) => {
      file.push(enumToPrint.toString());
    });
    return file.join('');
  }
}
