/* @refresh reload */
import { Dialog, DialogDescription, DialogPanel, DialogTitle } from "solid-headless";
import type { TitleProps } from "../types/interfaces";
import { createEffect, createSignal, JSX } from "solid-js";
import { Button } from "./button";
import { Portal } from "solid-js/web";

interface MyDialog extends TitleProps {
    description?: string,
    button?: JSX.Element,
    acceptButtonName?: string | null,
    acceptButtonId?: string,
    cancelButtonName?: string | null,
    callback?: () => void,
    buttonClasses?: string,
    buttonTitle?: string | null,
}

export default function MyDialog(
    {
        title,
        description,
        button,
        acceptButtonName = "Ok",
        cancelButtonName = "Cancel",
        children,
        callback,
        className,
        buttonClasses,
        buttonTitle,
        acceptButtonId,
    }: MyDialog): JSX.Element {

    const [isOpen, setIsOpen] = createSignal(false);

    function callbackAndClose(): void {
        if (callback) {
            callback();
        }
        setIsOpen(false);
    }

    function setupKeyPress(): () => void {
        let isMounted = true;

        /**
         * Pressing "Enter" when the modal is open, will click the accept button
         * @param e KeyboardEvent of keypress
         */
        function click(e: KeyboardEvent): void {
            if (isMounted && e.key === "Enter") {
                (document.getElementById(acceptButtonId ?? "") as HTMLButtonElement | null)?.click();
            }
        }

        if (isOpen()) {
            const id = "cl-6"
            const el = document.getElementById(id);
            el?.addEventListener("keypress", e => click(e));
            return () => {
                el?.removeEventListener("keypress", e => click(e));
                isMounted = false;
            }
        }
    }

    createEffect(setupKeyPress, isOpen());

    return (
        <div class={ "w-fit h-fit" }>

            <button onClick={ () => setIsOpen(true) } class={ buttonClasses } title={ buttonTitle ?? undefined }>
                { button }
            </button>

            <Portal>
                <Dialog isOpen={ isOpen() } onClose={ () => setIsOpen(false) }
                        class={ `fixed inset-0 flex-row-center justify-center z-50 overflow-auto text-white ${ className }` }>

                    <div class={ "fixed inset-0 bg-black/40" /*Backdrop*/ } aria-hidden={ true } />

                    <DialogPanel class={ "w-fit relative bg-default-bg border-rounded border-gray-500 p-2" }>
                        <DialogTitle class={ "border-b" }>{ title }</DialogTitle>
                        <DialogDescription class={ "mb-4 mt-1" }>{ description }</DialogDescription>

                        { children }

                        <div class={ "my-3" }>
                            <Button onClick={ callbackAndClose } className={ "h-10 mr-2" }
                                    id={ acceptButtonId }>{ acceptButtonName }</Button>
                            <Button onClick={ () => setIsOpen(false) }
                                    className={ "h-10" }>{ cancelButtonName }</Button>
                        </div>

                    </DialogPanel>

                </Dialog>
            </Portal>
        </div>
    );
}
