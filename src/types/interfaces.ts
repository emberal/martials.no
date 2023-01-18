import { JSX } from "solid-js";

export interface SimpleProps {
    name?: string;
    className?: string,
    style?: JSX.CSSProperties,
    id?: string,
    title?: string,
}

export interface ChildProps extends SimpleProps {
    children?: JSX.Element,
}

export interface LinkProps extends ChildProps {
    to?: string,
    rel?: string,
    newTab?: boolean,
}

export interface TitleProps extends ChildProps {
    title?: string,
}

export interface ButtonProps extends TitleProps {
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>,
    type?: "button" | "submit" | "reset",
}

export interface InputProps<T> extends TitleProps {
    onInput?: JSX.EventHandlerUnion<T, Event>,
    placeholder?: string | null,
    required?: boolean,
    type?: string,
}

export interface CardProps extends LinkProps {
    title?: string;
}

export type Expression = {
    leading: string,
    left: Expression | null,
    operator: Operator | null,
    right: Expression | null,
    trailing: string,
    atomic: string | null,
};

export type Operator = "AND" | "OR" | "NOT" | "IMPLICATION";

export type Table = boolean[][];

export type OrderOfOperations = {
    before: string,
    after: string,
    law: string,
}[];

export type FetchResult = {
    status: {
        code: number,
        message: string,
    },
    before: string,
    after: string,
    orderOperations: OrderOfOperations | null,
    expression: Expression | null,
    header: string[] | null,
    table: {
        truthMatrix: Table,
    } | null,
};
