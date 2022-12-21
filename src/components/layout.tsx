/* @refresh reload */
import { type Component } from "solid-js";
import type { TitleProps } from "../types/interfaces";
import Header from "./header";

export const Layout: Component<TitleProps> = ({ children, title, className }) => {
    return (
        <div class={ `bg-default-bg text-white min-h-screen font-mono ${ className }` }>
            <div class="container mx-auto debug">
                <Header className={"my-3"} title={ title } />
                <main>
                    { children }
                </main>
            </div>
        </div>
    );
};
