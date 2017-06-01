import * as ts from "typescript";
import Constants from '../utils/Constants';
import Method from '../components/classDeclaration/members/method/Method';
import Parameter from '../components/classDeclaration/members/method/Parameter';
import * as cbMerge from '../utils/tools/CobiGenMerge';
import ClassDeclaration  from '../components/classDeclaration/ClassDeclaration';
import * as ga from '../components/GeneralAdds';

/**
 * Handles the methods merge
 * 
 * @export
 * @class MethodMerge
 */
export class MethodMerge{

    /**
     * The base TS file
     * 
     * @private
     * @type {ts.SourceFile}
     * @memberof MethodMerge
     */
    private sourceFile: ts.SourceFile;

    /**
     * The patch TS file
     * 
     * @private
     * @type {ts.SourceFile}
     * @memberof MethodMerge
     */
    private sourceFilePatch: ts.SourceFile;

    /**
     * Merge strategy to follow
     * @type {boolean}
     * @memberof MethodMerge
     */
    private patchOverrides: boolean;

    /**
     * Array of strings to write the result of the merge
     * 
     * @private
     * @type {String []}
     * @memberof MethodMerge
     */
    private result: String [] = [];

    /**
     * Creates an instance of MethodMerge.
     * @param {ts.SourceFile} base 
     * @param {ts.SourceFile} patch 
     * 
     * @memberof MethodMerge
     */
    constructor(base: ts.SourceFile, patch: ts.SourceFile, patchOverrides: boolean){
        this.sourceFile = base;
        this.sourceFilePatch = patch;
        this.patchOverrides = patchOverrides;
    }

    merge(methodBase: ts.MethodDeclaration, members, classToPrint: ClassDeclaration, columnsInfo: String){
        let identifier: string = (<ts.Identifier>methodBase.name).text;
        let exists: boolean = false;
        for (let memberPatch of members) {
            if (memberPatch.kind === ts.SyntaxKind.MethodDeclaration) {
                let identifierPatch: string = (<ts.Identifier>(<ts.MethodDeclaration>memberPatch).name).text;
                if (identifier === identifierPatch){
                    let methodPatch = <ts.MethodDeclaration>memberPatch;
                    exists = true;
                    let properties: string[] = [];
                    let method: Method = new Method();
                    method.setName(identifier);
                    if(methodBase.type){
                        method.setType(methodBase.type.getFullText(this.sourceFile));
                    }
                    method.addDecorators(ga.getDecorators(methodBase, this.sourceFile));
                    method.addModifiers(ga.getModifiers(methodBase, this.sourceFile));
                    if (methodBase.parameters) {
                        methodBase.parameters.forEach(parameter => {
                            let param: Parameter = new Parameter();
                            param.setName((<ts.Identifier>parameter.name).text);
                            if(parameter.type)
                                param.setType((<String>parameter.type.getFullText(this.sourceFile)));
                            method.addParameter(param);
                        })
                    }
                    if(this.patchOverrides){
                        classToPrint.addMethod(this.buildMethod(this.sourceFilePatch, methodPatch));
                    }else{
                        let body: String[] = [];
                        body.push("{\n");
                        switch (identifier) {
                            case Constants.cbGetData:
                                cbMerge.mergeGetData(methodBase, methodPatch, body, this.sourceFile, this.sourceFilePatch, properties, method, classToPrint);
                            break;
                            case Constants.cbSaveData:
                                cbMerge.mergeSaveData(methodBase, methodPatch, body, properties, this.sourceFile, this.sourceFilePatch, method, classToPrint);
                            break;
                            case Constants.cbNgDoCheck:
                                cbMerge.mergeNgDoCheck(methodBase, methodPatch, body, properties, this.sourceFile, this.sourceFilePatch, method, classToPrint, columnsInfo);
                            break;
                            default:
                                if(methodBase.body){
                                    method.setBody(methodBase.body.getFullText(this.sourceFile));
                                }
                                classToPrint.addMethod(method);
                                exists = true;
                            break;
                        }
                    }
                }
            }
        }
        if (!exists) {
            classToPrint.addMethod(this.buildMethod(this.sourceFile, methodBase));
            exists = false;
        }
    }
    
    buildMethod(source: ts.SourceFile, methodDecl: ts.MethodDeclaration): Method{
        let method: Method = new Method();
        method.setName((<String>(<ts.Identifier>methodDecl.name).text));
        if(methodDecl.type){
            method.setType(methodDecl.type.getFullText(source));
        }
        if(methodDecl.decorators){
            methodDecl.decorators.forEach(decorator => {
                method.addDecorator(decorator.getFullText(source));
            })
        }
        if(methodDecl.modifiers){
            methodDecl.modifiers.forEach(modifier => {
                method.addModifier(modifier.getFullText(source));
            })
        }
        if(methodDecl.parameters){
            methodDecl.parameters.forEach(parameter => {
                let param: Parameter = new Parameter();
                param.setName((<ts.Identifier>parameter.name).text);
                if(parameter.type){
                    param.setType(parameter.type.getFullText(source));
                }
                method.addParameter(param);
            })
        }
        method.setBody(methodDecl.body.getFullText(source));
        
        return method;     
    }
}

export default MethodMerge;