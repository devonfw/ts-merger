import { FunctionDeclaration } from './general/FunctionDeclaration';
import { VariableStatement } from './general/VariableStatement';
import { ClassDeclaration } from './classDeclaration/ClassDeclaration';
import { ImportClause } from './import/ImportClause';
import * as mergeTools from '../tools/MergerTools';

export class TSFile {
    private importClauses: ImportClause[] = [];
    private class: ClassDeclaration;
    private variables: VariableStatement[] = [];
    private functions: FunctionDeclaration[] = [];

    addImport(importClause: ImportClause){
        this.importClauses.push(importClause);
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
    setClass(classDeclaration: ClassDeclaration){
        this.class = classDeclaration;
    }

    getClass() {
        return this.class;
    }

    getImports() {
        return this.importClauses;
    }

    addVariable(variable: VariableStatement) {
        this.variables.push(variable);
    }

    getVariables() {
        return this.variables;
    }

    merge(patchFile: TSFile, patchOverrides: boolean) {
        if(this.importClauses.length > 0) {
            mergeTools.mergeImports(this, patchFile);
        }
        if(this.class){
            mergeTools.mergeClass(this, patchFile, patchOverrides);
        }
        if(this.variables.length > 0) {
            mergeTools.mergeVariables(this, patchFile, patchOverrides);
        }
        if(this.functions.length > 0) {
            mergeTools.mergeFunctions(this.functions, patchFile.getFunctions(), patchOverrides);
        }
    }

    toString() {
        let file: String[] = [];
        this.importClauses.forEach(importClause => {
            file.push(importClause.toString());
        })
        file.push("\n");

        this.functions.forEach(func => {
            file.push(func.toString());
        })
        if(this.class){
            file.push(this.class.toString());
        } else {
            this.variables.forEach(variable => {
                file.push(variable.toString());
            })
        }

        return file.join("");
    }

}