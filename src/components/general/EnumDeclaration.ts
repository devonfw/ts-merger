import { GeneralInterface } from "./GeneralInterface";
import { ObjectLiteralExpression } from "./ObjectLiteralExpression";
import { EnumElement } from "./EnumElement";

export class EnumDeclaration {
  private name: String;
  private elements: any[];

  constructor() {
    this.name = "";
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

  merge(patchCallExpr: EnumDeclaration, patchOverrides) {
    if (patchOverrides) {
      this.setName(patchCallExpr.getName());
    }

    patchCallExpr.getElements().forEach(patchElement => {
      this.getElements().forEach(element => {
        if (
          patchElement instanceof ObjectLiteralExpression &&
          element instanceof ObjectLiteralExpression
        ) {
          (<ObjectLiteralExpression>element).merge(
            <ObjectLiteralExpression>patchElement,
            patchOverrides
          );
        } else if (patchOverrides) {
          this.setElements(patchCallExpr.getElements());
        }
      });
    });
  }

  toString() {
    let result: String[] = [];

    result.push("enum ", this.getName(), "{");
    this.elements.forEach(argument => {
      result.push(argument.toString());
    });
    result.push("}");
    return result.join("");
  }
}
