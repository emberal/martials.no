/* @refresh reload */
import { type Component, createSignal, JSX, onMount, Setter, Show } from "solid-js";
import Row from "./row";
import { Icon } from "solid-heroicons";
import { magnifyingGlass, xMark } from "solid-heroicons/solid";
import { getElementById } from "../utils/dom";

function setupEventListener(id: string, setIsHover: Setter<boolean>): () => void {
    let isMounted = true;

    function hover(hover: boolean): void {
        if (isMounted) {
            setIsHover(hover);
        }
    }

    const el = getElementById(id);
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
        const el = getElementById<HTMLInputElement | HTMLTextAreaElement>(id);
        if (el && el.value !== "" !== isText) {
            setIsText(el.value !== "");
        }
    }
}

interface Input<T extends HTMLElement> extends InputProps<T> {
    leading?: JSX.Element,
    trailing?: JSX.Element,
    onChange?: () => void,
    inputClass?: string,
}

export const Input: Component<Input<HTMLInputElement>> = ( // TODO remove leading and trailing from component
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
        trailing,
        inputClass,
        ref
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

    onMount(() => {
        if (id && title) {
            setupEventListener(id, setIsHover);
        }
    });

    return (
        <Row className={ `relative ${ className }` }>
            { leading }
            <HoverTitle title={ title } isActive={ isFocused() || isHover() || isText() } htmlFor={ id } />
            <input
                class={ `bg-default-bg focus:border-cyan-500 outline-none border-2 border-gray-500 
                hover:border-t-cyan-400 ${ inputClass }` }
                id={ id }
                ref={ ref }
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

const HoverTitle: Component<{ title?: string, isActive?: boolean, htmlFor?: string }> = (
    {
        title,
        isActive = false,
        htmlFor
    }) => (
    <label class={ `absolute pointer-events-none
                 ${ isActive ? "-top-2 left-3 default-bg text-sm" : "left-2 top-1" } 
            transition-all duration-150 text-gray-600 dark:text-gray-400` }
           for={ htmlFor }>
        <div class={ "z-50 relative" }>{ title }</div>
        <div class={ "w-full h-2 default-bg absolute bottom-1/3 z-10" } />
    </label>
);

interface SearchProps extends InputProps<HTMLInputElement> {
    typingDefault?: boolean
}

export const Search: Component<SearchProps> = (
    {
        typingDefault = false,
        id = "search",
        className,
        ref
    }) => {

    const [typing, setTyping] = createSignal(typingDefault);

    function getInputElement() {
        return getElementById<HTMLInputElement>(id);
    }

    function clearSearch(): void {
        const el = getInputElement();
        if (el) {
            el.value = "";
            setTyping(false);
            history.replaceState(null, "", location.pathname);
            el.focus();
        }
    }

    function onChange(): void {
        const el = getInputElement();
        if (el && (el.value !== "") !== typing()) {
            setTyping(el.value !== "");
        }
    }

    return (
        <Input inputClass={ `rounded-xl pl-7 h-10 w-full pr-8` } className={ `w-full ${ className }` }
               id={ id }
               ref={ ref }
               placeholder={ "¬A & B -> C" }
               type={ "text" }
               onChange={ onChange }
               leading={ <Icon path={ magnifyingGlass } aria-label={ "Magnifying glass" }
                               class={ "pl-2 absolute" } /> }
               trailing={ <Show when={ typing() } keyed>
                   <button class={ "absolute right-2" }
                           title={ "Clear" }
                           type={ "reset" }
                           onClick={ clearSearch }>
                       <Icon path={ xMark } aria-label={ "The letter X" } />
                   </button>
               </Show> }
        />
    );
}
