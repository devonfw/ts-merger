import * as fs from 'fs';
import * as ts from 'typescript';
import ImportClause  from './components/ImportClause';
import ImportMerge  from './mergers/ImportMerge';
import ClassDeclaration  from './components/classDeclaration/ClassDeclaration';
import Method from './components/classDeclaration/members/method/Method';
import Parameter from './components/classDeclaration/members/method/Parameter';
import * as cbMerge from './utils/tools/CobiGenMerge';
import Constants from './utils/Constants'
import MethodMerge from './mergers/MethodMerge';
import * as ga from './components/GeneralAdds';


let strategy = process.argv[2].toLowerCase() === "true" ? true : false;
let base = process.argv[3];
let patch = process.argv[4];

if(strategy){
    merge(true, base, patch);
}else{
    merge(false, base, patch);
}

/**
 * Performs a merge of a patch and base file depending on the merge strategy
 * 
 * @export
 * @param {boolean} patchOverrides 
 * @param {string} fileBase 
 * @param {string} filePatch 
 * @returns {string} the result of the merge
 */
export function merge(patchOverrides: boolean, fileBase: string, filePatch: string): string {
    let sourceFilePatch: ts.SourceFile;
    if(fs.existsSync(filePatch)){
        sourceFilePatch = ts.createSourceFile(filePatch, fs.readFileSync(filePatch).toString(), ts.ScriptTarget.ES2016, true, (<any>ts).SyntaxKind[256]);
    }else{
        sourceFilePatch = ts.createSourceFile(filePatch, filePatch, ts.ScriptTarget.ES2016, true, (<any>ts).SyntaxKind[256]);
    }

    let sourceFile: ts.SourceFile = ts.createSourceFile(fileBase, fs.readFileSync(fileBase).toString(), ts.ScriptTarget.ES2016, false);
    let result: String[] = [];
    let columnsInfo: string = String();
    
    let importMerge: ImportMerge = new ImportMerge(sourceFile, sourceFilePatch);
    let methodMerge = new MethodMerge(sourceFile, sourceFilePatch, patchOverrides);

    //Merge imports
    importMerge.merge();
    result.push(importMerge.addPatchImports());
    

    sourceFile.getChildAt(0).getChildren().forEach(child => {
        if (child.kind === ts.SyntaxKind.ClassDeclaration) {
            let classDecl = <ts.ClassDeclaration>child;
            let classDeclPatch: ts.ClassDeclaration;
            sourceFilePatch.getChildAt(0).getChildren().forEach(childPatch => {
                if (childPatch.kind === ts.SyntaxKind.ClassDeclaration) {
                    classDeclPatch = <ts.ClassDeclaration>childPatch;
                }
            })
            let classToPrint: ClassDeclaration = new ClassDeclaration();
            if(classDeclPatch){
                if (classDecl.name.text === classDeclPatch.name.text) {
                    classToPrint.setName(classDecl.name.text);
                    if (patchOverrides) {
                        //get decorators, modifiers and heritages of class from patch file
                        classToPrint.addDecorators(ga.getDecorators(classDecl, classDeclPatch, patchOverrides, sourceFile, sourceFilePatch));
                    } else {
                        //get decorators of base file testing if it anyone is NgModule decorator merging it if it is
                        classToPrint.addDecorators(ga.getDecorators(classDecl, classDeclPatch, patchOverrides, sourceFile, sourceFilePatch));
                    }
                    //get modifiers and heritages of class from base file
                    classToPrint.addModifiers(ga.getModifiers(classDeclPatch, sourceFilePatch));
                    classToPrint.addHeritages(ga.getHeritages(classDeclPatch, sourceFilePatch));
                    let propertiesBase: string[] = [];
                    if (classDecl.members) {
                        classDecl.members.forEach(member => {
                            if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                                let columns = mergeClassProperties(<ts.PropertyDeclaration>member, classDeclPatch, sourceFile, sourceFilePatch, classToPrint, patchOverrides);
                                if(columns){
                                    columnsInfo = columns;
                                }
                            } else if (member.kind === ts.SyntaxKind.Constructor) {
                                if(patchOverrides){
                                    classDeclPatch.members.forEach(memberPatch => {
                                        if(member.kind === ts.SyntaxKind.Constructor){
                                            classToPrint.setConstructor((<String>memberPatch.getText(sourceFilePatch)));
                                        }
                                    })
                                }else{
                                    classToPrint.setConstructor((<String>member.getText(sourceFile)));
                                }
                            } else if (member.kind === ts.SyntaxKind.MethodDeclaration) {
                                methodMerge.merge(<ts.MethodDeclaration>member, classDeclPatch.members, classToPrint, columnsInfo);
                            }
                        })
                        propertiesToAdd(classDecl, classDeclPatch).forEach(property =>{
                            classToPrint.addProperty(property.getText(sourceFilePatch));
                        })
                        methodsToAdd(classDecl, classDeclPatch).forEach(method =>{
                            classToPrint.addMethod(methodMerge.buildMethod(sourceFilePatch, method));
                        })
                        result.push(classToPrint.toString());
                    }
                }
            }else{
                result.push(classDecl.getFullText(sourceFile));
            }
            
        } else if (child.kind === ts.SyntaxKind.VariableStatement) {
            let variableBase: ts.VariableStatement = <ts.VariableStatement>child;
            if ((<ts.Identifier>variableBase.declarationList.declarations[0].name).text === Constants.cbAppRoutes) {
                let variablePatch: ts.VariableStatement;
                let routesInitPatch: ts.ArrayLiteralExpression;
                for (let childPatch of sourceFilePatch.getChildAt(0).getChildren()) {
                    if (childPatch.kind === ts.SyntaxKind.VariableStatement) {
                        variablePatch = <ts.VariableStatement>childPatch;
                        let identifierPatch = (<ts.Identifier>variablePatch.declarationList.declarations[0].name).text;
                        if (identifierPatch === Constants.cbAppRoutes) {
                            routesInitPatch = <ts.ArrayLiteralExpression>variablePatch.declarationList.declarations[0].initializer;
                            break;
                        }
                    }
                }
                if (routesInitPatch) {
                    if (patchOverrides) {
                        result.push(variablePatch.getFullText(sourceFilePatch));
                    } else {
                        let routes: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>variableBase.declarationList.declarations[0].initializer;
                        if (variableBase.decorators) {
                            variableBase.decorators.forEach(decorator => {
                                result.push(decorator.getFullText(sourceFile));
                            });
                        }
                        if (variableBase.modifiers) {
                            variableBase.modifiers.forEach(modifier => {
                                result.push(modifier.getFullText(sourceFile));
                            });
                        }
                        result.push("\n\nconst " + Constants.cbAppRoutes + ": Routes = [");
                        let components: string[] = [];
                        routes.elements.forEach(element => {
                            let object: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>element;
                            object.properties.forEach(property => {
                                let assigment: ts.PropertyAssignment = <ts.PropertyAssignment>property;
                                components.push((<ts.Identifier>assigment.initializer).text);
                            });
                            result.push(element.getFullText(sourceFile));
                            if (routes.elements.indexOf(element) != routes.elements.length - 1) {
                                result.push(",");
                            }
                        });
                        routesInitPatch.elements.forEach(elementPatch => {
                            let object: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>elementPatch;
                            if(components.indexOf((<ts.Identifier>(<ts.PropertyAssignment>object.properties[0]).initializer).text) < 0){
                                result.push("," + elementPatch.getFullText(sourceFilePatch));
                                components.push((<ts.Identifier>(<ts.PropertyAssignment>object.properties[0]).initializer).text);
                            }
                        });
                        result.push("\n]");
                    }
                }

            } else {
                for (let childPatch of sourceFilePatch.getChildAt(0).getChildren()){
                    if(childPatch.kind === ts.SyntaxKind.VariableStatement){
                        let variablePatch = <ts.VariableStatement>childPatch;
                        if((<ts.Identifier>variableBase.declarationList[0].name).text === (<ts.Identifier>variablePatch.declarationList[0].name).text){
                            if(patchOverrides){
                                result.push(variablePatch.getFullText(sourceFilePatch));
                            }else{
                                result.push(variableBase.getFullText(sourceFile));
                            }
                        }else{
                            // TODO - Add non existent VariableStatement's
                        }
                    }
                }
            }
        } else if(child.kind != ts.SyntaxKind.ImportDeclaration){
            result.push(child.getFullText(sourceFile));
        }
    })
    console.log(result.join(""));
    return result.join("");
}

