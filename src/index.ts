import { TSFile } from './components/TSFile';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as encIconV from 'iconv-lite';
import * as mapTools from './tools/MappingTools';

/**
 * Defines possible arguments and processes them. If all necessary arguments are given, the merge will be performed. 
 */

const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'patchOverride', alias: 'f', type: Boolean, defaultValue: false },
  { name: 'basePath', alias:'b', type: String },
  { name: 'patchPath', alias: 'p', type: String },
  { name: 'outputPath', alias: 'o', type: String, defaultValue: "" },
  { name: 'encoding', alias: 'e', type: String, defaultValue: 'UTF-8' }
];
const options = commandLineArgs(optionDefinitions, { partial: true });
if (options.basePath && options.patchPath){
    merge(options.patchOverride, options.basePath, options.patchPath, options.outputPath, options.encoding);
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
    if (encoding === "ISO-8859-1") {
        let patchContents = Buffer.from(fs.readFileSync(filePatch, "binary"), "UTF-8");
        let baseContents = Buffer.from(fs.readFileSync(fileBase, "binary"), "UTF-8");
        sourceFilePatch = ts.createSourceFile(filePatch, encIconV.decode(patchContents, "ISO-8859-1"), ts.ScriptTarget.ES2016, false);
        sourceFile = ts.createSourceFile(fileBase, encIconV.decode(baseContents, "ISO-8859-1"), ts.ScriptTarget.ES2016, false);
    } else {
        sourceFilePatch = ts.createSourceFile(filePatch, fs.readFileSync(filePatch, encoding).toString(), ts.ScriptTarget.ES2016, false);
        sourceFile = ts.createSourceFile(fileBase, fs.readFileSync(fileBase, encoding).toString(), ts.ScriptTarget.ES2016, false);
    }


    let baseFile: TSFile = mapTools.mapFile(sourceFile);
    let patchFile: TSFile = mapTools.mapFile(sourceFilePatch);
    
    baseFile.merge(patchFile, patchOverrides);

    if(resultFile != "") {
        if (encoding === "ISO-8859-1"){
            fs.writeFileSync(resultFile, baseFile.toString(), {encoding:"binary", flag:'w'});
        } else {
            fs.writeFileSync(resultFile, baseFile.toString(), {encoding:encoding, flag:'w'});
        }
    }

    return baseFile.toString();
    
}

export default merge;
