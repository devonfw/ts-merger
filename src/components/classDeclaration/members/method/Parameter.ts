
/**
 * Defines the structure of a class method parameter
 * 
 * @export
 * @class Parameter
 */
export class Parameter{
    private name: String = "";
    private type: String = "";

    setName(name: String){
        this.name = name;
    } 

    setType(type: String){
        this.type = type;
    }

    getName(): String{
        return this.name;
    }

    getType():String{
        return this.type;
    }

    toString(): String{
        if(this.type !== "")
            return this.name + ": " + this.type;
        else
            return this.name;
    }
}

export default Parameter;