function methodsToAdd(base: ts.ClassDeclaration, patch: ts.ClassDeclaration): ts.MethodDeclaration[]{
    let methodsBase: string[] = [];
    let methodsToAdd: ts.MethodDeclaration[] = [];

    if (base.members) {
        base.members.forEach(member => {
            if (member.kind === ts.SyntaxKind.MethodDeclaration) {
                let methodDecl: ts.MethodDeclaration = (<ts.MethodDeclaration>member);
                methodsBase.push((<ts.Identifier>methodDecl.name).text);
            }
        });
        if (patch.members) {
            patch.members.forEach(memberPatch => {
                if (memberPatch.kind === ts.SyntaxKind.MethodDeclaration) {
                    let methodDecl: ts.MethodDeclaration = (<ts.MethodDeclaration>memberPatch);
                    if (methodsBase.indexOf((<ts.Identifier>methodDecl.name).text) < 0) {
                        methodsToAdd.push(methodDecl);
                    }
                }
            })
        }
    }
    return methodsToAdd;
}

function propertiesToAdd(base: ts.ClassDeclaration, patch: ts.ClassDeclaration): ts.PropertyDeclaration[]{
    let propertiesBase: string[] = [];
    let propertiesToAdd: ts.PropertyDeclaration[] = [];

    if(base.members) {
        base.members.forEach(member => {
            if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                let propertyDecl: ts.PropertyDeclaration = (<ts.PropertyDeclaration>member);
                propertiesBase.push((<ts.Identifier>propertyDecl.name).text);
            }
        });
        if (patch.members) {
            patch.members.forEach(memberPatch => {
                if (memberPatch.kind === ts.SyntaxKind.PropertyDeclaration) {
                    let propertyDecl: ts.PropertyDeclaration = (<ts.PropertyDeclaration>memberPatch);
                    if (propertiesBase.indexOf((<ts.Identifier>propertyDecl.name).text) < 0) {
                        propertiesToAdd.push(propertyDecl);
                    }
                }
            })
        }
    }
    return propertiesToAdd;
}

