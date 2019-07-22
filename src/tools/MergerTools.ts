import { FunctionDeclaration } from '../components/general/FunctionDeclaration';
import { VariableStatement } from '../components/general/VariableStatement';
import { Decorator } from '../components/decorator/Decorator';
import { Constructor } from '../components/classDeclaration/members/constructor/Constructor';
import { PropertyDeclaration } from '../components/classDeclaration/members/property/PropertyDeclaration';
import { Method } from '../components/classDeclaration/members/method/Method';
import { ClassDeclaration } from '../components/classDeclaration/ClassDeclaration';
import { InterfaceDeclaration } from '../components/interfaceDeclaration/InterfaceDeclaration';
import { InterfaceMethod } from '../components/interfaceDeclaration/members/method/InterfaceMethod';
import { TSFile } from '../components/TSFile';
import { InterfaceProperty } from '../components/interfaceDeclaration/members/InterfaceProperty';

export function mergeImports(baseFile: TSFile, patchFile: TSFile) {
  let exists: boolean;

  if (baseFile.getImports().length === 0) {
    patchFile.getImports().forEach((patchImportClause) => {
      baseFile.addImport(patchImportClause);
    });
  } else {
    patchFile.getImports().forEach((patchImportClause) => {
      exists = false;
      baseFile.getImports().forEach((importClause) => {
        if (importClause.getModule() === patchImportClause.getModule()) {
          importClause.merge(patchImportClause);
          exists = true;
        }
      });
      if (!exists) {
        baseFile.addImport(patchImportClause);
      }
    });
  }
}

export function mergeExports(baseFile: TSFile, patchFile: TSFile) {
  let exists: boolean;

  if (baseFile.getExports().length === 0) {
    patchFile.getExports().forEach((patchExportClause) => {
      baseFile.addExport(patchExportClause);
    });
  } else {
    patchFile.getExports().forEach((patchExportClause) => {
      exists = false;
      baseFile.getExports().forEach((importClause) => {
        if (importClause.getModule() === patchExportClause.getModule()) {
          importClause.merge(patchExportClause);
          exists = true;
        }
      });
      if (!exists) {
        baseFile.addExport(patchExportClause);
      }
    });
  }
}

export function mergeExpressions(
  baseFile: TSFile,
  patchFile: TSFile,
  patchOverrides,
) {
  let exists: boolean;

  if (baseFile.getExpressions().length === 0) {
    patchFile.getExpressions().forEach((patchExpressionStatement) => {
      baseFile.addExpression(patchExpressionStatement);
    });
  } else {
    patchFile.getExpressions().forEach((patchExpressionStatement) => {
      exists = false;
      baseFile.getExpressions().forEach((expressionStatement) => {
        if (
          expressionStatement.getName() === patchExpressionStatement.getName()
        ) {
          expressionStatement.merge(patchExpressionStatement, patchOverrides);
          exists = true;
        }
      });
      if (!exists) {
        baseFile.addExpression(patchExpressionStatement);
      }
    });
  }
}

export function mergeClass(
  baseClass: ClassDeclaration,
  patchClass: ClassDeclaration,
  patchOverrides: boolean,
) {
  let exists: boolean;

  if (patchOverrides) {
    baseClass.setHeritages(patchClass.getHeritages());
  }

  mergeHeritages(
    baseClass.getHeritages(),
    patchClass.getHeritages(),
    patchOverrides,
  );

  mergeComments(
    baseClass.getComments(),
    patchClass.getComments(),
    patchOverrides,
  );

  mergeDecorators(
    baseClass.getDecorators(),
    patchClass.getDecorators(),
    patchOverrides,
  );
  mergeProperties(
    baseClass.getProperties(),
    patchClass.getProperties(),
    patchOverrides,
  );
  mergeConstructor(
    baseClass.getConstructor(),
    patchClass.getConstructor(),
    patchOverrides,
  );
  mergeMethods(baseClass.getMethods(), patchClass.getMethods(), patchOverrides);
}

