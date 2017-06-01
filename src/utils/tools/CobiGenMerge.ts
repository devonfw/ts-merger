import * as ts from 'typescript';
import Method from '../../components/classDeclaration/members/method/Method';
import ClassDeclaration  from '../../components/classDeclaration/ClassDeclaration';
import Constants from '../Constants';

export function mergeColumns(classDeclPatch, sourceFilePatch, classToPrint, member, sourceFile, property, propIdentifier, patchOverrides){
    let columnsInfo: string = String();
    let columnsPatch: ts.PropertyDeclaration;
    //get the columns potch
    for (let memberPatch of classDeclPatch.members) {
        if (memberPatch.kind == ts.SyntaxKind.PropertyDeclaration) {
            if ((<ts.Identifier>memberPatch.name).text == "cobigen_columns") {
                columnsPatch = (<ts.PropertyDeclaration>memberPatch);
                break;
            }
        }
    }
    //if patch has columns, merge
    if (columnsPatch) {
        if (patchOverrides) {
            columnsInfo = columnsPatch.initializer.getFullText(sourceFilePatch) + ";";
            classToPrint.addProperty(columnsPatch.getFullText(sourceFilePatch));
        } else {
            let resultArray: string = "";
            let arrayPatch: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>columnsPatch.initializer;
            let arrayBase: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
            if ((<ts.PropertyDeclaration>member).type) {
                property.push(propIdentifier, ":", (<ts.PropertyDeclaration>member).type.getFullText(sourceFile), " = [");
            } else {
                property.push(propIdentifier, " = [");
            }
            arrayBase.elements.forEach(element => {
                resultArray = resultArray + element.getText(sourceFile);
                if (arrayBase.elements.indexOf(element) != arrayBase.elements.length - 1) {
                    resultArray = resultArray + ", ";
                }
            })
            arrayPatch.elements.forEach(element => {
                if (resultArray.indexOf(element.getText(sourceFilePatch)) == -1) {
                    resultArray = resultArray + ", " + element.getText(sourceFilePatch);
                }
            })
            columnsInfo = columnsInfo + "[" + resultArray + "];";
            property.push(resultArray, "];");
        }
        //if patch has no columns, just add base columns
    } else {
        property.push(member.getText(sourceFile));   
    }
    return columnsInfo;
}

export function mergeSearchTerms(classDeclPatch, sourceFilePatch, classToPrint, member, sourceFile, property, propIdentifier, patchOverrides){
    let resultObject: string;
    let objectPatch: ts.ObjectLiteralExpression;
    let objectBase: ts.ObjectLiteralExpression;
    let itemTermPatch: ts.PropertyDeclaration;
    for (let memberPatch of classDeclPatch.members) {
        if (memberPatch.kind == ts.SyntaxKind.PropertyDeclaration) {
            if ((<ts.Identifier>memberPatch.name).text == "cobigen_searchTerms") {
                itemTermPatch = (<ts.PropertyDeclaration>memberPatch);
                break;
            }
        }
    }
    if(itemTermPatch){
        if(patchOverrides){
            classToPrint.addProperty(itemTermPatch.getFullText(sourceFilePatch));
        }else{
            resultObject = "";
            objectPatch = <ts.ObjectLiteralExpression>itemTermPatch.initializer;
            objectBase = <ts.ObjectLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
            if ((<ts.PropertyDeclaration>member).type) {
                property.push(propIdentifier, ":", (<ts.PropertyDeclaration>member).type.getFullText(sourceFile), " = {");
            } else {
                property.push(propIdentifier, " = {");
            }
            objectBase.properties.forEach(property => {
                resultObject = resultObject + property.getText(sourceFile);
                if (objectBase.properties.indexOf(property) != objectBase.properties.length - 1) {
                    resultObject = resultObject + ", ";
                }
            })
            objectPatch.properties.forEach(propertyPatch => {
                if (resultObject.indexOf(propertyPatch.getText(sourceFilePatch)) == -1) {
                    resultObject = resultObject + ", " + propertyPatch.getText(sourceFilePatch);
                }
            })
            property.push(resultObject, "};");
            classToPrint.addProperty(property.join(""));
        }
    }
}

