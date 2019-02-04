import { Decorator } from '../../../decorator/Decorator';
import { GeneralInterface } from '../../../general/GeneralInterface';
import { Parameter } from './Parameter';
import * as mergeTools from '../../../../tools/MergerTools';
import { BodyMethod, default as Body } from './body/BodyMethod';

/**
 * Defines the structure of a class method object
 *
 * @export
 * @class Method
 */
export class Method extends GeneralInterface {
  private parameters: Parameter[];
  private modifiers: String[];
  private decorators: Decorator[];
  private body: BodyMethod;

  constructor() {
    super();
    this.parameters = [];
    this.modifiers = [];
    this.decorators = [];
    this.body = new BodyMethod();
  }

  getParameters(): Parameter[] {
    return this.parameters;
  }

  getModifiers(): String[] {
    return this.modifiers;
  }

  setModifiers(modifiers: String[]) {
    this.modifiers = modifiers;
  }

  getDecorators() {
    return this.decorators;
  }

  setDecorators(decorators: Decorator[]) {
    this.decorators = decorators;
  }

  addParameter(parameter: Parameter) {
    this.parameters.push(parameter);
  }

  addParameters(parameters: Parameter[]) {
    parameters.forEach((parameter) => {
      this.parameters.push(parameter);
    });
  }

  addModifier(modifier: String) {
    this.modifiers.push(modifier);
  }

  addModifiers(modifiers: String[]) {
    modifiers.forEach((modifier) => {
      this.modifiers.push(modifier);
    });
  }

  addDecorator(decorator: Decorator) {
    this.decorators.push(decorator);
  }

  addDecorators(decorators: Decorator[]) {
    decorators.forEach((decorator) => {
      this.decorators.push(decorator);
    });
  }

  getBody(): BodyMethod {
    return this.body;
  }

  setBody(body: BodyMethod) {
    this.body = body;
  }

  merge(patchMethod: Method, patchOverrides: boolean) {
    let paramExists: boolean;

    mergeTools.mergeDecorators(
      this.getDecorators(),
      patchMethod.getDecorators(),
      patchOverrides,
    );
    if (patchOverrides) {
      this.setModifiers(patchMethod.getModifiers());
      this.setBody(patchMethod.getBody());
    } else {
      this.getBody().merge(patchMethod.getBody(), patchOverrides);
    }

    patchMethod.getParameters().forEach((patchParameter) => {
      paramExists = false;
      this.getParameters().forEach((parameter) => {
        if (patchParameter.getIdentifier() === parameter.getIdentifier()) {
          paramExists = true;
          parameter.merge(patchParameter, patchOverrides);
        }
      });
      if (!paramExists) {
        this.addParameter(patchParameter);
      }
    });
  }

  toString(): String {
    let result: String[] = [];
    this.decorators.forEach((decorator) => {
      result.push(decorator.toString(), '\n');
    });
    this.modifiers.forEach((modifier) => {
      result.push(modifier, ' ');
    });
    result.push(this.getIdentifier(), '(');
    this.parameters.forEach((parameter) => {
      result.push(parameter.toString());
      if (this.parameters.indexOf(parameter) < this.parameters.length - 1) {
        result.push(', ');
      }
    });
    result.push(')');
    if (this.getType() !== '')
      result.push(': ', this.getType(), '\n', this.body.toString(), '\n', '\n');
    else result.push('\n', this.body.toString(), '\n', '\n');

    return result.join('');
  }
}

export default Method;
