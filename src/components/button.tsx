/* @refresh reload */
import { type Component, createSignal } from "solid-js";
import type { TitleProps } from "../types/interfaces";

interface SwitchProps extends TitleProps {
    defaultValue?: boolean,
    onChange?: (value: boolean) => void,
}

export const MySwitch: Component<SwitchProps> = (
    {
        defaultValue = false,
        title,
        onChange,
        className,
        name,
        id
    }) => {

    const [checked, setChecked] = createSignal(defaultValue);

    function handleChange() {
        const newChecked = !checked();
        setChecked(newChecked);
        if (onChange) {
            onChange(newChecked);
        }
    }

    return (
        <button id={ id }
                onClick={ handleChange }
                title={ title }
                class={ `${ checked() ? "bg-cyan-900" : "bg-gray-500" } 
                                       relative inline-flex h-6 w-11 items-center rounded-full my-2 ${ className }` }>
            <span class={ "sr-only" }>{ name }</span>
            <span class={ `${ checked() ? 'translate-x-6' : 'translate-x-1' }
             inline-block h-4 w-4 transform rounded-full bg-white transition-all` } />
        </button>
    );
};
