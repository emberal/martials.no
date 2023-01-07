/* @refresh reload */
import { type Component } from "solid-js";
import type { ChildProps } from "../types/interfaces";

const Row: Component<ChildProps> = ({ children, className }) => {
    return <div class={ `flex-row-center ${ className }` }>{ children }</div>
}

export default Row;
