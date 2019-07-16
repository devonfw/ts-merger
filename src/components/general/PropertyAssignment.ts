import { CallExpression } from './CallExpression';
import { ArrayLiteralExpression } from './ArrayLiteralExpression';
import { ObjectLiteralExpression } from './ObjectLiteralExpression';
import { GeneralInterface } from './GeneralInterface';

export class PropertyAssignment extends GeneralInterface {
  private general: any;

  constructor() {
    super();
  }

  setGeneral(general) {
    this.general = general;
  }

  getGeneral() {
    return this.general;
  }

  merge(patchProperty: PropertyAssignment, patchOverrides: boolean) {
    if (
      patchProperty.getGeneral() instanceof ObjectLiteralExpression &&
      this.getGeneral() instanceof ObjectLiteralExpression
    ) {
      (<ObjectLiteralExpression>this.getGeneral()).merge(
        <ObjectLiteralExpression>patchProperty.getGeneral(),
        patchOverrides,
      );
    } else if (
      patchProperty.getGeneral() instanceof ArrayLiteralExpression &&
      this.getGeneral() instanceof ArrayLiteralExpression
    ) {
      (<ArrayLiteralExpression>this.getGeneral()).merge(
        <ArrayLiteralExpression>patchProperty.getGeneral(),
        patchOverrides,
      );
    } else if (
      patchProperty.getGeneral() instanceof CallExpression &&
      this.getGeneral() instanceof CallExpression
    ) {
      (<CallExpression>this.getGeneral()).merge(
        <CallExpression>patchProperty.getGeneral(),
        patchOverrides,
      );
    } else if (patchOverrides) {
      this.setGeneral(patchProperty.getGeneral());
    }
  }

  toString() {
    let general = "";
    if (this.getGeneral()) {
      general = ': ' + this.getGeneral().toString();
    }
    return this.getIdentifier() + general;
  }
}

export default PropertyAssignment;
