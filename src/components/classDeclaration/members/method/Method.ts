import { Parameter } from './Parameter';


/**
 * Defines the strucuture of a class method object
 * 
 * @export
 * @class Method
 */
export class Method{
    private parameters: Parameter[] = [];
    private modifiers: String[] = [];
    private decorators: String[] = [];
    private name: String = "";
    private body: String = "";
    private type: String = "";
    
    getParameters():Parameter[] {
        return this.parameters;
    }

    getModifiers():String[] {
        return this.modifiers;
    }

    getDecorators():String[] {
        return this.decorators;
    }

    getName():String {
        return this.name;
    }

    setName(name: String){
        this.name = name;
    }

    getType(): String{
        return this.type;
    }

    setType(type: String){
        this.type= type;
    }

    addParameter(parameter: Parameter){
        this.parameters.push(parameter);
    }

    addParameters(parameters: Parameter[]){
        parameters.forEach(parameter => {
            this.parameters.push(parameter);
        })
    }
    
    addModifier(modifier: String){
        this.modifiers.push(modifier);
    }

    addModifiers(modifiers: String[]){
        modifiers.forEach(modifier => {
            this.modifiers.push(modifier);
        })
    }

    addDecorator(decorator: String){
        this.decorators.push(decorator);
    }

    addDecorators(decorators: String[]){
        decorators.forEach(decorator => {
            this.decorators.push(decorator);
        })
    }

    getBody():String {
        return this.body;
    }

    setBody(body: String){
        this.body = body;
    }

    toString(): String{
        let result: String[] = [];
        this.decorators.forEach(decorator => {
            result.push(decorator, "\n");
        })
        this.modifiers.forEach(modifier => {
            result.push(modifier, " ");
        })
        result.push(this.name, "(");
        this.parameters.forEach(parameter => {
            result.push(parameter.toString());
            if(this.parameters.indexOf(parameter) < this.parameters.length - 1){
                result.push(", ");
            }
        })
        result.push(")");
        if(this.type !== "")
            result.push(": ", this.type, "\n", this.body, "\n", "\n");
        else
            result.push("\n", this.body, "\n", "\n");
        

        return result.join("");
    }
    
}

export default Method;