export function mergeItems(classDeclPatch, sourceFilePatch, classToPrint, member, sourceFile, property, propIdentifier, patchOverrides){
    let resultObject: string = String();
    let objectPatch: ts.ObjectLiteralExpression;
    let objectBase: ts.ObjectLiteralExpression;
    let itemObjectPatch: ts.PropertyDeclaration;
    for (let memberPatch of classDeclPatch.members) {
        if (memberPatch.kind == ts.SyntaxKind.PropertyDeclaration) {
            if ((<ts.Identifier>memberPatch.name).text == "cobigen_item") {
                itemObjectPatch = (<ts.PropertyDeclaration>memberPatch);
                break;
            }
        }
    }
    if(itemObjectPatch){
        if(patchOverrides){
            classToPrint.addProperty(itemObjectPatch.getFullText(sourceFilePatch));
        }else{
            objectPatch = <ts.ObjectLiteralExpression>itemObjectPatch.initializer;
            objectBase = <ts.ObjectLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
            if ((<ts.PropertyDeclaration>member).type) {
                property.push(propIdentifier, ":", (<ts.PropertyDeclaration>member).type.getText(sourceFile), " = {");
            } else {
                property.push(propIdentifier, " = {");
            }
            objectBase.properties.forEach(property => {
                resultObject = resultObject + property.getText(sourceFile);
                if (objectBase.properties.indexOf(property) != objectBase.properties.length - 1) {
                    resultObject = resultObject + ", ";
                }
            })
            objectPatch.properties.forEach(propertyPatch => {
                if (resultObject.indexOf(propertyPatch.getText(sourceFilePatch)) == -1) {
                    resultObject = resultObject + ", " + propertyPatch.getText(sourceFilePatch);
                }
            })
            property.push(resultObject, "};");
            classToPrint.addProperty(property.join(""));
        }
    }

}

