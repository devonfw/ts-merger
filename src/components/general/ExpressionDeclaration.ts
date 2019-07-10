import { GeneralInterface } from '../general/GeneralInterface';
import ExportDeclaration from '../export/ExportDeclaration';
import { BodyMethod } from '../classDeclaration/members/method/body/BodyMethod';
import { createPartiallyEmittedExpression } from 'typescript';
import { ObjectLiteralExpression } from './ObjectLiteralExpression';

/**
 * Defines the structure of script functions
 *
 * @export
 * @class ExpressionDeclaration
 */
export class ExpressionDeclaration extends GeneralInterface {
  private arguments: any[];
  private name: string;

  constructor() {
    super();
    this.arguments = [];
  }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  addArgument(argument: any) {
    this.arguments.push(argument);
  }

  addArguments(argumentsArray: any[]) {
    argumentsArray.forEach((argument) => {
      this.arguments.push(argument);
    });
  }

  getArguments() {
    return this.arguments;
  }

  setArguments(argumentsArray: any[]) {
    this.arguments = argumentsArray;
  }

  merge(patchExpression: ExpressionDeclaration, patchOverrides: boolean) {
    let argumentExists: boolean;

    patchExpression.getArguments().forEach((patchArgument) => {
      argumentExists = false;
      this.getArguments().forEach((argument) => {
        if (this.areBodyMethodInstances(argument, patchArgument)) {
          argument.merge(patchArgument, patchOverrides);
          argumentExists = true;
        } else if (this.areObjectLiteralInstances(argument, patchArgument)) {
          (<ObjectLiteralExpression>argument).merge(
            <ObjectLiteralExpression>patchArgument,
            patchOverrides,
          );
          argumentExists = true;
        } else if (patchArgument === argument) {
          argumentExists = true;
        }
      });
      if (!argumentExists) {
        this.addArgument(patchArgument);
      }
    });
  }

  private areObjectLiteralInstances(argument: any, patchArgument: any) {
    return (
      argument instanceof ObjectLiteralExpression &&
      patchArgument instanceof ObjectLiteralExpression
    );
  }

  private areBodyMethodInstances(argument: any, patchArgument: any) {
    return (
      argument instanceof BodyMethod && patchArgument instanceof BodyMethod
    );
  }

  toString() {
    let result: String[] = [];

    result.push(this.name, '.(');
    this.getArguments().forEach((arg) => {
      result.push(arg.toString(), ', ');
    });
    result.push(');');

    return result.join('');
  }
}

export default ExportDeclaration;
