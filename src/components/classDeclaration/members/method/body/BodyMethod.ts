import { VariableStatement } from '../../../../general/VariableStatement';
import { ExpressionDeclaration } from '../../../../general/ExpressionDeclaration';

export class BodyMethod {
  private statements: any[];
  private isArrowFunction: boolean;

  constructor() {
    this.statements = [];
    this.isArrowFunction = false;
  }

  addStatement(statement: any) {
    this.statements.push(statement);
  }

  getStatements() {
    return this.statements;
  }

  setStatements(statements: any[]) {
    this.statements = statements;
  }

  setIsArrowFunction(isArrowFunction: boolean) {
    this.isArrowFunction = isArrowFunction;
  }

  getIsArrowFunction() {
    return this.isArrowFunction;
  }

  merge(patchBody: BodyMethod, patchOverrides: boolean) {
    patchBody.getStatements().forEach((patchStatement) => {
      this.getStatements().forEach((statement) => {
        if (
          patchStatement instanceof VariableStatement &&
          statement instanceof VariableStatement
        ) {
          if (
            (<VariableStatement>patchStatement).getIdentifier() ===
            (<VariableStatement>statement).getIdentifier()
          ) {
            (<VariableStatement>statement).merge(
              <VariableStatement>patchStatement,
              patchOverrides,
            );
          }
        } else if (
          patchStatement instanceof ExpressionDeclaration &&
          statement instanceof ExpressionDeclaration
        ) {
          if (statement.getName() === patchStatement.getName()) {
            statement.merge(patchStatement, patchOverrides);
          }
        }
      });
    });
  }

  toString() {
    let result: String[] = [];

    if (this.isArrowFunction) {
      result.push('() => ');
    }
    result.push('{ \n');
    this.statements.forEach((statement) => {
      result.push(statement.toString());
    });
    result.push('\n}');
    return result.join('');
  }
}

export default BodyMethod;
