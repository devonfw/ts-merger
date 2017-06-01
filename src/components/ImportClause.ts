
/**
 *Defines and import clause structure 
 * 
 * @export
 * @class ImportClause
 */
export class ImportClause{
    private module: String = "";
    private named: String[] = [];
    private nameSpace: String = "";
    private spaceBinding = true;

    addNamed(named: String){
        this.named.push(named);
    }

    setModule(module: String){
        this.module = module;
    }

    setNamespace(nameSpace: String){
        this.nameSpace = nameSpace;
    }

    hasNamed(named: String): boolean{
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
            }else {
                clause.push("* as ", this.nameSpace, " from '", this.module, "';\n");
            }
        }
        
        return clause.join("");
    }
}

export default ImportClause;