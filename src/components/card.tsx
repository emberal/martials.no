/* @refresh reload */
import { type Component } from "solid-js";
import type { CardProps } from "../types/interfaces";
import { H3 } from "./text";
import { Link } from "./link";

const Card: Component<CardProps> = ({ children, className, title, to, newTab = false }) => {
    return (
        <>
            <Link className={ "text-white" } to={ to } newTab={ newTab }>
                <div
                    class={ `relative bg-gradient-to-r from-cyan-600 to-cyan-500 min-w-64 rounded-2xl ${ className }` }>
                    <div class="relative p-5">
                        <H3 className={ "text-center" }>{ title }</H3>
                        { children }
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Card;
