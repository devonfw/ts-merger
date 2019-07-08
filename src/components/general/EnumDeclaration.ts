import { EnumElement } from './EnumElement';

export class EnumDeclaration {
  private name: String;
  private elements: EnumElement[];
  private modifiers: String[];

  constructor() {
    this.modifiers = [];
    this.name = '';
    this.elements = [];
  }

  setName(name: String) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  addElement(argument: EnumElement) {
    this.elements.push(argument);
  }

  getElements() {
    return this.elements;
  }

  setElements(args: EnumElement[]) {
    this.elements = args;
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

  merge(
    baseEnum: EnumDeclaration,
    patchEnum: EnumDeclaration,
    patchOverrides: boolean,
  ) {
    if (patchOverrides) {
      this.setModifiers(patchEnum.getModifiers());
    }

    let exists: boolean;
    patchEnum.getElements().forEach((patchElement) => {
      exists = false;
      baseEnum.getElements().forEach((element) => {
        if (patchElement.getName() === element.getName()) {
          exists = true;
          if (patchOverrides) {
            element.setInitializer(patchElement.getInitializer());
          }
        }
      });
      if (!exists) {
        baseEnum.addElement(patchElement);
      }
    });
  }

  toString() {
    let result: String[] = [];

    this.modifiers.forEach((modifier) => {
      result.push(modifier, ' ');
    });

    result.push('enum ', this.getName(), ' {');
    this.elements.forEach((element) => {
      result.push(element.toString());
    });
    result.push('}');
    return result.join('');
  }
}
