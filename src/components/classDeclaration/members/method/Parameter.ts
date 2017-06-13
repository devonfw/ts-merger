import { GeneralInterface } from '../../../general/GeneralInterface';

/**
 * Defines the structure of a class method parameter
 * 
 * @export
 * @class Parameter
 */
export class Parameter extends GeneralInterface {

    private modifiers: String[] = [];

    addModifier(modifier: String) {
        this.modifiers.push(modifier);
    }

    getModifiers() {
        return this.modifiers;
    }

    setModifiers(modifiers: String[]) {
        this.modifiers = modifiers;
    }

    merge(patchParameter: Parameter, patchOverrides: boolean) {
        if(patchOverrides) {
            this.setType(patchParameter.getType());
            this.setModifiers(patchParameter.getModifiers());
        }
    }

    toString(): String{
        let result: String[] = [];

        this.modifiers.forEach(modifier => {
            result.push(modifier, " ");
        })
        if(this.getType() !== "")
            result.push(this.getIdentifier() + ": " + this.getType());
        else
            result.push(this.getIdentifier());

        return result.join("");
    }
}

export default Parameter;