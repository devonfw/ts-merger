import { GeneralInterface } from "./GeneralInterface";

export class EnumElement {
  private initializer: String;
  private name: String;

  constructor() {
    this.initializer = "";
    this.name = "";
  }

  setInitializer(initializer: String) {
    this.initializer = initializer;
  }

  getInitializer() {
    return this.initializer;
  }

  getName() {
    return this.name;
  }

  setName(type: String) {
    this.name = type;
  }

  getType() {
    return this.name;
  }

  toString() {
    let result: String = "";
    result = this.getName() + " = " + this.getInitializer() + ", ";
    return result;
  }
}

export default GeneralInterface;
