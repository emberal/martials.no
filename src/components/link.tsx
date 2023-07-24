/* @refresh reload */
import { type Component } from "solid-js";

export const Link: Component<LinkProps> = (
    {
        to,
        rel,
        children,
        className,
        id,
        newTab = true,
        title,
    }) => ( // TODO <A/> throws exception
    <a href={ to } id={ id } title={ title }
       rel={ `${ rel } ${ newTab ? "noreferrer" : undefined }` }
       target={ newTab ? "_blank" : undefined }
       class={ `link ${ className }` }>
        { children }
    </a>
);