export function mergeInterface(
  baseInterface: InterfaceDeclaration,
  patchInterface: InterfaceDeclaration,
  patchOverrides: boolean,
) {
  let exists: boolean;

  if (patchOverrides) {
    baseInterface.setModifiers(patchInterface.getModifiers());
  }
  mergeHeritages(
    baseInterface.getHeritages(),
    patchInterface.getHeritages(),
    patchOverrides,
  );

  mergeComments(
    baseInterface.getComments(),
    patchInterface.getComments(),
    patchOverrides,
  );

  mergeInterfaceProperties(
    baseInterface.getProperties(),
    patchInterface.getProperties(),
    patchOverrides,
  );
  mergeInterfaceMethods(
    baseInterface.getMethods(),
    patchInterface.getMethods(),
    patchOverrides,
  );
  baseInterface.setIndex(
    mergeIndexSignature(
      baseInterface.getIndex(),
      patchInterface.getIndex(),
      patchOverrides,
    ),
  );
}

export function mergeDecorators(
  baseDecorators: Decorator[],
  patchDecorators: Decorator[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  patchDecorators.forEach((patchDecorator) => {
    exists = false;
    baseDecorators.forEach((decorator) => {
      if (patchDecorator.getIdentifier() === decorator.getIdentifier()) {
        exists = true;
        decorator.merge(patchDecorator, patchOverrides);
      }
    });
    if (!exists) {
      baseDecorators.push(patchDecorator);
    }
  });
}
export function mergeVariableProperties(
  baseVariableProperties: String[],
  patchVariableProperties: String[],
  patchOverrides: boolean
) {
  if (patchOverrides) {
    return patchVariableProperties;
  }

  patchVariableProperties.forEach(property => {
    if (baseVariableProperties.indexOf(property) == -1) {
      baseVariableProperties.push(property);
    }
  });
}

export function mergeProperties(
  baseProperties: PropertyDeclaration[],
  patchProperties: PropertyDeclaration[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  patchProperties.forEach((patchProperty) => {
    exists = false;
    baseProperties.forEach((property) => {
      if (patchProperty.getIdentifier() === property.getIdentifier()) {
        exists = true;
        property.merge(patchProperty, patchOverrides);
      }
    });
    if (!exists) {
      baseProperties.push(patchProperty);
    }
  });
}

export function mergeConstructor(
  baseConstructor: Constructor,
  patchConstructor: Constructor,
  patchOverrides: boolean,
) {
  mergeMethod(baseConstructor, patchConstructor, patchOverrides);
}

export function mergeMethods(
  baseMethods: Method[],
  patchMethods: Method[],
  patchOverrides,
) {
  let exists: boolean;

  patchMethods.forEach((patchMethod) => {
    exists = false;
    baseMethods.forEach((method) => {
      if (patchMethod.getIdentifier() === method.getIdentifier()) {
        exists = true;
        mergeMethod(method, patchMethod, patchOverrides);
      }
    });
    if (!exists) {
      baseMethods.push(patchMethod);
    }
  });
}

export function mergeIndexSignature(
  baseIndex: string,
  patchIndex: string,
  patchOverrides: boolean,
): string {
  if (patchOverrides) {
    baseIndex = patchIndex;
  }
  return baseIndex;
}

export function mergeHeritages(
  baseHeritages: String[],
  patchHeritages: String[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  if (patchHeritages.length > 0) {
    // If there is no extension on base, let's add it directly
    if (baseHeritages.length <= 0) {
      baseHeritages[0] = patchHeritages[0];
    } else {
      // Currently we only support to either merge extensions or implements
      let patchHeritage: String = patchHeritages[0];
      let baseHeritage: String = baseHeritages[0];
      // We get the string "extends" or "implements"
      let inheritanceValue: String = baseHeritage.match(/\s*([\w\-]+)/)[0];

      // We only need the interfaces names: extends a,b,c (let's remove "extends")
      patchHeritage = patchHeritage.trim().replace(/\s*([\w\-]+)/, '');
      baseHeritage = baseHeritage.trim().replace(/\s*([\w\-]+)/, '');
      // split by comma to get the different interfaces
      let patchHeritageNames: String[] = patchHeritage.split(',');
      let baseHeritageNames: String[] = baseHeritage.split(',');

      patchHeritageNames.forEach((patchHeritageName) => {
        exists = false;
        baseHeritageNames.forEach((baseHeritageName) => {
          if (baseHeritageName === patchHeritageName) {
            exists = true;
            if (patchOverrides) {
              baseHeritageName = patchHeritageName;
            }
          }
        });
        if (!exists) {
          baseHeritageNames.push(patchHeritageName);
        }
      });

      baseHeritages[0] = inheritanceValue + ' ' + baseHeritageNames.join(',');
    }
  }
}

export function mergeComments(
  baseComments: string[],
  patchComments: string[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  patchComments.forEach((patchComment, index) => {
    let isNotRemoved: boolean = true;
    baseComments.forEach((baseComment) => {
      if (patchOverrides) {
        if (isNotRemoved) {
          baseComments.splice(index, 1, patchComment);
          isNotRemoved = false;
        }
      }
    });
  });
}

export function mergeInterfaceProperties(
  baseProperties: InterfaceProperty[],
  patchProperties: InterfaceProperty[],
  patchOverrides: boolean,
) {
  let exists: boolean;

  patchProperties.forEach((patchProperty) => {
    exists = false;
    baseProperties.forEach((property) => {
      if (patchProperty.id === property.id) {
        exists = true;
        if (patchOverrides) {
          property.text = patchProperty.text;
        }
      }
    });
    if (!exists) {
      baseProperties.push(patchProperty);
    }
  });
}

export function mergeInterfaceMethods(
  baseMethods: InterfaceMethod[],
  patchMethods: InterfaceMethod[],
  patchOverrides,
) {
  let exists: boolean;

  patchMethods.forEach((patchMethod) => {
    exists = false;
    baseMethods.forEach((method) => {
      if (patchMethod.getIdentifier() === method.getIdentifier()) {
        exists = true;
        mergeInterfaceMethod(method, patchMethod, patchOverrides);
      }
    });
    if (!exists) {
      baseMethods.push(patchMethod);
    }
  });
}

export function mergeMethod(
  baseMethod: Method,
  patchMethod: Method,
  patchOverrides: boolean,
) {
  baseMethod.merge(patchMethod, patchOverrides);
}

export function mergeInterfaceMethod(
  baseMethod: InterfaceMethod,
  patchMethod: InterfaceMethod,
  patchOverrides: boolean,
) {
  baseMethod.merge(patchMethod, patchOverrides);
}

export function mergeVariables(
  baseFile: TSFile,
  patchFile: TSFile,
  patchOverrides: boolean,
) {
  let exists: boolean;
  patchFile.getVariables().forEach((patchVariable) => {
    exists = false;
    baseFile.getVariables().forEach((variable) => {
      if (patchVariable.getIdentifier() === variable.getIdentifier()) {
        exists = true;
        variable.merge(patchVariable, patchOverrides);
      }
    });
    if (!exists) {
      baseFile.addVariable(patchVariable);
    }
  });
}

export function mergeFunctions(
  baseFunctions: FunctionDeclaration[],
  patchFunctions: FunctionDeclaration[],
  patchOverrides,
) {
  let exists: boolean;

  patchFunctions.forEach((patchFunction) => {
    exists = false;
    baseFunctions.forEach((func) => {
      if (patchFunction.getIdentifier() === func.getIdentifier()) {
        exists = true;
        mergeFunction(func, patchFunction, patchOverrides);
      }
    });
    if (!exists) {
      baseFunctions.push(patchFunction);
    }
  });
}

export function mergeFunction(
  baseFunction: FunctionDeclaration,
  patchFunction: FunctionDeclaration,
  patchOverrides: boolean,
) {
  baseFunction.merge(patchFunction, patchOverrides);
}
