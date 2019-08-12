export class GeneralInterface {
  private identifier: any;
  private type: any;

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

  setType(type: any) {
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
