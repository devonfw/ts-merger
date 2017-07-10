import { FunctionDeclaration } from './general/FunctionDeclaration';
import { VariableStatement } from './general/VariableStatement';
import { ClassDeclaration } from './classDeclaration/ClassDeclaration';
import { ImportDeclaration } from './import/ImportDeclaration';
import * as mergeTools from '../tools/MergerTools';

export class TSFile {
    private importDeclarations: ImportDeclaration[] = [];
    private classes: ClassDeclaration[] = [];
    private variables: VariableStatement[] = [];
    private functions: FunctionDeclaration[] = [];

    addImport(importDeclaration: ImportDeclaration){
        this.importDeclarations.push(importDeclaration);
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

    // setClass(classDeclaration: ClassDeclaration){
    //     this.class = classDeclaration;
    // }

    getClasses() {
        return this.classes;
    }

    getImports() {
        return this.importDeclarations;
    }

    addVariable(variable: VariableStatement) {
        this.variables.push(variable);
    }

    getVariables() {
        return this.variables;
    }

    merge(patchFile: TSFile, patchOverrides: boolean) {
        
        mergeTools.mergeImports(this, patchFile);
        let exists: boolean = false;
        patchFile.getClasses().forEach(patchClass => {
            exists = false;
            this.getClasses().forEach(baseClass => {
                if(patchClass.getIdentifier() === baseClass.getIdentifier()) {
                    exists = true;
                    mergeTools.mergeClass(baseClass, patchClass, patchOverrides);
                }
            })
            if(!exists) {
                this.classes.push(patchClass);
            }
        })
        if(this.variables.length > 0) {
            mergeTools.mergeVariables(this, patchFile, patchOverrides);
        }
        if(this.functions.length > 0) {
            mergeTools.mergeFunctions(this.functions, patchFile.getFunctions(), patchOverrides);
        }
    }

    toString() {
        let file: String[] = [];
        this.importDeclarations.forEach(importDeclaration => {
            file.push(importDeclaration.toString());
        })
        file.push("\n");

        this.functions.forEach(func => {
            file.push(func.toString());
        })
        this.variables.forEach(variable => {
            file.push(variable.toString());
        })
        this.classes.forEach(classToPrint => {
            file.push(classToPrint.toString());
        })
        return file.join("");
    }

}