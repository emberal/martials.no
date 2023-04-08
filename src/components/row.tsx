/* @refresh reload */
import { type Component } from "solid-js";
import type { ChildProps } from "../types/types";

const Row: Component<ChildProps> = ({ children, className }) => {
    return <div class={ `flex-row-center ${ className }` }>{ children }</div>
}

export default Row;
