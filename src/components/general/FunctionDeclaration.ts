import { Method } from '../classDeclaration/members/method/Method';

export class FunctionDeclaration extends Method {

    toString() {
        let result: String[] = [];
        this.getDecorators().forEach(decorator => {
            result.push(decorator.toString(), "\n");
        })
        this.getModifiers().forEach(modifier => {
            result.push(modifier, " ");
        })
        result.push("function ", this.getIdentifier(), "(");
        this.getParameters().forEach(parameter => {
            result.push(parameter.toString());
            if(this.getParameters().indexOf(parameter) < this.getParameters().length - 1){
                result.push(", ");
            }
        })
        result.push(")");
        if(this.getType() !== "")
            result.push(": ", this.getType(), "\n", this.getBody().toString(), "\n", "\n");
        else
            result.push("\n", this.getBody().toString(), "\n", "\n");
        
        return result.join("");
    }
}

export default FunctionDeclaration;