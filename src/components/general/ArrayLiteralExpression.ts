import { PropertyAssignment } from './PropertyAssignment';
import { CallExpression } from './CallExpression';
import { ObjectLiteralExpression } from './ObjectLiteralExpression';
import { GeneralInterface } from './GeneralInterface';
import { SyntaxKind } from 'typescript';
import { EnumDeclaration } from './EnumDeclaration';
import { ExpressionDeclaration } from './ExpressionDeclaration';
import { VariableStatement } from './VariableStatement';

export class ArrayLiteralExpression {
  private elements: any[];
  readonly kind: number = SyntaxKind.ArrayLiteralExpression;

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
        else {
          // check whether element has the kind property
          if ((element.kind) && (patchElement.kind)) {
            // check whether both elements have the same kind
            let sameType = patchElement.kind == element.kind;
            if (sameType) {
              let kind = element.kind;
              switch (kind) {
                case SyntaxKind.CallExpression:
                  if (patchElement.getName() == element.getName()) {
                    (<CallExpression>element).merge(<CallExpression>patchElement, patchOverrides);
                    exists = true;
                  }
                  break;
                case SyntaxKind.EnumDeclaration:
                  if (patchElement.getName() == element.getName()) {
                    (<EnumDeclaration>element).merge(<EnumDeclaration>element, <EnumDeclaration>patchElement, patchOverrides);
                    exists = true;
                  }
                  break;
                case SyntaxKind.ExpressionStatement:
                  if (patchElement.getName() == element.getName()) {
                    (<ExpressionDeclaration>element).merge(<ExpressionDeclaration>patchElement, patchOverrides);
                    exists = true;
                  }
                  break;

                case SyntaxKind.PropertyAssignment:
                  if (patchElement.getIdentifier() == element.getIdentifier()) {
                    (<PropertyAssignment>element).merge(<PropertyAssignment>patchElement, patchOverrides);
                    exists = true;
                  }
                  break;
                case SyntaxKind.VariableStatement:
                  if (patchElement.getIdentifier() == element.getIdentifier()) {
                    (<VariableStatement>element).merge(<VariableStatement>patchElement, patchOverrides);
                    exists = true;
                  }
                  break;
                default:
                  break;
              }
            }
          }
        }
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