export function mergeGetData(methodBase: ts.MethodDeclaration, methodPatch: ts.MethodDeclaration, body: String[], sourceFile: ts.SourceFile, sourceFilePatch: ts.SourceFile, properties: String[], method: Method, classToPrint: ClassDeclaration){
    if (methodBase.body) {
        if (methodBase.body.statements) {
            methodBase.body.statements.forEach(statement => {
                if (statement.kind == ts.SyntaxKind.VariableStatement) {
                    let identifier: string = (<ts.Identifier>(<ts.VariableStatement>statement).declarationList.declarations[0].name).text;
                    if (identifier == "cobigen_pageData") {
                        if ((<ts.VariableStatement>statement).declarationList.declarations[0].initializer) {
                            let initializer = (<ts.VariableStatement>statement).declarationList.declarations[0].initializer;
                            if (initializer.kind == ts.SyntaxKind.ObjectLiteralExpression) {
                                if ((<ts.ObjectLiteralExpression>initializer).properties) {
                                    body.push("let ", identifier, " = {");

                                    (<ts.ObjectLiteralExpression>initializer).properties.forEach(prop => {
                                        properties.push(prop.getText(sourceFile));
                                        body.push(prop.getText(sourceFile));
                                        if (!((<ts.ObjectLiteralExpression>initializer).properties.indexOf(prop) == (<ts.ObjectLiteralExpression>initializer).properties.length - 1)) {
                                            body.push(",");
                                        }
                                    })
                                }
                                if (methodPatch.body.statements) {
                                    methodPatch.body.statements.forEach(stmntPatch => {
                                        if (stmntPatch.kind == ts.SyntaxKind.VariableStatement) {
                                            let identifierPatch: string = (<ts.Identifier>(<ts.VariableStatement>stmntPatch).declarationList.declarations[0].name).text;
                                            if (identifierPatch == "cobigen_pageData") {
                                                if ((<ts.VariableStatement>statement).declarationList.declarations[0].initializer) {
                                                    let initializerPatch = (<ts.VariableStatement>stmntPatch).declarationList.declarations[0].initializer;
                                                    if (initializerPatch.kind == ts.SyntaxKind.ObjectLiteralExpression) {
                                                        if ((<ts.ObjectLiteralExpression>initializerPatch).properties) {
                                                            (<ts.ObjectLiteralExpression>initializerPatch).properties.forEach(propPatch => {
                                                                if (propPatch.getText(sourceFilePatch).indexOf("pagination") < 0) {
                                                                    if (properties.indexOf(propPatch.getText(sourceFilePatch)) < 0) {
                                                                        body.push("," + propPatch.getText(sourceFilePatch));
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                                body.push("\n};");
                            }
                        }
                    } else {
                        body.push(statement.getText(sourceFile));
                    }
                } else {
                    body.push(statement.getText(sourceFile));
                }
            })
        }
    }
    body.push("\n}");
    method.setBody(body.join(""));
    classToPrint.addMethod(method);
}

export function mergeSaveData(methodBase: ts.MethodDeclaration, methodPatch: ts.MethodDeclaration, body: String[], properties: String[], sourceFile: ts.SourceFile, sourceFilePatch: ts.SourceFile, method: Method, classToPrint: ClassDeclaration){
    if (methodBase.body) {
        if (methodBase.body.statements) {
            methodBase.body.statements.forEach(statement => {
                if (statement.kind == ts.SyntaxKind.VariableStatement) {
                    let identifier: string = (<ts.Identifier>(<ts.VariableStatement>statement).declarationList.declarations[0].name).text;
                    if (identifier == "cobigen_obj") {
                        if ((<ts.VariableStatement>statement).declarationList.declarations[0].initializer) {
                            let initializer = (<ts.VariableStatement>statement).declarationList.declarations[0].initializer;
                            if (initializer.kind == ts.SyntaxKind.ObjectLiteralExpression) {
                                if ((<ts.ObjectLiteralExpression>initializer).properties) {
                                    body.push("let ", identifier, " = {");

                                    (<ts.ObjectLiteralExpression>initializer).properties.forEach(prop => {
                                        properties.push(prop.getText(sourceFile));
                                        body.push(prop.getText(sourceFile));
                                        if (!((<ts.ObjectLiteralExpression>initializer).properties.indexOf(prop) == (<ts.ObjectLiteralExpression>initializer).properties.length - 1)) {
                                            body.push(",");
                                        }
                                    })
                                }
                                if (methodPatch.body.statements) {
                                    methodPatch.body.statements.forEach(stmntPatch => {
                                        if (stmntPatch.kind == ts.SyntaxKind.VariableStatement) {
                                            let identifierPatch: string = (<ts.Identifier>(<ts.VariableStatement>stmntPatch).declarationList.declarations[0].name).text;
                                            if (identifierPatch == "cobigen_obj") {
                                                if ((<ts.VariableStatement>statement).declarationList.declarations[0].initializer) {
                                                    let initializerPatch = (<ts.VariableStatement>stmntPatch).declarationList.declarations[0].initializer;
                                                    if (initializerPatch.kind == ts.SyntaxKind.ObjectLiteralExpression) {
                                                        if ((<ts.ObjectLiteralExpression>initializerPatch).properties) {
                                                            (<ts.ObjectLiteralExpression>initializerPatch).properties.forEach(propPatch => {
                                                                if (properties.indexOf(propPatch.getText(sourceFilePatch)) < 0) {
                                                                    body.push("," + propPatch.getText(sourceFilePatch));
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                                body.push("\n}");
                            }
                        }
                    } else {
                        body.push(statement.getText(sourceFile));
                    }
                } else {
                    body.push(statement.getText(sourceFile));
                }
            })
        }
    }
    body.push("\n}");
    method.setBody(body.join(""));
    classToPrint.addMethod(method);
}

export function mergeNgDoCheck(methodBase: ts.MethodDeclaration, methodPatch: ts.MethodDeclaration, body: String[], properties: String[], sourceFile: ts.SourceFile, sourceFilePatch: ts.SourceFile, method: Method, classToPrint: ClassDeclaration, columnsInfo){
    if (methodBase.body) {
        if (methodBase.body.statements) {
            methodBase.body.statements.forEach(statement => {
                if (statement.kind == ts.SyntaxKind.IfStatement) {
                    let ifStmnt = <ts.IfStatement>statement;
                    if (ifStmnt.expression.getFullText(sourceFile).indexOf("this.language !== this.translate.currentLang") >= 0) {
                        body.push("    if(", ifStmnt.expression.getFullText(sourceFile), ") {\n");
                        let stmnt = <ts.Block>(<ts.IfStatement>statement).thenStatement;
                        if (stmnt.statements) {
                            stmnt.statements.forEach(stat => {
                                if (stat.kind == ts.SyntaxKind.ExpressionStatement) {
                                    let exprStmnt = <ts.ExpressionStatement>stat;
                                    if (exprStmnt.expression.kind == ts.SyntaxKind.BinaryExpression) {
                                        let binaryExpr = <ts.BinaryExpression>exprStmnt.expression;
                                        if (binaryExpr.left.kind == ts.SyntaxKind.PropertyAccessExpression) {
                                            let propExpr = <ts.PropertyAccessExpression>binaryExpr.left;
                                            if (propExpr.name.text == "cobigen_columns") {
                                                body.push(binaryExpr.left.getFullText(sourceFile), binaryExpr.operatorToken.getFullText(sourceFile), " ", columnsInfo);
                                            } else {
                                                body.push(binaryExpr.getFullText(sourceFile), ";");
                                            }
                                        }
                                    } else {
                                        body.push(exprStmnt.getFullText(sourceFile), ";");
                                    }
                                } else {
                                    body.push(stat.getFullText(sourceFile), ";");
                                }
                            })
                        }
                        body.push("    }");
                    } else {
                        body.push(ifStmnt.getFullText(sourceFile));
                    }
                } else {
                    body.push(statement.getFullText(sourceFile));
                }
            })
        }
    }
    body.push("\n}");
    method.setBody(body.join(""));
    classToPrint.addMethod(method);
}

export function getClassDecoratorWithNgModuleCase(classDecl: ts.ClassDeclaration, classDeclPatch: ts.ClassDeclaration, sourceFile: ts.SourceFile, sourceFilePatch: ts.SourceFile){
    let decorators: String[] = [];
    let ngModule: String[] = [];
    if (classDecl.decorators) {
        classDecl.decorators.forEach(decorator => {
            if (decorator.getFullText(sourceFile).indexOf(Constants.cbNgModule) >= 0) {
                ngModule.push("\n@NgModule({\n");
                interface properties {
                    key: string,
                    values: string[]
                };
                let arrayProperties: properties[] = [];
                if (classDeclPatch.decorators) {
                    for (let decoratorPatch of classDeclPatch.decorators) {
                        if (decoratorPatch.getFullText(sourceFilePatch).indexOf("NgModule") >= 0) {
                            if ((<ts.CallExpression>decoratorPatch.expression).arguments) {
                                if ((<ts.ObjectLiteralExpression>(<ts.CallExpression>decoratorPatch.expression).arguments[0]).properties) {
                                    (<ts.ObjectLiteralExpression>(<ts.CallExpression>decoratorPatch.expression).arguments[0]).properties.forEach(propertyPatch => {
                                        let elements: string[] = [];
                                        if ((<ts.PropertyAssignment>propertyPatch).initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                                            let array: ts.ArrayLiteralExpression = (<ts.ArrayLiteralExpression>(<ts.PropertyAssignment>propertyPatch).initializer);
                                            array.elements.forEach(element => {
                                                elements.push(element.getFullText(sourceFilePatch));
                                            });
                                            arrayProperties.push({ key: (<ts.Identifier>propertyPatch.name).text, values: elements });
                                        }

                                    });
                                }
                            }
                            break;
                        }
                    }
                }
                if ((<ts.CallExpression>decorator.expression).arguments) {
                    if ((<ts.ObjectLiteralExpression>(<ts.CallExpression>decorator.expression).arguments[0]).properties) {
                        (<ts.ObjectLiteralExpression>(<ts.CallExpression>decorator.expression).arguments[0]).properties.forEach(property => {
                            ngModule.push((<ts.Identifier>property.name).text + ": [");
                            let elements: string[] = [];
                            if ((<ts.PropertyAssignment>property).initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                                let arrayBase: string[] = [];
                                let elements = (<ts.ArrayLiteralExpression>(<ts.PropertyAssignment>property).initializer).elements;
                                elements.forEach(elem => {
                                    arrayBase.push(elem.getFullText(sourceFile));
                                    ngModule.push(elem.getFullText(sourceFile), ",");
                                });
                                arrayProperties.forEach(prop => {
                                    if (prop.key === (<ts.Identifier>property.name).text) {
                                        prop.values.forEach(proPatch => {
                                            if (arrayBase.indexOf(proPatch) < 0) {
                                                ngModule.push(proPatch);
                                                if(arrayBase.indexOf(proPatch) < arrayBase.length - 1){
                                                    ngModule.push(",");
                                                }
                                            }
                                        });
                                    }
                                });
                                ngModule.push("\n],\n");
                            }
                        });
                    }
                }
                ngModule.push("})\n")
                decorators.push(ngModule.join(""));

            } else {
                decorators.push(decorator.getFullText(sourceFile) + "\n");
            }
        })
        return decorators;
    }
}