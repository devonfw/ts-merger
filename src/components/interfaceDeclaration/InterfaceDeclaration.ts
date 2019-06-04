import { FileDeclaration } from "../general/FileDeclaration";
import { InterfaceProperty } from "./members/InterfaceProperty";
import { InterfaceMethod } from "./members/method/InterfaceMethod";
import { forEachComment } from "tsutils/util";
import * as ts from "typescript/lib/typescript";
/**
 * Defines the structure of interface objects
 *
 * @export
 * @interface InterfaceDeclaration
 */
export class InterfaceDeclaration extends FileDeclaration {
  private methods: InterfaceMethod[];
  private properties: InterfaceProperty[];
  private comments: string[];
  private index: string;

  constructor() {
    super();
    this.methods = [];
    this.properties = [];
    this.comments = [];
  }

  getIndex() {
    return this.index;
  }

  setIndex(index: string) {
    this.index = index;
  }

  addProperty(property: InterfaceProperty) {
    this.properties.push(property);
  }

  addProperties(properties: InterfaceProperty[]) {
    this.properties.forEach(property => {
      this.properties.push(property);
    });
  }

  getProperties() {
    return this.properties;
  }

  addMethod(method: InterfaceMethod) {
    this.methods.push(method);
  }

  addMethods(methods: InterfaceMethod[]) {
    this.methods.forEach(method => {
      this.methods.push(method);
    });
  }

  getMethods() {
    return this.methods;
  }

  setMethods(methods: InterfaceMethod[]) {
    this.methods = methods;
  }

  addComment(comment: string) {
    this.comments.push(comment);
  }

  getComments() {
    return this.comments;
  }

  setComments(comments: string[]) {
    this.comments = comments;
  }

  parseComments(fileInterface: ts.Node, sourceFile: ts.SourceFile) {
    // Now I need the position of the declared class
    let text: string = sourceFile.getFullText();
    let regex: string = "interface +(" + this.getIdentifier() + ")";

    let match = text.match(regex);

    if (match == null) return;

    let declarationPos: number = text.indexOf(match[0]);
    forEachComment(
      fileInterface,
      (sourceFile, comment) => {
        if (comment.end < declarationPos) {
          let commentText: string = sourceFile.substring(
            comment.pos,
            comment.end
          );
          this.comments.push(commentText);
        }
      },
      sourceFile
    );
  }

  toString(): String {
    let interfaceDeclaration: String[] = [];

    if (this.comments.length > 0) {
      this.comments.forEach(comment => {
        interfaceDeclaration.push(comment);
        interfaceDeclaration.push("\n");
      });
    }
    interfaceDeclaration.push("\n");

    super.getModifiers().forEach(modifier => {
      interfaceDeclaration.push(modifier, " ");
    });

    interfaceDeclaration.push("interface ", this.getIdentifier());
    super.getHeritages().forEach(heritage => {
      interfaceDeclaration.push(heritage);
    });
    interfaceDeclaration.push(" {\n");

    this.properties.forEach(property => {
      interfaceDeclaration.push(property.toString(), "\n");
    });
    if (this.methods.length > 0) {
      this.methods.forEach(method => {
        interfaceDeclaration.push(method.toString());
      });
    }

    if (this.index != null && this.index.length > 0) {
      interfaceDeclaration.push(this.index);
    }

    interfaceDeclaration.push("\n}\n");

    return interfaceDeclaration.join("");
  }
}

export default InterfaceDeclaration;
