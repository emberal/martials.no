interface SimpleProps<T extends HTMLElement = HTMLElement> {
  name?: string
  className?: string
  style?: import("solid-js").JSX.CSSProperties
  id?: string
  title?: string
  ref?: T
}

interface ChildProps<T extends HTMLElement = HTMLInputElement> extends SimpleProps<T> {
  children?: import("solid-js").JSX.Element
}

interface LinkProps extends ChildProps {
  to?: string
  rel?: string
  newTab?: boolean
}

interface TitleProps<T extends HTMLElement = HTMLElement> extends ChildProps<T> {
  title?: string
}

interface ButtonProps extends TitleProps {
  onClick?: import("solid-js").JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  type?: "button" | "submit" | "reset"
}

interface InputProps<T extends HTMLElement = HTMLInputElement> extends TitleProps<T> {
  onInput?: import("solid-js").JSX.EventHandlerUnion<T, Event>
  placeholder?: string
  required?: boolean
  type?: string
}

interface CardProps extends LinkProps {
  title?: string
}

type AtomicExpression = {
  atomic: string
}

type NotExpression = {
  not: Expression
}

type BinaryExpression = {
  left: Expression
  operator: BinaryOperator
  right: Expression
}

type Expression = AtomicExpression | NotExpression | BinaryExpression

type BinaryOperator = "AND" | "OR" | "IMPLICATION"

type Law =
  | "ELIMINATION_OF_IMPLICATION"
  | "DE_MORGANS_LAWS"
  | "ABSORPTION_LAW"
  | "ASSOCIATIVE_LAW"
  | "DISTRIBUTIVE_LAW"
  | "DOUBLE_NEGATION_ELIMINATION"
  | "COMMUTATIVE_LAW"

type TruthMatrix = boolean[][]

type Operation = {
  before: string
  after: string
  law: Law
}

type Table = {
  header: string[]
  truthMatrix: TruthMatrix
}

type FetchResult = {
  version: string
  before: string
  after: string
  operations: Operation[]
  expression: Expression | null
  truthTable?: Table | null
}
