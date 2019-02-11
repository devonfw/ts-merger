import { GeneralInterface } from '../general/GeneralInterface';

/**
 * Defines the structure of generic class objects
 *
 * @export
 * @class FileDeclaration
 */
export class FileDeclaration extends GeneralInterface {
  private heritages: String[];
  private modifiers: String[];

  constructor() {
    super();
    this.heritages = [];
    this.modifiers = [];
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
}

export default FileDeclaration;
