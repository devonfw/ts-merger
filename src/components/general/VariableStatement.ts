import { ArrayLiteralExpression } from './ArrayLiteralExpression';
import { ObjectLiteralExpression } from './ObjectLiteralExpression';
import { PropertyDeclaration } from '../classDeclaration/members/property/PropertyDeclaration';
import * as mergeTools from '../../tools/MergerTools';

export class VariableStatement extends PropertyDeclaration {

    private const: boolean = false;

    setIsConst(isConst: boolean) {
        this.const = isConst;
    }

    isConst() {
        return this.const;
    }
    merge(patchVariable: VariableStatement, patchOverrides: boolean) {
        
        if(patchOverrides) {
            this.setType(patchVariable.getType());
            this.setModifiers(patchVariable.getModifiers());
        }
        
        if(this.getInitializer() instanceof ObjectLiteralExpression && patchVariable.getInitializer() instanceof ObjectLiteralExpression) {
            (<ObjectLiteralExpression>this.getInitializer()).merge(<ObjectLiteralExpression>patchVariable.getInitializer(), patchOverrides);
        } else if(this.getInitializer() instanceof ArrayLiteralExpression && patchVariable.getInitializer() instanceof ArrayLiteralExpression) {
            (<ArrayLiteralExpression>this.getInitializer()).merge(<ArrayLiteralExpression>patchVariable.getInitializer(), patchOverrides);
        } else if(patchOverrides) {
            this.setInitializer(patchVariable.getInitializer());
        }
        mergeTools.mergeDecorators(this.getDecorators(), patchVariable.getDecorators(), patchOverrides)
    }
    toString() {
        let result: String[] = [];
        this.getDecorators().forEach(decorator => {
            result.push(decorator.toString());
        })
        this.getModifiers().forEach(modifier => {
            result.push(modifier, " ");
        })
        if(this.isConst()){
            result.push("const ");
        } else {
            result.push("let ");
        }
        result.push(this.getIdentifier());
        if(this.getType() != ""){
            result.push(": ", this.getType());
        }
        if(this.getInitializer()){
            result.push(" = ", this.getInitializer().toString());
        }
        result.push(";\n");

        return result.join("");
    }
}