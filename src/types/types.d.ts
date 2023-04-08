import { JSX } from "solid-js";

interface SimpleProps {
    name?: string;
    className?: string,
    style?: JSX.CSSProperties,
    id?: string,
    title?: string,
}

interface ChildProps extends SimpleProps {
    children?: JSX.Element,
}

interface LinkProps extends ChildProps {
    to?: string,
    rel?: string,
    newTab?: boolean,
}

interface TitleProps extends ChildProps {
    title?: string,
}

interface ButtonProps extends TitleProps {
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>,
    type?: "button" | "submit" | "reset",
}

interface InputProps<T> extends TitleProps {
    onInput?: JSX.EventHandlerUnion<T, Event>,
    placeholder?: string | null,
    required?: boolean,
    type?: string,
}

interface CardProps extends LinkProps {
    title?: string;
}

type Expression = {
    leading: string,
    left: Expression | null,
    operator: Operator | null,
    right: Expression | null,
    trailing: string,
    atomic: string | null,
};

type Operator = "AND" | "OR" | "NOT" | "IMPLICATION";

type Table = boolean[][];

type OrderOfOperations = {
    before: string,
    after: string,
    law: string,
}[];

type FetchResult = {
    status: string,
    version: string | null,
    before: string,
    after: string,
    orderOperations: OrderOfOperations | null,
    expression: Expression | null,
    header: string[] | null,
    table: {
        truthMatrix: Table,
    } | null,
};
