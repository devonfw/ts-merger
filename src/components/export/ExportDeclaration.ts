/**
 *Defines and export clause structure
 *
 * @export
 * @class exportClause
 */
export class ExportDeclaration {
  private clause: String = '';
  private module: String = '';
  private named: String[] = [];
  private nameSpace: String = '';
  private spaceBinding: boolean = true;

  addNamed(named: String) {
    this.named.push(named);
  }

  setModule(module: String) {
    this.module = module;
  }

  getClause() {
    return this.clause;
  }

  setClause(clause: String) {
    this.clause = clause;
  }

  setNamespace(nameSpace: String) {
    this.nameSpace = nameSpace;
  }

  contains(named: String): boolean {
    if (this.named.indexOf(named) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  setSpaceBinding(flag: boolean) {
    this.spaceBinding = flag;
  }

  getNameSpace(): String {
    return this.nameSpace;
  }

  getNamed(): String[] {
    return this.named;
  }

  getModule(): String {
    return this.module;
  }

  merge(patchExportDeclaration: ExportDeclaration) {
    if (this.getModule() === patchExportDeclaration.getModule()) {
      if (
        patchExportDeclaration.getNamed().length > 0 &&
        this.getClause() != ''
      ) {
        this.addNamed(this.getClause());
        this.setClause('');
        patchExportDeclaration.getNamed().forEach((named) => {
          if (!this.contains(named)) {
            this.addNamed(named);
          }
        });
      } else if (
        patchExportDeclaration.getClause() != '' &&
        this.getNamed().length > 0
      ) {
        if (!this.contains(patchExportDeclaration.getClause())) {
          this.addNamed(patchExportDeclaration.getClause());
        }
      } else if (
        patchExportDeclaration.getClause() != '' &&
        this.getClause() != ''
      ) {
        this.addNamed(this.getClause());
        this.addNamed(patchExportDeclaration.getClause());
        this.setClause('');
      } else if (
        patchExportDeclaration.getNamed().length > 0 &&
        this.getNamed().length > 0
      ) {
        patchExportDeclaration.getNamed().forEach((named) => {
          if (!this.contains(named)) {
            this.addNamed(named);
          }
        });
      }
    }
  }

  toString(): String {
    let clause: String[] = [];
    if (!this.spaceBinding) {
      clause.push("export '", this.module, "';\n");
    } else {
      clause.push('export ');
      if (this.named.length != 0) {
        clause.push('{ ');
        this.named.forEach((name) => {
          clause.push(name);
          if (this.named.indexOf(name) < this.named.length - 1) {
            clause.push(', ');
          }
        });
        clause.push(" } from '", this.module, "';\n");
      } else if (this.nameSpace != '') {
        clause.push('* as ', this.nameSpace, " from '", this.module, "';\n");
      } else {
        clause.push(this.clause, " from '", this.module, "';\n");
      }
    }
    return clause.join('');
  }
}

export default ExportDeclaration;
