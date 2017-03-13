import { readFileSync } from 'fs';
import * as ts from "typescript";

merge(true, './src/test.ts', './src/test_patch.ts');

export function merge(patchOverrides: boolean, fileBase: string, filePatch: string): string{

    let sourceFile = ts.createSourceFile(fileBase, readFileSync(fileBase).toString(), ts.ScriptTarget.ES2016, false);
    let sourceFilePatch = ts.createSourceFile(filePatch, readFileSync(filePatch).toString(), ts.ScriptTarget.ES2015, true, (<any>ts).SyntaxKind[256]);
    let result: string = "";
    sourceFile.getChildAt(0).getChildren().forEach(child => {
        switch(child.kind){
            case ts.SyntaxKind.ImportDeclaration:
                result = result + (<ts.ImportDeclaration>child).getFullText(sourceFile);

            break;
            default:

        }
    })
    sourceFilePatch.getChildAt(0).getChildren().forEach(childPatch => {
        switch(childPatch.kind){
            case ts.SyntaxKind.ImportDeclaration:
                if(result.indexOf((<ts.ImportDeclaration>childPatch).getFullText(sourceFilePatch)) == -1){
                     result = result + childPatch.getFullText(sourceFilePatch);
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
                        result = result + decorator.getFullText(sourceFilePatch);
                    })
                }
                if(classDeclPatch.modifiers){
                    classDeclPatch.modifiers.forEach(modifier => {
                        result = result + modifier.getFullText(sourceFilePatch);   
                    })
            
                }
                result = result + " class " + classDeclPatch.name.text;
                if(classDeclPatch.heritageClauses){
                    classDeclPatch.heritageClauses.forEach(heritage => {
                        result = result + heritage.getFullText(sourceFilePatch);
                    })
                }
                result = result + " {\n";
            }else{
                if(classDecl.decorators){
                    classDecl.decorators.forEach(decorator => {
                        result = result + decorator.getFullText(sourceFile);
                    })
                }
                if(classDecl.modifiers){
                    classDecl.modifiers.forEach(modifier => {
                        result = result + modifier.getFullText(sourceFile);   
                    })
                    
                }
                result = result + " class " + classDecl.name.text;
                if(classDecl.heritageClauses){
                    classDecl.heritageClauses.forEach(heritage => {
                        result = result + heritage.getFullText(sourceFile);
                    })
                }
                result = result + " {\n";
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
                                        result = result + columnsPatch.getFullText(sourceFilePatch);
                                    }else{
                                        let resultArray: string = "";
                                        let arrayPatch: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>columnsPatch.initializer;
                                        let arrayBase: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
                                        if( (<ts.PropertyDeclaration>member).type){
                                            result = result + "\n  " + propIdentifier + ":"+ (<ts.PropertyDeclaration>member).type.getFullText(sourceFile) + " = [";
                                        }else{
                                            result = result + "\n  "+ propIdentifier + " = [";
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
                                        result = result + resultArray + "\n  ];\n";
                                    }
                                }else{
                                    result = result + member.getFullText(sourceFile);
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
                                    result = result + itemTermPatch.getFullText(sourceFilePatch);
                                }else{
                                    let resultObject: string = "";
                                    let objectPatch: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>itemTermPatch.initializer; 
                                    let objectBase: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
                                    if( (<ts.PropertyDeclaration>member).type){
                                        result = result + "\n  " + propIdentifier + ":"+ (<ts.PropertyDeclaration>member).type.getFullText(sourceFile) + " = {";
                                    }else{
                                        result = result + "\n  "+ propIdentifier + " = {";
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
                                    result = result + resultObject + "\n  };\n";
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
                                    result = result + itemObjectPatch.getFullText(sourceFilePatch);
                                }else{
                                    let resultObject: string = "";
                                    let objectPatch: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>itemObjectPatch.initializer; 
                                    let objectBase: ts.ObjectLiteralExpression = <ts.ObjectLiteralExpression>(<ts.PropertyDeclaration>member).initializer;
                                    if( (<ts.PropertyDeclaration>member).type){
                                        result = result + "\n  " + propIdentifier + ":"+ (<ts.PropertyDeclaration>member).type.getFullText(sourceFile) + " = {";
                                    }else{
                                        result = result + "\n  "+ propIdentifier + " = {";
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
                                    result = result + resultObject + "\n  };\n";
                                }
                            break;
                            default:
                                let identifier: string = (<ts.Identifier>(<ts.PropertyDeclaration>member).name).text;
                                let exists: boolean = true;
                                for(let propertyPatch of classDeclPatch.members){
                                    if(propertyPatch.kind == ts.SyntaxKind.PropertyDeclaration){
                                        if(identifier == (<ts.Identifier>(<ts.PropertyDeclaration>propertyPatch).name).text && patchOverrides){
                                            result = result + propertyPatch.getFullText(sourceFilePatch);
                                            exists = true;
                                            break;
                                        }else if(identifier == (<ts.Identifier>(<ts.PropertyDeclaration>propertyPatch).name).text && !patchOverrides){
                                            result = result + member.getFullText(sourceFile);            
                                            exists = true;
                                            break;
                                        }else{
                                            exists = false;
                                        }
                                    }
                                }
                                if(!exists){
                                    result = result + member.getFullText(sourceFile);
                                    exists = true;
                                }
                        }
                    }else if(member.kind == ts.SyntaxKind.Constructor){
                        if(patchOverrides){
                            for(let memberPatch of classDeclPatch.members){
                                if(memberPatch.kind == ts.SyntaxKind.Constructor){
                                    result = result + memberPatch.getFullText(sourceFilePatch);
                                    break;
                                }
                            }
                        }else{
                            result = result + member.getFullText(sourceFile);
                        }
                        
                    }else if(ts.SyntaxKind.MethodDeclaration){

                    }
                })
            }
            result = result + "\n}";
        }
    })
    console.log(result);
    return result;
}

function syntaxKindToName(kind: ts.SyntaxKind) {
    return (<any>ts).SyntaxKind[kind];
}

export default merge;