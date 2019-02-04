import { GeneralInterface } from '../general/GeneralInterface';
import { InterfaceProperty } from './members/InterfaceProperty';
import { InterfaceMethod } from './members/method/InterfaceMethod';
/**
 * Defines the structure of interface objects
 *
 * @export
 * @interface InterfaceDeclaration
 */
export class InterfaceDeclaration extends GeneralInterface {
  private heritages: String[];
  private modifiers: String[];
  private methods: InterfaceMethod[];
  private properties: InterfaceProperty[];
  private index: string;

  constructor() {
    super();
    this.heritages = [];
    this.modifiers = [];
    this.methods = [];
    this.properties = [];
  }

  getIndex() {
    return this.index;
  }

  setIndex(index: string) {
    this.index = index;
  }

  addModifier(modifier: String) {
    this.modifiers.push(modifier);
  }

  addModifiers(modifiers: String[]) {
    modifiers.forEach((modifier) => {
      this.modifiers.push(modifier);
    });
  }

  getModifiers() {
    return this.modifiers;
  }

  setModifiers(modifiers: String[]) {
    this.modifiers = modifiers;
  }

  addHeritage(heritage: String) {
    this.heritages.push(heritage);
  }

  addHeritages(heritages: String[]) {
    heritages.forEach((heritage) => {
      this.heritages.push(heritage);
    });
  }

  getHeritages() {
    return this.heritages;
  }

  setHeritages(heritages: String[]) {
    this.heritages = heritages;
  }

  addProperty(property: InterfaceProperty) {
    this.properties.push(property);
  }

  addProperties(properties: InterfaceProperty[]) {
    this.properties.forEach((property) => {
      this.properties.push(property);
    });
  }

  getProperties() {
    return this.properties;
  }

  addMethod(method: InterfaceMethod) {
    this.methods.push(method);
  }

  addMethods(methods: InterfaceMethod[]) {
    this.methods.forEach((method) => {
      this.methods.push(method);
    });
  }

  getMethods() {
    return this.methods;
  }

  setMethods(methods: InterfaceMethod[]) {
    this.methods = methods;
  }

  toString(): String {
    let interfaceDeclaration: String[] = [];
    this.modifiers.forEach((modifier) => {
      interfaceDeclaration.push(modifier, ' ');
    });
    interfaceDeclaration.push('interface ', this.getIdentifier());
    this.heritages.forEach((heritage) => {
      interfaceDeclaration.push(heritage);
    });
    interfaceDeclaration.push(' {\n');

    this.properties.forEach((property) => {
      interfaceDeclaration.push(property.toString(), '\n');
    });
    if (this.methods.length > 0) {
      this.methods.forEach((method) => {
        interfaceDeclaration.push(method.toString());
      });
    }

    interfaceDeclaration.push('\n}\n');

    return interfaceDeclaration.join('');
  }
}

export default InterfaceDeclaration;
