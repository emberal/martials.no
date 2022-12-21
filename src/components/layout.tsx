/* @refresh reload */
import { type Component } from "solid-js";
import type { TitleProps } from "../types/interfaces";
import Header from "./header";
import Footer from "./footer";

const Layout: Component<TitleProps> = ({ children, title, className }) => {
    return (
        <div class={ `bg-default-bg text-white min-h-screen relative font-mono ${ className }` }>
            <div class="container mx-auto">
                <Header className={ "py-3" } title={ title } />
                <main>
                    <div class={ "pb-28" }>{ children }</div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
