import { Constructor } from './components/classDeclaration/members/constructor/Constructor';
import { PropertyDeclaration } from './components/classDeclaration/members/property/PropertyDeclaration';
import { GeneralInterface } from './components/general/GeneralInterface';
import { ArrayLiteralExpression } from './components/general/ArrayLiteralExpression';
import { PropertyAssignment } from './components/general/PropertyAssignment';
import { ObjectLiteralExpression } from './components/general/ObjectLiteralExpression';
import { Decorator } from './components/decorator/Decorator';
import { TSFile } from './components/TSFile';
import * as fs from 'fs';
import * as ts from 'typescript';
import ImportClause  from './components/import/ImportClause';
import ClassDeclaration  from './components/classDeclaration/ClassDeclaration';
import Method from './components/classDeclaration/members/method/Method';
import Parameter from './components/classDeclaration/members/method/Parameter';
import * as mapTools from './tools/MappingTools';


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

    let sourceFilePatch: ts.SourceFile = ts.createSourceFile(filePatch, fs.readFileSync(filePatch).toString(), ts.ScriptTarget.ES2016, false);
    let sourceFile: ts.SourceFile = ts.createSourceFile(fileBase, fs.readFileSync(fileBase).toString(), ts.ScriptTarget.ES2016, false);

    let baseFile: TSFile = mapTools.mapFile(sourceFile);
    let patchFile: TSFile = mapTools.mapFile(sourceFilePatch);
    
    baseFile.merge(patchFile, patchOverrides);
    console.log(baseFile.toString());
    return baseFile.toString();
    
}

export default merge;
