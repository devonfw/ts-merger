export class GeneralInterface {
  private identifier: any;
  private type: String;

  constructor() {
    this.identifier = '';
    this.type = '';
  }

  setIdentifier(identifier: any) {
    this.identifier = identifier;
  }

  getIdentifier() {
    return this.identifier;
  }

  setType(type: String) {
    this.type = type;
  }

  getType() {
    return this.type;
  }

  toString() {
    return this.getIdentifier();
  }
}

export default GeneralInterface;
