import { readFileSync, createWriteStream } from 'fs';
import * as ts from "typescript";

merge(false, './src/test.ts', './src/test_patch.ts');

export function merge(patchOverrides: boolean, fileBase: string, filePatch: string): string{

    let sourceFile = ts.createSourceFile(fileBase, readFileSync(fileBase).toString(), ts.ScriptTarget.ES2016, false);
    let sourceFilePatch = ts.createSourceFile(filePatch, readFileSync(filePatch).toString(), ts.ScriptTarget.ES2016, true, (<any>ts).SyntaxKind[256]);
    let result: string[] = [];
    let columnsInfo: string = String();
    sourceFile.getChildAt(0).getChildren().forEach(child => {
        switch(child.kind){
            case ts.SyntaxKind.ImportDeclaration:
                result.push((<ts.ImportDeclaration>child).getFullText(sourceFile));
            break;
            default:
        }
    })
    sourceFilePatch.getChildAt(0).getChildren().forEach(childPatch => {
        switch(childPatch.kind){
            case ts.SyntaxKind.ImportDeclaration:
                if(result.indexOf((<ts.ImportDeclaration>childPatch).getFullText(sourceFilePatch)) < 0){
                     result.push(childPatch.getFullText(sourceFilePatch));
                }
            break;
        }
    })
    sourceFile.getChildAt(0).getChildren().forEach(child => {
        if(child.kind == ts.SyntaxKind.ClassDeclaration){
            let classDecl = <ts.ClassDeclaration>child;
            let classDeclPatch: ts.ClassDeclaration;
            sourceFilePatch.getChildAt(0).getChildren().forEach(childPatch => {
                    if(childPatch.kind == ts.SyntaxKind.ClassDeclaration){
                        classDeclPatch = <ts.ClassDeclaration>childPatch;
                    }
            })
            if(patchOverrides && classDecl.name.text == classDeclPatch.name.text){
                //merge decorators if decorator is @NgModule ----TODO
                if(classDeclPatch.decorators){
                    classDeclPatch.decorators.forEach(decorator => {
                        result.push(decorator.getFullText(sourceFilePatch));
                    })
                }
                if(classDeclPatch.modifiers){
                    classDeclPatch.modifiers.forEach(modifier => {
                        result.push(modifier.getFullText(sourceFilePatch));   
                    })
                }
                result.push(classDeclPatch.name.text);
                if(classDeclPatch.heritageClauses){
                    classDeclPatch.heritageClauses.forEach(heritage => {
                        result.push(heritage.getFullText(sourceFilePatch));
                    })
                }
                result.push(" {\n");
            }else{
                if(classDecl.decorators){
                    classDecl.decorators.forEach(decorator => {
                        result.push(decorator.getFullText(sourceFile));
                    })
                }
                if(classDecl.modifiers){
                    classDecl.modifiers.forEach(modifier => {
                        result.push(modifier.getFullText(sourceFile));   
                    })
                    
                }
                result.push(" class ", classDecl.name.text);
                if(classDecl.heritageClauses){
                    classDecl.heritageClauses.forEach(heritage => {
                        result.push(heritage.getFullText(sourceFile));
                    })
                }
                result.push(" {\n");
            }
            if(classDecl.members){
                classDecl.members.forEach(member => {
                    if(member.kind == ts.SyntaxKind.PropertyDeclaration){
                        let propIdentifier: string = (<ts.Identifier>(<ts.PropertyDeclaration>member).name).text;
                        switch(propIdentifier){
                            case "columns":
                                let columnsPatch: ts.PropertyDeclaration;
                                for(let memberPatch of classDeclPatch.members){
                                    if(memberPatch.kind == ts.SyntaxKind.PropertyDeclaration){
                                        if((<ts.Identifier>memberPatch.name).text == "columns"){
                                            columnsPatch = (<ts.PropertyDeclaration>memberPatch);
                                            break;                                                
                                        }
                                    }
                                }
                                if(columnsPatch){
                                    if(patchOverrides){
                                        columnsInfo = columnsPatch.initializer.getFullText(sourceFilePatch) + ";";
                                        result.push(columnsPatch.getFullText(sourceFilePatch));
                                    }else{
                                        let resultArray: string = "";
                                        let arrayPatch: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>columnsPatch.initializer;
                                        let arrayBase: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
                                        if( (<ts.PropertyDeclaration>member).type){
                                            result.push("\n  ", propIdentifier ,":", (<ts.PropertyDeclaration>member).type.getFullText(sourceFile), " = [");
                                        }else{
                                            result.push("\n  ", propIdentifier, " = [");
                                        }
                                        
                                        arrayBase.elements.forEach(element => {
                                            resultArray = resultArray + "    " + element.getFullText(sourceFile);
                                            if(arrayBase.elements.indexOf(element) != arrayBase.elements.length -1){
                                                resultArray = resultArray + ",";
                                            }
                                        })
                                        arrayPatch.elements.forEach(element => {
                                            if(resultArray.indexOf(element.getText(sourceFilePatch)) == -1){
                                                resultArray = resultArray + ",    " + element.getFullText(sourceFilePatch);
                                            }
                                        })
                                        columnsInfo = columnsInfo + "[" + resultArray + "\n];\n";
                                        result.push(resultArray, "\n  ];\n");
                                    }
                                }else{
                                    result.push(member.getFullText(sourceFile));
                                }
                            break;
                            case "searchTerms":
                                let itemTermPatch: ts.PropertyDeclaration;
                                for(let memberPatch of classDeclPatch.members){
                                    if(memberPatch.kind == ts.SyntaxKind.PropertyDeclaration){
                                        if((<ts.Identifier>memberPatch.name).text == "searchTerms"){
                                            itemTermPatch = (<ts.PropertyDeclaration>memberPatch);
                                            break;
                                        }
                                    }
                                }
                                if(patchOverrides){
                                    result.push(itemTermPatch.getFullText(sourceFilePatch));
                                }else{
                                    let resultObject: string = "";
                                    let objectPatch: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>itemTermPatch.initializer; 
                                    let objectBase: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
                                    if( (<ts.PropertyDeclaration>member).type){
                                        result.push("\n  ", propIdentifier, ":", (<ts.PropertyDeclaration>member).type.getFullText(sourceFile), " = {");
                                    }else{
                                        result.push("\n  ", propIdentifier, " = {");
                                    }
                                    objectBase.properties.forEach(property =>{
                                        resultObject = resultObject + property.getFullText(sourceFile);
                                        if(objectBase.properties.indexOf(property) != objectBase.properties.length - 1){
                                            resultObject = resultObject + ",";
                                        }
                                    })
                                    objectPatch.properties.forEach(propertyPatch => {
                                        if(resultObject.indexOf(propertyPatch.getText(sourceFilePatch)) == -1){
                                            resultObject = resultObject + "," + propertyPatch.getFullText(sourceFilePatch);
                                        }
                                    })
                                    result.push(resultObject, "\n  };\n");
                                }
                            break;
                            case "item":
                                let itemObjectPatch: ts.PropertyDeclaration;
                                for(let memberPatch of classDeclPatch.members){
                                    if(memberPatch.kind == ts.SyntaxKind.PropertyDeclaration){
                                        if((<ts.Identifier>memberPatch.name).text == "item"){
                                            itemObjectPatch = (<ts.PropertyDeclaration>memberPatch);
                                            break;
                                        }
                                    }
                                }
                                if(patchOverrides){
                                    result.push(itemObjectPatch.getFullText(sourceFilePatch));
                                }else{
                                    let resultObject: string = "";
                                    let objectPatch: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>itemObjectPatch.initializer; 
                                    let objectBase: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
                                    if( (<ts.PropertyDeclaration>member).type){
                                        result.push("\n  ", propIdentifier, ":", (<ts.PropertyDeclaration>member).type.getFullText(sourceFile), " = {");
                                    }else{
                                        result.push("\n  ", propIdentifier, " = {");
                                    }
                                    objectBase.properties.forEach(property =>{
                                        resultObject = resultObject + property.getFullText(sourceFile);
                                        if(objectBase.properties.indexOf(property) != objectBase.properties.length - 1){
                                            resultObject = resultObject + ",";
                                        }
                                    })
                                    objectPatch.properties.forEach(propertyPatch => {
                                        if(resultObject.indexOf(propertyPatch.getText(sourceFilePatch)) == -1){
                                            resultObject = resultObject + "," + propertyPatch.getFullText(sourceFilePatch);
                                        }
                                    })
                                    result.push(resultObject, "\n  };\n");
                                }
                            break;
                            default:
                                let identifier: string = (<ts.Identifier>(<ts.PropertyDeclaration>member).name).text;
                                let exists: boolean = true;
                                for(let propertyPatch of classDeclPatch.members){
                                    if(propertyPatch.kind == ts.SyntaxKind.PropertyDeclaration){
                                        if(identifier == (<ts.Identifier>(<ts.PropertyDeclaration>propertyPatch).name).text && patchOverrides){
                                            result.push(propertyPatch.getFullText(sourceFilePatch));
                                            exists = true;
                                            break;
                                        }else if(identifier == (<ts.Identifier>(<ts.PropertyDeclaration>propertyPatch).name).text && !patchOverrides){
                                            result.push(member.getFullText(sourceFile));
                                            exists = true;
                                            break;
                                        }else{
                                            exists = false;
                                        }
                                    }
                                }
                                if(!exists){
                                    result.push(member.getFullText(sourceFile));
                                    exists = true;
                                }
                        }
                    }else if(member.kind == ts.SyntaxKind.Constructor){
                        if(patchOverrides){
                            let hasConstructor = false;
                            for(let memberPatch of classDeclPatch.members){
                                if(memberPatch.kind == ts.SyntaxKind.Constructor){
                                    result.push(memberPatch.getFullText(sourceFilePatch));
                                    hasConstructor = true;
                                    break;
                                }
                            }
                            if(!hasConstructor){
                                result.push(member.getFullText(sourceFile));
                            }
                        }else{
                            result.push(member.getFullText(sourceFile));
                        }
                        
                    }else if(ts.SyntaxKind.MethodDeclaration){
                        //get patch methods unexistent at base fileBase

                        if(patchOverrides){
                            let hasMethod = false;
                            let identifier: string = (<ts.Identifier>(<ts.MethodDeclaration>member).name).text;
                            for(let memberPatch of classDeclPatch.members){
                                if(memberPatch.kind == ts.SyntaxKind.MethodDeclaration){
                                    if((<ts.Identifier>(<ts.MethodDeclaration>memberPatch).name).text == identifier){
                                        result.push(memberPatch.getFullText(sourceFilePatch));
                                        hasMethod = true;
                                    }
                                }
                            }
                            if(!hasMethod){
                                result.push(member.getFullText(sourceFile));
                            }
                        }else{
                            let identifier: string = (<ts.Identifier>(<ts.MethodDeclaration>member).name).text;
                            let exists: boolean = true;
                            for(let memberPatch of classDeclPatch.members){
                                if(memberPatch.kind == ts.SyntaxKind.MethodDeclaration){
                                    if(identifier == (<ts.Identifier>(<ts.MethodDeclaration>memberPatch).name).text){
                                        let methodPatch = <ts.MethodDeclaration>memberPatch;
                                        let methodBase = <ts.MethodDeclaration>member;
                                        exists = true;
                                        switch(identifier){
                                            case "getData":
                                                let properties: string[] = [];
                                                result.push("\n\n");
                                                if(methodBase.decorators){
                                                    methodBase.decorators.forEach(decorator => {
                                                        result.push(decorator.getFullText(sourceFile));
                                                    })
                                                }
                                                if(methodBase.modifiers){
                                                    methodBase.modifiers.forEach(modifier => {
                                                        result.push(modifier.getFullText(sourceFile));
                                                    })
                                                }
                                                result.push(identifier, "(");
                                                if(methodBase.parameters){
                                                    methodBase.parameters.forEach(parameter => {
                                                        result.push(parameter.getFullText(sourceFile));
                                                    })
                                                }
                                                result.push(")");
                                                if(methodBase.type){
                                                    result.push(":", methodBase.type.getFullText(sourceFile));
                                                }
                                                result.push("{\n");
                                                if(methodBase.body){
                                                    if(methodBase.body.statements){
                                                        methodBase.body.statements.forEach(statement => {
                                                            if(statement.kind == ts.SyntaxKind.VariableStatement){
                                                                let identifier: string = (<ts.Identifier>(<ts.VariableStatement>statement).declarationList.declarations[0].name).text;
                                                                if(identifier == "pageData"){
                                                                    if((<ts.VariableStatement>statement).declarationList.declarations[0].initializer){
                                                                        let initializer = (<ts.VariableStatement>statement).declarationList.declarations[0].initializer;
                                                                        if(initializer.kind == ts.SyntaxKind.ObjectLiteralExpression){
                                                                            if((<ts.ObjectLiteralExpression>initializer).properties){
                                                                                result.push("let ", identifier, " = {");
                                                                                (<ts.ObjectLiteralExpression>initializer).properties.forEach(prop => {
                                                                                    properties.push(prop.getFullText(sourceFile));
                                                                                    result.push(prop.getFullText(sourceFile));
                                                                                })
                                                                            }
                                                                            if(methodPatch.body.statements){
                                                                                
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            //console.log(syntaxKindToName(statement.kind));
                                                        })
                                                    }
                                                }
                                            break;
                                            case "saveData":

                                            break;
                                            case "ngDoCheck":
                                                result.push("\n\n");
                                                if(methodBase.decorators){
                                                    methodBase.decorators.forEach(decorator => {
                                                        result.push(decorator.getFullText(sourceFile));
                                                    })
                                                }
                                                if(methodBase.modifiers){
                                                    methodBase.modifiers.forEach(modifier => {
                                                        result.push(modifier.getFullText(sourceFile));
                                                    })
                                                }
                                                
                                                result.push(identifier, "(");
                                                if(methodBase.parameters){
                                                    methodBase.parameters.forEach(parameter => {
                                                        result.push(parameter.getFullText(sourceFile));
                                                    })
                                                }
                                                result.push(")");
                                                if(methodBase.type){
                                                    result.push(":", methodBase.type.getFullText(sourceFile));
                                                }
                                                result.push("{\n");
                                                if(methodBase.body){
                                                    if(methodBase.body.statements){
                                                        methodBase.body.statements.forEach(statement => {
                                                            if(statement.kind == ts.SyntaxKind.IfStatement){
                                                                let ifStmnt = <ts.IfStatement>statement;
                                                                if(ifStmnt.expression.getFullText(sourceFile).indexOf("this.language !== this.translate.currentLang") >= 0){
                                                                    result.push("    if(", ifStmnt.expression.getFullText(sourceFile), ") {\n");
                                                                    let stmnt = <ts.Block>(<ts.IfStatement>statement).thenStatement;
                                                                    if(stmnt.statements){
                                                                        stmnt.statements.forEach(stat => {
                                                                            if(stat.kind == ts.SyntaxKind.ExpressionStatement){
                                                                                let exprStmnt = <ts.ExpressionStatement>stat;
                                                                                if(exprStmnt.expression.kind == ts.SyntaxKind.BinaryExpression){
                                                                                    let binaryExpr = <ts.BinaryExpression>exprStmnt.expression;
                                                                                    if(binaryExpr.left.kind == ts.SyntaxKind.PropertyAccessExpression){
                                                                                        let propExpr = <ts.PropertyAccessExpression>binaryExpr.left;
                                                                                        if(propExpr.name.text == "columns"){
                                                                                            result.push(binaryExpr.left.getFullText(sourceFile), binaryExpr.operatorToken.getFullText(sourceFile), " ", columnsInfo);
                                                                                        }else{
                                                                                            result.push(binaryExpr.getFullText(sourceFile), ";");
                                                                                        }
                                                                                    }
                                                                                }else{
                                                                                    result.push(exprStmnt.getFullText(sourceFile), ";");
                                                                                }                 
                                                                            }else{
                                                                                result.push(stat.getFullText(sourceFile), ";");
                                                                            }
                                                                        })
                                                                    }
                                                                    result.push("    }");
                                                                }else{
                                                                    result.push(ifStmnt.getFullText(sourceFile));
                                                                }
                                                            }else{
                                                                result.push(statement.getFullText(sourceFile));
                                                            }
                                                        })
                                                    }
                                                }
                                                result.push("\n}");
                                            break;
                                            // default:
                                            //     // result = result + member.getFullText(sourceFile);
                                            //     // exists = true;
                                            // break;
                                        }    
                                    }else{
                                        exists = false;
                                    }
                                }
                            }
                            if(!exists){
                                result.push(member.getFullText(sourceFile));
                                exists = true;
                            }
                        }
                    }
                })
            }
            result.push("\n}");
        }
    })
    console.log(result.join(""));
    return result.join("");
}

function syntaxKindToName(kind: ts.SyntaxKind) {
    return (<any>ts).SyntaxKind[kind];
}

export default merge;