import * as ts from 'typescript';
import Constants from '../utils/Constants';
import * as cbMerge from '../utils/tools/CobiGenMerge';

export function getDecorators(node: ts.Node, nodePatch: ts.Node, patchOverrides: boolean, source: ts.SourceFile, sourcePatch: ts.SourceFile){
    let decorators: String[] = [];
    let exists: boolean = false;
    if (node.decorators) {
        node.decorators.forEach(decorator => {
            let identifier: string;
            if((<ts.CallExpression>decorator.expression).arguments){
                identifier = (<ts.Identifier>(<ts.CallExpression>decorator.expression).expression).text;
            }else{
                identifier = (<ts.Identifier>(<ts.Decorator>decorator).expression).text;
            }
            if (nodePatch.decorators) {
                nodePatch.decorators.forEach(decoratorPatch => {
                    let deco: ts.Decorator = <ts.Decorator>decoratorPatch;
                    let identifierPatch: string;
                    if((<ts.CallExpression>decorator.expression).arguments){
                        identifierPatch = (<ts.Identifier>(<ts.CallExpression>deco.expression).expression).text;
                    }else{
                        identifierPatch = (<ts.Identifier>(<ts.Decorator>deco).expression).text;
                    }
                    if(identifier === identifierPatch){
                        if(identifier === Constants.cbNgModule && identifierPatch === Constants.cbNgModule){
                            decorators.push(cbMerge.ngModuleCase(decorator, decoratorPatch, source, sourcePatch));
                            exists = true;
                        }else{
                            
                            if(patchOverrides){
                                decorators.push(decoratorPatch.getFullText(sourcePatch));
                            }else{
                                decorators.push(decorator.getFullText(source));
                            }
                        }
                    }
                })
                if(!exists){
                    decorators.push(decorator.getFullText(source));
                }
            }
        })    
    }
    
    if (nodePatch.decorators) {
        nodePatch.decorators.forEach(decoratorPatch => {
            exists = false;
             let identifierPatch: string;
            if((<ts.CallExpression>decoratorPatch.expression).arguments){
                identifierPatch = (<ts.Identifier>(<ts.CallExpression>decoratorPatch.expression).expression).text;
            }else{
                identifierPatch = (<ts.Identifier>(<ts.Decorator>decoratorPatch).expression).text;
            }
            if (node.decorators) {
                node.decorators.forEach(decorator => {
                    let deco: ts.Decorator = <ts.Decorator>decorator;
                    let identifier: string;
                    if((<ts.CallExpression>decorator.expression).arguments){
                        identifier = (<ts.Identifier>(<ts.CallExpression>decorator.expression).expression).text;
                    }else{
                        identifier = (<ts.Identifier>(<ts.Decorator>decorator).expression).text;
                    }
                    if(identifierPatch === identifier){
                        exists = true;
                    }
                })
                if(!exists){
                    decorators.push(decoratorPatch.getFullText(sourcePatch));
                }
            }
        })    
    }
    
    return decorators;
}

export function getModifiers(node: ts.Node, source: ts.SourceFile){
    let modifiers: String[] = [];
    if (node.modifiers) {
        node.modifiers.forEach(modifier => {
            modifiers.push(modifier.getFullText(source));
        })
    }
    return modifiers;
}

export function getHeritages(node: ts.ClassDeclaration, source: ts.SourceFile){
    let heritages:String[] = [];
    if (node.heritageClauses) {
        node.heritageClauses.forEach(heritage => {
            heritages.push(heritage.getFullText(source));
        })
    }
    return heritages;
}