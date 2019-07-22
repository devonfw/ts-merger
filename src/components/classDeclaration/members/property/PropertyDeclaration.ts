import { CallExpression } from '../../../general/CallExpression';
import { ArrayLiteralExpression } from '../../../general/ArrayLiteralExpression';
import { ObjectLiteralExpression } from '../../../general/ObjectLiteralExpression';
import { Decorator } from '../../../decorator/Decorator';
import { GeneralInterface } from '../../../general/GeneralInterface';
import * as mergeTools from '../../../../tools/MergerTools';

export class PropertyDeclaration extends GeneralInterface {
  private modifiers: String[];
  private decorators: Decorator[];
  private initializer: any;
  private isOptional: boolean;

  constructor() {
    super();
    this.modifiers = [];
    this.decorators = [];
    this.isOptional = false;
  }

  addDecorator(decorator: Decorator) {
    this.decorators.push(decorator);
  }

  addDecorators(decorators: Decorator[]) {
    decorators.forEach((decorator) => {
      this.decorators.push(decorator);
    });
  }

  getDecorators() {
    return this.decorators;
  }

  setDecorators(decorators: Decorator[]) {
    this.decorators = decorators;
  }

  addModifier(modifier: String) {
    this.modifiers.push(modifier);
  }

  addModifiers(modifiers: String[]) {
    modifiers.forEach((modifier) => {
      this.modifiers.push(modifier);
    });
  }

  getModifiers() {
    return this.modifiers;
  }

  setModifiers(modifiers: String[]) {
    this.modifiers = modifiers;
  }

  setInitializer(initializer: any) {
    this.initializer = initializer;
  }

  getInitializer() {
    return this.initializer;
  }

  setIsOptional(isOptional: boolean) {
    this.isOptional = isOptional;
  }

  getIsOptional() {
    return this.isOptional;
  }

  merge(patchProperty: PropertyDeclaration, patchOverrides: boolean) {
    if (patchOverrides) {
      this.setType(patchProperty.getType());
      this.setModifiers(patchProperty.getModifiers());
      this.isOptional = patchProperty.getIsOptional();
    }

    mergeTools.mergeDecorators(
      this.getDecorators(),
      patchProperty.getDecorators(),
      patchOverrides,
    );

    if (
      this.getInitializer() instanceof ObjectLiteralExpression &&
      patchProperty.getInitializer() instanceof ObjectLiteralExpression
    ) {
      (<ObjectLiteralExpression>this.getInitializer()).merge(
        <ObjectLiteralExpression>patchProperty.getInitializer(),
        patchOverrides,
      );
    } else if (
      this.getInitializer() instanceof ArrayLiteralExpression &&
      patchProperty.getInitializer() instanceof ArrayLiteralExpression
    ) {
      (<ArrayLiteralExpression>this.getInitializer()).merge(
        <ArrayLiteralExpression>patchProperty.getInitializer(),
        patchOverrides,
      );
    } else if (
      this.getInitializer() instanceof CallExpression &&
      patchProperty.getInitializer() instanceof CallExpression
    ) {
      (<CallExpression>this.getInitializer()).merge(
        <CallExpression>patchProperty.getInitializer(),
        patchOverrides,
      );
    } else if (patchOverrides) {
      this.setInitializer(patchProperty.getInitializer());
    }
  }

  toString() {
    let result: String[] = [];

    this.decorators.forEach((decorator) => {
      result.push(decorator.toString());
    });
    this.modifiers.forEach((modifier) => {
      result.push(modifier, ' ');
    });
    result.push(this.getIdentifier());

    if (this.isOptional) {
      result.push('?');
    }

    if (this.getType() != '') {
      result.push(': ', this.getType());
    }
    if (this.initializer) {
      result.push(' = ', this.initializer.toString());
    }
    result.push(';\n');

    return result.join('');
  }
}

export default PropertyDeclaration;
