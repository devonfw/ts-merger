import { Constructor } from './members/constructor/Constructor';
import { PropertyDeclaration } from './members/property/PropertyDeclaration';
import { Decorator } from '../decorator/Decorator';
import { FileDeclaration } from '../general/FileDeclaration';
import { Method } from './members/method/Method';
/**
 * Defines the structure of class objects
 *
 * @export
 * @class ClassDeclaration
 */
export class ClassDeclaration extends FileDeclaration {
  private decorators: Decorator[];
  private methods: Method[];
  private properties: PropertyDeclaration[];
  private construct: Constructor;

  constructor() {
    super();
    this.decorators = [];
    this.methods = [];
    this.properties = [];
    this.construct = new Constructor();
  }

  getConstructor() {
    return this.construct;
  }

  setConstructor(constrcut: Constructor) {
    this.construct = constrcut;
  }

  addDecorator(decorator: Decorator) {
    this.decorators.push(decorator);
  }
  addDecorators(decorators: Decorator[]) {
    decorators.forEach((decorator) => {
      this.decorators.push(decorator);
    });
  }

  getDecorators() {
    return this.decorators;
  }

  setDecorators(decorators: Decorator[]) {
    this.decorators = decorators;
  }

  addProperty(property: PropertyDeclaration) {
    this.properties.push(property);
  }

  addProperties(properties: PropertyDeclaration[]) {
    this.properties.forEach((property) => {
      this.properties.push(property);
    });
  }

  getProperties() {
    return this.properties;
  }

  addMethod(method: Method) {
    this.methods.push(method);
  }

  addMethods(methods: Method[]) {
    this.methods.forEach((method) => {
      this.methods.push(method);
    });
  }

  getMethods() {
    return this.methods;
  }

  setMethods(methods: Method[]) {
    this.methods = methods;
  }

  toString(): String {
    let classDeclaration: String[] = [];

    this.decorators.forEach((decorator) => {
      classDeclaration.push(decorator.toString(), '\n');
    });
    super.getModifiers().forEach((modifier) => {
      classDeclaration.push(modifier, ' ');
    });

    classDeclaration.push('class ', this.getIdentifier());
    super.getHeritages().forEach((heritage) => {
      classDeclaration.push(heritage);
    });
    classDeclaration.push(' {\n');

    this.properties.forEach((property) => {
      classDeclaration.push(property.toString(), '\n');
    });
    if (this.construct.getIdentifier() !== '') {
      classDeclaration.push(this.construct.toString(), '\n');
    }
    if (this.methods.length > 0) {
      this.methods.forEach((method) => {
        classDeclaration.push(method.toString());
      });
    }

    classDeclaration.push('\n}\n');

    return classDeclaration.join('');
  }
}

export default ClassDeclaration;
