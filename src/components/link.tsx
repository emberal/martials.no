import { Component, JSX } from "solid-js";
import { LinkProps } from "../types/interfaces";

export const A: Component<LinkProps> = (
    {
        to,
        rel,
        children,
        className,
        id,
        newTab = true,
    }): JSX.Element => {
    return (
        <a href={ to } id={ id }
           rel={ `${ rel } ${ newTab ? "noreferrer" : undefined }` }
           target={ newTab ? "_blank" : undefined }
           class={ `link ${ className }` }>
            { children }
        </a>
    );
};

