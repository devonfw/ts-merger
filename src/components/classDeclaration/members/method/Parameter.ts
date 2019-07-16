import { Decorator } from '../../../decorator/Decorator';
import { GeneralInterface } from '../../../general/GeneralInterface';

/**
 * Defines the structure of a class method parameter
 *
 * @export
 * @class Parameter
 */
export class Parameter extends GeneralInterface {
  private decorators: Decorator[];
  private modifiers: String[];
  private initialValue: any;

  constructor() {
    super();
    this.decorators = [];
    this.modifiers = [];
  }

  getInitialValue() {
    return this.initialValue;
  }

  setInitialValue(initialValue) {
    this.initialValue = initialValue;
  }
  addModifier(modifier: String) {
    this.modifiers.push(modifier);
  }

  getModifiers() {
    return this.modifiers;
  }

  setModifiers(modifiers: String[]) {
    this.modifiers = modifiers;
  }

  addDecorator(decorator: Decorator) {
    this.decorators.push(decorator);
  }

  addDecorators(decorators: Decorator[]) {
    decorators.forEach((decorator) => {
      this.addDecorator(decorator);
    });
  }

  getDecorators() {
    return this.decorators;
  }

  setDecorators(decorators: Decorator[]) {
    this.decorators = decorators;
  }

  merge(patchParameter: Parameter, patchOverrides: boolean) {
    if (patchOverrides) {
      this.setType(patchParameter.getType());
      this.setModifiers(patchParameter.getModifiers());
      this.setInitialValue(patchParameter.getInitialValue());
    }
  }

  toString(): String {
    let result: String[] = [];

    this.decorators.forEach((decorator) => {
      result.push(decorator.toString());
    });
    this.modifiers.forEach((modifier) => {
      result.push(modifier, ' ');
    });
    if (this.getType() !== '')
      result.push(this.getIdentifier() + ': ' + this.getType());
    else result.push(this.getIdentifier());

    if (this.getInitialValue()) result.push(' = ', this.getInitialValue().toString());
    return result.join('');
  }
}

export default Parameter;
