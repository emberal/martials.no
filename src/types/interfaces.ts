import { JSX } from "solid-js";

export interface SimpleProps {
    className?: string,
    style?: JSX.CSSProperties,
    id?: string,
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
    title: string,
}

export interface CardProps extends LinkProps {
    title: string;
}