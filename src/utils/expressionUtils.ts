/**
 * Replaces the operators in the expression with the ones used by the backend
 * @param expression The expression to replace the operators in
 * @returns The expression with the replaced operators
 */
export function replaceOperators(expression: string): string {
  return expression
    .replaceAll(/\//g, "|")
    .replaceAll(/¬/g, "!")
    .replaceAll(/\s(OR|⋁)\s/gi, " | ")
    .replaceAll(/\s(AND|⋀)\s/gi, " & ")
    .replaceAll(/\s(IMPLICATION|IMP|->)\s/gi, " => ")
    .replaceAll(/\sNOT\s/gi, " !")
}
