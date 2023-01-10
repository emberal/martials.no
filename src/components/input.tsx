/* @refresh reload */
import { type Component, createSignal, JSX, Setter } from "solid-js";
import type { InputProps } from "../types/interfaces";
import Row from "./row";

function setupEventListener(id: string, setIsHover: Setter<boolean>): () => void {
    let isMounted = true;

    function hover(hover: boolean): void {
        if (isMounted) {
            setIsHover(hover);
        }
    }

    const el = document.getElementById(id);
    el?.addEventListener("pointerenter", () => hover(true));
    el?.addEventListener("pointerleave", () => hover(false));

    return () => {
        el?.removeEventListener("pointerenter", () => hover(true));
        el?.removeEventListener("pointerleave", () => hover(false));
        isMounted = false;
    }
}

/**
 * Sets isText to 'true' or 'false' using the setIsText function.
 * if the value of the input element is not empty and it's different from the current value
 */
function setSetIsText(id: string | undefined, isText: boolean, setIsText: Setter<boolean>): void {
    if (id) {
        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el && el.value !== "" !== isText) {
            setIsText(el.value !== "");
        }
    }
}

interface Input<T> extends InputProps<T> {
    leading?: JSX.Element,
    trailing?: JSX.Element,
    onChange?: () => void,
}

export const Input: Component<Input<HTMLInputElement>> = (
    {
        className,
        id,
        name,
        type = "text",
        title,
        placeholder,
        required = false,
        onChange,
        leading,
        trailing
    }): JSX.Element => {

    /**
     * Is 'true' if the input element is in focus
     */
    const [isFocused, setIsFocused] = createSignal(false);
    /**
     * Is 'true' if the user is hovering over the input element
     */
    const [isHover, setIsHover] = createSignal(false);
    /**
     * Is 'true' if the input element contains any characters
     */
    const [isText, setIsText] = createSignal(false);

    document.addEventListener("DOMContentLoaded", () => {
        if (id && title) {
            setupEventListener(id, setIsHover);
        }
    });

    return (
        <Row className={ "relative" }>
            { leading }
            <HoverTitle title={ title } isActive={ isFocused() || isHover() || isText() } htmlFor={ id } />
            <input
                class={ `bg-default-bg focus:border-cyan-500 outline-none border-2 border-gray-500 
                hover:border-t-cyan-400 ${ className }` }
                id={ id }
                onFocus={ () => setIsFocused(true) }
                onBlur={ () => setIsFocused(false) }
                name={ name ?? undefined }
                type={ type }
                placeholder={ placeholder ?? undefined }
                required={ required }
                onInput={ () => {
                    setSetIsText(id, isText(), setIsText);
                    if (onChange) {
                        onChange();
                    }
                } } />
            { trailing }
        </Row>
    );
}

function HoverTitle(
    {
        title,
        isActive = false,
        htmlFor
    }: { title?: string | null, isActive?: boolean, htmlFor?: string }): JSX.Element {
    return (
        <label class={ `absolute pointer-events-none
                 ${ isActive ? "-top-2 left-3 default-bg text-sm" : "left-2 top-1" } 
            transition-all duration-150 text-gray-600 dark:text-gray-400` }
               for={ htmlFor }>
            <div class={ "z-50 relative" }>{ title }</div>
            <div class={ "w-full h-2 default-bg absolute bottom-1/3 z-10" } />
        </label>
    );
}
