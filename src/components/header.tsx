/* @refresh reload */

import { Component } from "solid-js";
import { SimpleProps, TitleProps } from "../types/interfaces";
import { H1 } from "./text";

const Header: Component<TitleProps> = ({ className, title }) => {
    return (
        <header class={ className }>
            <H1 className={ "text-center" }>{ title }</H1>
            <div class={"mx-auto w-fit"}>
                <p>Av Martin Berg Alstad</p>
            </div>
        </header>
    );
};

export default Header;
