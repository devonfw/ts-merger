
/**
 *Defines and import clause structure 
 * 
 * @export
 * @class ImportClause
 */
export class ImportDeclaration {
    private clause: String = "";
    private module: String = "";
    private named: String[] = [];
    private nameSpace: String = "";
    private spaceBinding: boolean = true;

    addNamed(named: String){
        this.named.push(named);
    }

    setModule(module: String){
        this.module = module;
    }

    getClause() {
        return this.clause;
    }

    setClause(clause: String) {
        this.clause = clause;
    }

    setNamespace(nameSpace: String){
        this.nameSpace = nameSpace;
    }

    contains(named: String): boolean{
        if(this.named.indexOf(named) >= 0){
            return true;
        }else{
            return false;
        }
    }

    setSpaceBinding(flag: boolean){
        this.spaceBinding = flag;
    }

    getNameSpace(): String{
        return this.nameSpace;
    }

    getNamed(): String[]{
        return this.named;
    }

    getModule(): String{
        return this.module;
    }

    merge(patchImportDeclaration: ImportDeclaration) {
        if(this.getModule() === patchImportDeclaration.getModule()) {
            if (patchImportDeclaration.getNamed().length > 0 && this.getClause() != "") {
                this.addNamed(this.getClause());
                this.setClause("");
                patchImportDeclaration.getNamed().forEach(named => {
                    if(!this.contains(named)) {                     
                        this.addNamed(named);
                    }
                })
            } else if(patchImportDeclaration.getClause() != "" && this.getNamed().length > 0) {
                if (!this.contains(patchImportDeclaration.getClause())) {
                    this.addNamed(patchImportDeclaration.getClause());
                }
            } else if(patchImportDeclaration.getClause() != "" && this.getClause() != "") {
                this.addNamed(this.getClause());
                this.addNamed(patchImportDeclaration.getClause());
                this.setClause("");
            } else if(patchImportDeclaration.getNamed().length > 0 && this.getNamed().length > 0) {
                patchImportDeclaration.getNamed().forEach(named => {
                    if(!this.contains(named)) {
                        this.addNamed(named);
                    }
                })
            }
        }
    }

    toString(): String{
        let clause: String[] = [];
        if(!this.spaceBinding){
            clause.push("import '", this.module, "';\n");
        }else{
            clause.push("import ");
            if(this.named.length != 0){
                clause.push("{ ");
                this.named.forEach(name => {
                    clause.push(name);
                    if(this.named.indexOf(name) < this.named.length - 1){
                        clause.push(", ");
                    }
                })
                clause.push(" } from '", this.module, "';\n");
            }else if(this.nameSpace != "") {
                clause.push("* as ", this.nameSpace, " from '", this.module, "';\n");
            } else {
                clause.push(this.clause, " from '", this.module, "';\n");
            }
        }
        return clause.join("");
    }
}

export default ImportDeclaration;