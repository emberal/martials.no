import { type Component } from "solid-js";
import type { ChildProps } from "../types/interfaces";

export const H1: Component<ChildProps> = ({ children, className }) => {
    return (
        <>
            <h1 class={ `text-4xl ${ className }` }>{ children }</h1>
        </>
    );
};

export const H3: Component<ChildProps> = ({ children, className }) => {
    return (
        <>
            <h3 class={ `text-2xl ${ className }` }>{ children }</h3>
        </>
    );
};
