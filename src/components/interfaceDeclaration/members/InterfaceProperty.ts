export class InterfaceProperty {
  id: string;
  text: string;

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getText(): string {
    return this.text;
  }

  setText(text: string) {
    this.text = text;
  }

  toString(): String {
    let result: String[] = [];

    if (this.text.length > 0) {
      result.push(this.text);
    }
    if (result[0].indexOf(';') >= 0) {
      result.push('\n');
    } else {
      result.push(';\n');
    }

    return result.join('');
  }
}

export default InterfaceProperty;
