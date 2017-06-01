import { Method } from './members/method/Method';

/**
 * Defines the structure of class objects
 * 
 * @export
 * @class ClassDeclaration
 */
export class ClassDeclaration{

    private name: String = "";
    private decorators: String [] = [];
    private heritages: String[] = [];
    private modifiers: String[] = [];
    private methods: Method[] = [];
    private properties: String[] = [];
    private construct: String = "";

    getConstructor(){
        return this.construct;
    }

    setConstructor(constrcut: String){
        this.construct = constrcut;
    }
    getName():String{


        let name: string;
        let surname: string;
        let age: number;
        let salary: number;
        let mail: string;


        return this.name;
    }

    setName(name: String){
        this.name = name;
    }
    addDecorator(decorator: String){
        this.decorators.push(decorator);
    }
    addDecorators(decorators: String[]){
        decorators.forEach(decorator => {
            this.decorators.push(decorator);
        })
    }
    addModifier(modifier: String){
        this.modifiers.push(modifier);
    }

    addModifiers(modifiers: String []){
        modifiers.forEach(modifier => {
            this.modifiers.push(modifier);
        })
    }

    addHeritage(heritage: String){
        this.heritages.push(heritage);
    }

    addHeritages(heritages: String []){
        heritages.forEach(heritage => {
            this.heritages.push(heritage);
        })
    }

    addProperty(property: String) {
        this.properties.push(property);
    }

    addProperties(properties: String[]){
        properties.forEach(property => {
            this.properties.push(property);
        })
    }

    addMethod(method: Method){
        this.methods.push(method);
    }

    addMethods(methods: Method[]){
        methods.forEach(method => {
            this.methods.push(method);
        })
    }

    toString(): String{
        let classDeclaration: String[] = [];
        this.decorators.forEach(decorator => {
            classDeclaration.push(decorator, "\n");
        })
        this.modifiers.forEach(modifier => {
            classDeclaration.push(modifier, " ");
        })
        classDeclaration.push("class ", this.name);
        this.heritages.forEach(heritage => {
            classDeclaration.push(heritage, " ");
        })
        classDeclaration.push("{\n");

        this.properties.forEach(property => {
            classDeclaration.push(property, "\n");
        })

        classDeclaration.push(this.construct, "\n");
        this.methods.forEach(method => {
            classDeclaration.push(method.toString());
        })

        classDeclaration.push("\n}\n");
        
        return classDeclaration.join("");
    }
}

export default ClassDeclaration;