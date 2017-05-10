import * as ts from "typescript";
import { ImportClause } from '../components/ImportClause';

/**
 * Handles the imports merge
 * 
 * @export
 * @class ImportMerge
 */
export class ImportMerge{
    /**
     * The base TS file
     * 
     * @private
     * @type {ts.SourceFile}
     * @memberof ImportMerge
     */
    private sourceFile: ts.SourceFile;

    /**
     * The patch TS file
     * 
     * @private
     * @type {ts.SourceFile}
     * @memberof ImportMerge
     */
    private sourceFilePatch: ts.SourceFile;

    /**
     * Array of {@link ImportCaluse}'s
     * 
     * @private
     * @type {ImportClause []}
     * @memberof ImportMerge
     */
    private imports: ImportClause [] = [];

    /**
     * Array of strings to write the result of the merge
     * 
     * @private
     * @type {String []}
     * @memberof ImportMerge
     */
    private result: String [] = [];

    /**
     * Creates an instance of ImportMerge.
     * @param {ts.SourceFile} base 
     * @param {ts.SourceFile} patch 
     * 
     * @memberof ImportMerge
     */
    constructor(base: ts.SourceFile, patch: ts.SourceFile){
        this.sourceFile = base;
        this.sourceFilePatch = patch;
    }

    /**
     * Builds an array of {@link ImportClause} 
     * 
     * @memberof ImportMerge
     */
    merge(){
        this.sourceFile.getChildAt(0).getChildren().forEach(child => {
            switch (child.kind) {
                case ts.SyntaxKind.ImportDeclaration:
                    let importElement: ImportClause = new ImportClause();
                    importElement.setModule((<ts.Identifier>(<ts.ImportDeclaration>child).moduleSpecifier).text);
                    if((<ts.ImportDeclaration>child).importClause){
                        if((<ts.ImportDeclaration>child).importClause.namedBindings){
                            if((<ts.ImportDeclaration>child).importClause.namedBindings.kind == ts.SyntaxKind.NamedImports){
                                (<ts.NamedImports>(<ts.ImportDeclaration>child).importClause.namedBindings).elements.forEach(named => {
                                    importElement.addNamed((<String>named.name.text));
                                })
                            }else {
                                importElement.setNamespace((<ts.NamespaceImport>(<ts.ImportDeclaration>child).importClause.namedBindings).name.text);
                            }
                        }
                    }else {
                        importElement.setSpaceBinding(false);
                    }
                    this.imports.push(importElement);
                break;
            }
        })
        this.mergeImports();
    }
    /**
     * Merge the {@link ImportClause}'s existent in both {@link ts.SourceFile}'s
     * 
     * @memberof ImportMerge
     */
    mergeImports(){
        this.sourceFilePatch.getChildAt(0).getChildren().forEach(childPatch => {
            let exists: boolean = false;
            switch (childPatch.kind) {
                case ts.SyntaxKind.ImportDeclaration:
                this.imports.forEach(importElement => {
                    if((<ts.Identifier>(<ts.ImportDeclaration>childPatch).moduleSpecifier).text == importElement.getModule()){
                        exists = true;
                        if(importElement.getNameSpace() != "" && importElement.getNamed().length > 0){
                            (<ts.NamedImports>(<ts.ImportDeclaration>childPatch).importClause.namedBindings).elements.forEach(clause => {
                                if(!importElement.contains((<String>clause.name.text))){
                                    importElement.addNamed((<String>clause.name.text));
                                }
                            })
                        }
                    }
                })
                break;
            }
        })
        this.imports.forEach(importElement => {
            this.result.push(importElement.toString());
        })
    }

    /**
     * Adds the nonexistent {@link ImportClause}'s at base file to the result
     * 
     * @returns the result string of the merge
     * 
     * @memberof ImportMerge
     */
    addPatchImports(){
        this.sourceFilePatch.getChildAt(0).getChildren().forEach(childPatch => {
            if(childPatch.kind == ts.SyntaxKind.ImportDeclaration){
                let exists: boolean = false;
                for(let element of this.imports){
                    if(element.getModule() == (<ts.Identifier>(<ts.ImportDeclaration>childPatch).moduleSpecifier).text){
                        exists = true;
                        break;
                    }
                }
                if(!exists){
                    this.result.push(childPatch.getFullText(this.sourceFilePatch));
                }
            }
        })

        return this.result.join("");
    }
}


    

    