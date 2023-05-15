/* @refresh reload */
import { type Component, createEffect, createSignal, JSX, Show } from "solid-js";
import { Button } from "./button";

interface MenuProps extends TitleProps {
    button?: JSX.Element,
    buttonClassName?: string,
    itemsClassName?: string,
}

const MyMenu: Component<MenuProps> = (
    {
        title,
        button,
        children,
        id,
        className,
        buttonClassName,
        itemsClassName,
    }) => {

    const [isOpen, setIsOpen] = createSignal(false);

    function closeMenu(): void {
        setIsOpen(false);
    }

    function toggleMenu(): void {
        setIsOpen(!isOpen());
    }

    createEffect(() => {

        function click(e: MouseEvent): void {
            if (e.target instanceof HTMLElement) {
                if (e.target.closest(`#${ id }`) === null) {
                    closeMenu();
                }
            }
        }

        function keypress(e: KeyboardEvent): void {
            if (e.key === "Escape") {
                closeMenu();
            }
        }

        if (isOpen()) {
            document.addEventListener("click", click);
            document.addEventListener("keyup", keypress);
        }
        else {
            document.removeEventListener("click", click);
            document.removeEventListener("keyup", keypress);
        }
    });

    return ( // TODO transition
        <div class={ `${ className }` } id={ id }>

            <Button title={ title }
                    onClick={ toggleMenu }
                    className={ `flex-row-center ${ buttonClassName }` }>
                { button }
            </Button>

            <Show when={ isOpen() } keyed>
                <div
                    class={ `absolute bg-default-bg border border-gray-500 rounded-b-xl mt-1 w-max z-50 ${ itemsClassName }` }>
                    <div class={ "mx-1" }>{ children }</div>
                </div>
            </Show>

        </div>
    );
}

export default MyMenu;
