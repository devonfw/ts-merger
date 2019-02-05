import { Decorator } from '../../../decorator/Decorator';
import { GeneralInterface } from '../../../general/GeneralInterface';
import { Parameter } from '../../../ClassDeclaration/members/method/Parameter';
import * as mergeTools from '../../../../tools/MergerTools';

/**
 * Defines the strucuture of a class method object
 *
 * @export
 * @class InterfaceMethod
 */
export class InterfaceMethod extends GeneralInterface {
  private parameters: Parameter[];
  private decorators: Decorator[];

  constructor() {
    super();
    this.parameters = [];
    this.decorators = [];
  }

  getParameters(): Parameter[] {
    return this.parameters;
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

  addDecorator(decorator: Decorator) {
    this.decorators.push(decorator);
  }

  addDecorators(decorators: Decorator[]) {
    decorators.forEach((decorator) => {
      this.decorators.push(decorator);
    });
  }

  merge(patchMethod: InterfaceMethod, patchOverrides: boolean) {
    let paramExists: boolean;

    mergeTools.mergeDecorators(
      this.getDecorators(),
      patchMethod.getDecorators(),
      patchOverrides,
    );

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
    if (patchOverrides) {
      if (patchMethod.getType().length > 0) {
        this.setType(patchMethod.getType());
      }
    }
  }

  toString(): String {
    let result: String[] = [];
    this.decorators.forEach((decorator) => {
      result.push(decorator.toString(), '\n');
    });
    result.push(this.getIdentifier(), '(');
    this.parameters.forEach((parameter) => {
      result.push(parameter.toString());
      if (this.parameters.indexOf(parameter) < this.parameters.length - 1) {
        result.push(', ');
      }
    });
    result.push(')');
    if (this.getType() !== '') result.push(': ', this.getType(), ';\n', '\n');

    return result.join('');
  }
}

export default InterfaceMethod;
