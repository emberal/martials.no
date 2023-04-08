/* @refresh reload */
import { type Component } from "solid-js";
import type { SimpleProps } from "../types/types";
import { Link } from "./link";

const Footer: Component<SimpleProps> = ({ className }) => {
    return (
        <footer class={ `text-center py-5 absolute bottom-0 container ${ className }` }>
            <p>Kildekode på <Link to={ "https://github.com/h600878/martials.no" }>GitHub</Link></p>
        </footer>
    );
};

export default Footer;