function mergeClassProperties(member: ts.PropertyDeclaration, classDeclPatch: ts.ClassDeclaration, sourceFile:ts.SourceFile, sourceFilePatch:ts.SourceFile, classToPrint: ClassDeclaration, patchOverrides: boolean){
    let propIdentifier: string = (<ts.Identifier>member.name).text;
    let property: String[] = [];
    switch (propIdentifier) {
        //merge property cobigen_columns
        case Constants.cbColumns:
            let columns: string = cbMerge.mergeColumns(classDeclPatch, sourceFilePatch, classToPrint, member, sourceFile, property, propIdentifier, patchOverrides);
            classToPrint.addProperty(property.join(""));
            return columns;
        //merge property cobigen_searchTerms
        case Constants.cbSearchTerms:
            cbMerge.mergeSearchTerms(classDeclPatch, sourceFilePatch, classToPrint, member, sourceFile, property, propIdentifier, patchOverrides);
            break;
        //merge property cobigen_item
        case Constants.cbItems:
            cbMerge.mergeItems(classDeclPatch, sourceFilePatch, classToPrint, member, sourceFile, property, propIdentifier, patchOverrides)
            break;

        default:
            if(patchOverrides){
                let identifier: string = (<ts.Identifier>(<ts.PropertyDeclaration>member).name).text;
                for (let propertyPatch of classDeclPatch.members) {
                    if (identifier === (<ts.Identifier>(<ts.PropertyDeclaration>propertyPatch).name).text) {
                        classToPrint.addProperty(propertyPatch.getText(sourceFilePatch));
                    }
                }
            }else{
                classToPrint.addProperty(member.getText(sourceFile));
            }
    }
}

export default merge;