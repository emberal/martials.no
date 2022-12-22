/* @refresh reload */

import { type Component } from "solid-js";
import type { TitleProps } from "../types/interfaces";

const Header: Component<TitleProps> = ({ className, title }) => {
    return (
        <header class={ className }>
            <h1 class={ "text-center text-cyan-500" }>{ title }</h1>
            <div class={"mx-auto w-fit"}>
                <p>Av Martin Berg Alstad</p>
            </div>
        </header>
    );
};

export default Header;
