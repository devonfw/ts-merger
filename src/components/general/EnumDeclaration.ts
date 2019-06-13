import { ObjectLiteralExpression } from './ObjectLiteralExpression';
import { EnumElement } from './EnumElement';

export class EnumDeclaration {
  private name: String;
  private elements: EnumElement[];

  constructor() {
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

  merge(
    baseEnum: EnumDeclaration,
    patchEnum: EnumDeclaration,
    patchOverrides: boolean,
  ) {
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

    result.push('enum ', this.getName(), ' {');
    this.elements.forEach((element) => {
      result.push(element.toString());
    });
    result.push('}');
    return result.join('');
  }
}
