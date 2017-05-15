export class ClassDeclaration{

    private name: String = "";
    private decorators: String [] = [];
    private heritages: String[] = [];
    private modifiers: String[] = [];

    private properties: String[] = [];

    getName():String{
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
        
        return classDeclaration.join("");
    }
}