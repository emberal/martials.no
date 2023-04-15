/**
 * Replaces the operators in the expression with the ones used by the backend
 * @param expression The expression to replace the operators in
 * @returns The expression with the replaced operators
 */
export function replaceOperators(expression: string): string {

    expression = expression.replaceAll(/\//g, "|");
    expression = expression.replaceAll(/¬/g, "!");
    expression = expression.replaceAll(/\sOR\s/gi, " | ");
    expression = expression.replaceAll(/\sAND\s/gi, " & ");
    expression = expression.replaceAll(/\s(IMPLICATION|IMP)\s/gi, " -> ");
    expression = expression.replaceAll(/\sNOT\s/gi, " !");

    return expression;
}
