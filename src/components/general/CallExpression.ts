import { ObjectLiteralExpression } from './ObjectLiteralExpression';
import { GeneralInterface } from './GeneralInterface';

export class CallExpression extends GeneralInterface {
  private name: String;
  private arguments: any[];

  constructor() {
    super();
    this.name = '';
    this.arguments = [];
  }

  setName(name: String) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  addArgument(argument: any) {
    this.arguments.push(argument);
  }

  getArguments() {
    return this.arguments;
  }

  setArguments(args: any[]) {
    this.arguments = args;
  }

  merge(patchCallExpr: CallExpression, patchOverrides) {
    if (patchOverrides) {
      this.setName(patchCallExpr.getName());
    }

    patchCallExpr.getArguments().forEach((patchArgument) => {
      this.getArguments().forEach((argument) => {
        if (
          patchArgument instanceof ObjectLiteralExpression &&
          argument instanceof ObjectLiteralExpression
        ) {
          (<ObjectLiteralExpression>argument).merge(
            <ObjectLiteralExpression>patchArgument,
            patchOverrides,
          );
        } else if (patchOverrides) {
          this.setArguments(patchCallExpr.getArguments());
        }
      });
    });
  }

  toString() {
    let result: String[] = [];

    result.push(this.getIdentifier(), '.', this.getName(), '(');
    this.arguments.forEach((argument) => {
      result.push(argument.toString());
      if (
        this.getArguments().indexOf(argument) <
        this.getArguments().length - 1
      ) {
        result.push(',');
      }
    });
    result.push(')');
    return result.join('');
  }
}
