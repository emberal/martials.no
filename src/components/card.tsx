/* @refresh reload */
import { type Component } from "solid-js";
import type { CardProps } from "../types/types";
import { Link } from "./link";

const Card: Component<CardProps> = ({ children, className, title, to, newTab = false }) => {
    return (
        <>
            <div
                class={ `relative bg-gradient-to-r from-cyan-600 to-cyan-500 h-32 w-72 rounded-2xl ${ className }` }>
                <div class="relative p-5">
                    <Link className={ "text-white" } to={ to } newTab={ newTab }>
                        <h3 class={ "text-center w-fit mx-auto before:content-['↗']" }>{ title }</h3>
                    </Link>
                    { children }
                </div>
            </div>

        </>
    );
};

export default Card;
