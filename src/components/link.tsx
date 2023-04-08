/* @refresh reload */
import { type Component } from "solid-js";
import type { LinkProps } from "../types/types";

export const Link: Component<LinkProps> = (
    {
        to,
        rel,
        children,
        className,
        id,
        newTab = true,
        title,
    }) => {
    return (
        <a href={ to } id={ id } title={ title }
           rel={ `${ rel } ${ newTab ? "noreferrer" : undefined }` }
           target={ newTab ? "_blank" : undefined }
           class={ `link ${ className }` }>
            { children }
        </a>
    );
};

