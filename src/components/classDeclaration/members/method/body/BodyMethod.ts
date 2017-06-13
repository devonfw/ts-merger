import { VariableStatement } from '../../../../general/VariableStatement';


export class BodyMethod {
    private statements: any[] = [];

    addStatement(statement: any) {
        this.statements.push(statement);
    }

    getStatements() {
        return this.statements;
    }

    setStatements(statements: any[]) {
        this.statements = statements;
    }

    merge(patchBody: BodyMethod, patchOverrides: boolean) {

        patchBody.getStatements().forEach(patchStatement => {
            this.getStatements().forEach(statement => {
                if(patchStatement instanceof VariableStatement && statement instanceof VariableStatement){
                    if((<VariableStatement>patchStatement).getIdentifier() === (<VariableStatement>statement).getIdentifier()) {
                        (<VariableStatement>statement).merge(<VariableStatement>patchStatement, patchOverrides);
                    }
                }
            })
            
        })
    }

    toString() {
        let result: String[] = [];
        result.push("{ \n");
        this.statements.forEach(statement => {
            result.push(statement.toString());
        })
        result.push("\n}");
        return result.join("");
    }
}

export default BodyMethod;