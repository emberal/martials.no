/* @refresh reload */
import { type Component } from "solid-js";
import type { LinkProps } from "../types/interfaces";

export const Link: Component<LinkProps> = (
    {
        to,
        rel,
        children,
        className,
        id,
        newTab = true,
    }) => {
    return (
        <a href={ to } id={ id }
           rel={ `${ rel } ${ newTab ? "noreferrer" : undefined }` }
           target={ newTab ? "_blank" : undefined }
           class={ `link ${ className }` }>
            { children }
        </a>
    );
};

