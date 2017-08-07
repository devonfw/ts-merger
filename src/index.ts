import { TSFile } from './components/TSFile';
import * as ts from 'typescript';
import * as mapTools from './tools/MappingTools';

/**
 * Performs a merge of a patch and base file depending on the merge strategy
 * 
 * @export
 * @param {string} fileBase 
 * @param {string} filePatch 
 * @param {boolean} patchOverrides 
 * @returns {string} the result of the merge
 */
export function merge(baseContents: string, patchContents: string, patchOverrides: boolean): string {
    let sourceFilePatch: ts.SourceFile = ts.createSourceFile("filePatch", patchContents, ts.ScriptTarget.ES2016, false);
    let sourceFile: ts.SourceFile = ts.createSourceFile("fileBase", baseContents, ts.ScriptTarget.ES2016, false);
        
    let baseFile: TSFile = mapTools.mapFile(sourceFile);
    let patchFile: TSFile = mapTools.mapFile(sourceFilePatch);
    
    baseFile.merge(patchFile, patchOverrides);

    return baseFile.toString();  
}

export default merge;
