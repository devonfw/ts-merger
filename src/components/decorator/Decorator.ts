import { ArrayLiteralExpression } from '../general/ArrayLiteralExpression';
import { ObjectLiteralExpression } from '../general/ObjectLiteralExpression';
import { GeneralInterface } from '../general/GeneralInterface';

/**
 *Defines and import clause structure
 *
 * @export
 * @class Decorator
 */
export class Decorator extends GeneralInterface {
  private args: any[];
  private isCallExpression: boolean;

  constructor() {
    super();
    this.args = [];
    this.isCallExpression = false;
  }

  addArgument(argument: any) {
    this.args.push(argument);
  }

  getArguments() {
    return this.args;
  }

  setArguments(args: any[]) {
    this.args = args;
  }

  setIsCallExpression(isCall: boolean) {
    this.isCallExpression = isCall;
  }

  getIsCallExpression(): boolean {
    return this.isCallExpression;
  }

  merge(patchDecorator: Decorator, patchOverrides) {
    patchDecorator.getArguments().forEach((patchArgument) => {
      this.getArguments().forEach((argument) => {
        if (
          patchArgument instanceof ObjectLiteralExpression &&
          argument instanceof ObjectLiteralExpression
        ) {
          (<ObjectLiteralExpression>argument).merge(
            <ObjectLiteralExpression>patchArgument,
            patchOverrides,
          );
        } else if (
          patchArgument instanceof ArrayLiteralExpression &&
          argument instanceof ArrayLiteralExpression
        ) {
          (<ArrayLiteralExpression>argument).merge(
            <ArrayLiteralExpression>patchArgument,
            patchOverrides,
          );
        } else if (patchOverrides) {
          this.setArguments(patchDecorator.getArguments());
        }
      });
    });
  }

  toString() {
    let result: String[] = [];
    result.push('@', this.getIdentifier());
    if (this.getIsCallExpression()) {
      result.push('(');
      if (this.args.length > 0) {
        this.args.forEach((argument) => {
          result.push(argument.toString());
          if (this.args.indexOf(argument) < this.args.length - 1) {
            result.push(', ');
          }
        });
      }
      result.push(')');
    }
    return result.join('');
  }
}

export default Decorator;
