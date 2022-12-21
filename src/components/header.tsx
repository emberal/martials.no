/* @refresh reload */

import { type Component } from "solid-js";
import type { TitleProps } from "../types/interfaces";
import { H1 } from "./text";

const Header: Component<TitleProps> = ({ className, title }) => {
    return (
        <header class={ className }>
            <H1 className={ "text-center text-cyan-500" }>{ title }</H1>
            <div class={"mx-auto w-fit"}>
                <p>Av Martin Berg Alstad</p>
            </div>
        </header>
    );
};

export default Header;
