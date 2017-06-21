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
import * as encIconV from 'iconv-lite';
import ImportClause  from './components/import/ImportClause';
import ClassDeclaration  from './components/classDeclaration/ClassDeclaration';
import Method from './components/classDeclaration/members/method/Method';
import Parameter from './components/classDeclaration/members/method/Parameter';
import * as mapTools from './tools/MappingTools';

let strategy = process.argv[2].toLowerCase() === "true" ? true : false;
let base = process.argv[3];
let patch = process.argv[4];
let result = process.argv[5];
let encoding;
if(process.argv[6]) {
    encoding = process.argv[6];
} else {
    encoding = "UTF-8";
}

if(strategy){
    merge(true, base, patch, result, encoding);
}else{
    merge(false, base, patch, result, encoding);
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
export function merge(patchOverrides: boolean, fileBase: string, filePatch: string, resultFile: string, encoding: string): string {
    let sourceFilePatch: ts.SourceFile;
    let sourceFile: ts.SourceFile
    if(encoding === "ISO-8859-1") {
        let patchContents = Buffer.from(fs.readFileSync(filePatch, {encoding: "binary"}), "UTF-8");
        let baseContents = Buffer.from(fs.readFileSync(fileBase, {encoding: "binary"}), "UTF-8");
        sourceFilePatch = ts.createSourceFile(filePatch, encIconV.decode(patchContents, "ISO-8859-1"), ts.ScriptTarget.ES2016, false);
        sourceFile = ts.createSourceFile(fileBase, encIconV.decode(baseContents, "ISO-8859-1"), ts.ScriptTarget.ES2016, false);
    } else {
        sourceFilePatch = ts.createSourceFile(filePatch, fs.readFileSync(filePatch, {encoding: encoding}).toString(), ts.ScriptTarget.ES2016, false);
        sourceFile = ts.createSourceFile(fileBase, fs.readFileSync(fileBase, {encoding : encoding}).toString(), ts.ScriptTarget.ES2016, false);
    }


    let baseFile: TSFile = mapTools.mapFile(sourceFile);
    let patchFile: TSFile = mapTools.mapFile(sourceFilePatch);
    
    baseFile.merge(patchFile, patchOverrides);

    if(encoding === "ISO-8859-1"){
        fs.writeFileSync(resultFile, baseFile.toString(), {encoding: "binary"});
    } else {
        fs.writeFileSync(resultFile, baseFile.toString(), {encoding: encoding});
    }
    return baseFile.toString();
    
}

export default merge;
