import { PropertyAssignment } from './PropertyAssignment';
import { CallExpression } from './CallExpression';
import { ObjectLiteralExpression } from './ObjectLiteralExpression';
import { GeneralInterface } from './GeneralInterface';

export class ArrayLiteralExpression {
  private elements: any[];

  constructor() {
    this.elements = [];
  }

  addElement(element: any) {
    this.elements.push(element);
  }

  getElements() {
    return this.elements;
  }

  setElements(elements: any[]) {
    this.elements = elements;
  }

  merge(patchArray: ArrayLiteralExpression, patchOverrides: boolean) {
    let exists: boolean;
    patchArray.getElements().forEach((patchElement) => {
      exists = false;
      this.getElements().forEach((element) => {
        if (patchElement.toString() === element.toString()) {
          exists = true;
        }
        // else if(patchElement instanceof ObjectLiteralExpression && element instanceof ObjectLiteralExpression) {
        //     (<ObjectLiteralExpression>element).merge(<ObjectLiteralExpression>patchElement, patchOverrides);
        // }
      });
      if (!exists) {
        this.addElement(patchElement);
      }
    });
  }

  toString() {
    let result: String[] = [];
    result.push('[\n');

    this.getElements().forEach((element) => {
      if (this.elements.indexOf(element) < this.elements.length - 1) {
        result.push(element.toString(), ',\n');
      } else {
        result.push(element.toString(), '\n');
      }
    });
    result.push(']');
    return result.join('');
  }
}

export default ArrayLiteralExpression;
