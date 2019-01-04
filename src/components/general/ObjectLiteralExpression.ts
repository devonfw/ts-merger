import { PropertyAssignment } from './PropertyAssignment';
import { GeneralInterface } from './GeneralInterface';

export class ObjectLiteralExpression {
  private properties: PropertyAssignment[];

  constructor() {
    this.properties = [];
  }

  setProperties(properties: PropertyAssignment[]) {
    this.properties = properties;
  }

  getProperties() {
    return this.properties;
  }

  addProperty(property: PropertyAssignment) {
    this.properties.push(property);
  }

  merge(patchObjectLiteral: ObjectLiteralExpression, patchOverrides: boolean) {
    let exists: boolean;

    patchObjectLiteral.getProperties().forEach((patchProperty) => {
      exists = false;
      this.getProperties().forEach((property) => {
        if (property.getIdentifier() === patchProperty.getIdentifier()) {
          property.merge(patchProperty, patchOverrides);
          exists = true;
        }
      });
      if (!exists) {
        this.addProperty(patchProperty);
      }
    });
  }

  toString() {
    let result: String[] = [];
    this.getProperties().forEach((property) => {
      result.push(property.toString());
      if (
        this.getProperties().indexOf(property) <
        this.getProperties().length - 1
      ) {
        result.push(',\n');
      } else {
        result.push('\n');
      }
    });
    return '{\n' + result.join('') + '}';
  }
}
