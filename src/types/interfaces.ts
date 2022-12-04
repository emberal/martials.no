import { JSX } from "solid-js";

export interface ChildProps {
    children?: JSX.Element,
    className?: string,
    id?: string,
}

export interface LinkProps extends ChildProps {
    to?: string,
    rel?: string,
    newTab?: boolean,
}