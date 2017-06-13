import { Constructor } from './members/constructor/Constructor';
import { PropertyDeclaration } from './members/property/PropertyDeclaration';
import { Decorator } from '../decorator/Decorator';
import { GeneralInterface } from '../general/GeneralInterface';
import { Method } from './members/method/Method';

/**
 * Defines the structure of class objects
 * 
 * @export
 * @class ClassDeclaration
 */
export class ClassDeclaration extends GeneralInterface{

    private decorators: Decorator [] = [];
    private heritages: String[] = [];
    private modifiers: String[] = [];
    private methods: Method[] = [];
    private properties: PropertyDeclaration[] = [];
    private construct: Constructor = new Constructor();

    getConstructor(){
        return this.construct;
    }

    setConstructor(constrcut: Constructor){
        this.construct = constrcut;
    }

    addDecorator(decorator: Decorator){
        this.decorators.push(decorator);
    }
    addDecorators(decorators: Decorator[]){
        decorators.forEach(decorator => {
            this.decorators.push(decorator);
        })
    }

    getDecorators() {
        return this.decorators;
    }

    setDecorators(decorators: Decorator[]) {
        this.decorators = decorators;
    }

    addModifier(modifier: String){
        this.modifiers.push(modifier);
    }

    addModifiers(modifiers: String []){
        modifiers.forEach(modifier => {
            this.modifiers.push(modifier);
        })
    }

    getModifiers() {
        return this.modifiers;
    }

    setModifiers(modifiers: String[]) {
        this.modifiers = modifiers;
    }

    addHeritage(heritage: String){
        this.heritages.push(heritage);
    }

    addHeritages(heritages: String []){
        heritages.forEach(heritage => {
            this.heritages.push(heritage);
        })
    }

    getHeritages() {
        return this.heritages;
    }

    setHeritages(heritages: String[]) {
        this.heritages = heritages;
    }

    addProperty(property: PropertyDeclaration) {
        this.properties.push(property);
    }

    addProperties(properties: PropertyDeclaration[]){
        this.properties.forEach(property => {
            this.properties.push(property);
        })
    }

    getProperties() {
        return this.properties;
    }

    addMethod(method: Method){
        this.methods.push(method);
    }

    addMethods(methods: Method[]){
        this.methods.forEach(method => {
            this.methods.push(method);
        })
    }

    getMethods() {
        return this.methods;
    }

    setMethods(methods: Method[]) {
        this.methods = methods;
    }

    toString(): String{
        let classDeclaration: String[] = [];
        this.decorators.forEach(decorator => {
            classDeclaration.push(decorator.toString(), "\n");
        })
        this.modifiers.forEach(modifier => {
            classDeclaration.push(modifier, " ");
        })
        classDeclaration.push("class ", this.getIdentifier());
        this.heritages.forEach(heritage => {
            classDeclaration.push(heritage);
        })
        classDeclaration.push(" {\n");

        this.properties.forEach(property => {
            classDeclaration.push(property.toString(), "\n");
        })

        classDeclaration.push(this.construct.toString(), "\n");
        this.methods.forEach(method => {
            classDeclaration.push(method.toString());
        })

        classDeclaration.push("\n}\n");
        
        return classDeclaration.join("");
    }
}

export default ClassDeclaration;