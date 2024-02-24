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

type Expression = {
  leading: string
  left: Expression | null
  operator: Operator | null
  right: Expression | null
  trailing: string
  atomic: string | null
}

type Operator = "AND" | "OR" | "NOT" | "IMPLICATION"

type Table = boolean[][]

type OrderOfOperation = {
  before: string
  after: string
  law: string
}

type FetchResult = {
  status: string
  version: string | null
  before: string
  after: string
  orderOperations: OrderOfOperation[] | null
  expression: Expression | null
  header: string[] | null
  table: {
    truthMatrix: Table
  } | null
}
