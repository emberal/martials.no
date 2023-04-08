/* @refresh reload */
import { Dialog, DialogDescription, DialogPanel, DialogTitle } from "solid-headless";
import type { TitleProps } from "../types/types";
import { Component, createEffect, createSignal, JSX } from "solid-js";
import { Button } from "./button";
import { Portal } from "solid-js/web";
import { getElementById } from "../utils/dom";

interface MyDialog extends TitleProps {
    description?: string,
    button?: JSX.Element,
    acceptButtonName?: string,
    acceptButtonId?: string,
    cancelButtonName?: string,
    callback?: () => void,
    buttonClass?: string,
    buttonTitle?: string | null,
}

const MyDialog: Component<MyDialog> = (
    {
        title,
        description,
        button,
        acceptButtonName = "Ok",
        cancelButtonName = "Cancel",
        children,
        callback,
        className,
        buttonClass,
        buttonTitle,
        acceptButtonId,
    }) => {

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
            if (isMounted && e.key === "Enter" && acceptButtonId) {
                getElementById<HTMLButtonElement>(acceptButtonId)?.click();
            }
        }

        if (isOpen()) {
            const id = "cl-6"
            const el = getElementById(id);
            el?.addEventListener("keypress", click);
            return () => {
                el?.removeEventListener("keypress", click);
                isMounted = false;
            }
        }
        else return () => undefined;
    }

    createEffect(setupKeyPress, isOpen());

    return (
        <div class={ "w-fit h-fit" }>

            <button onClick={ () => setIsOpen(true) } class={ buttonClass } title={ buttonTitle ?? undefined }>
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

export default MyDialog;
