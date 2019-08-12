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
export function merge(
  baseContents: string,
  patchContents: string,
  patchOverrides: boolean,
): string {

  let baseFile: TSFile = readFile(baseContents, 'fileBase');
  let patchFile: TSFile = readFile(patchContents, 'filePatch');

  baseFile.merge(patchFile, patchOverrides);

  return baseFile.toString();
}
export default merge;

/**
 * Converts a typescript string to an AST
 *
 * @export
 * @param {string} fileBase
 * @returns {string} the result of the merge
 */
export function readFile(
  content: string,
  name?: string
): TSFile {

  var fileName = 'fileName';
  if (name) {
    fileName = name;
  }

  let sourceFile: ts.SourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.ES2016,
    false,
  );

  let parsedFile: TSFile = mapTools.mapFile(sourceFile);

  return parsedFile;
}