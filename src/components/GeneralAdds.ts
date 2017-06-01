import * as ts from 'typescript';

export function getDecorators(node: ts.Node, source: ts.SourceFile){
    let decorators: String[] = []
    if (node.decorators) {
        node.decorators.forEach(decorator => {
            decorators.push(decorator.getFullText(source));
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