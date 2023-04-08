/* @refresh reload */
import { type Component } from "solid-js";
import type { ChildProps } from "../types/types";

/**
 * A row that centers its children
 * @param children The children of the row
 * @param className The class name of the row
 * @returns The row
 */
const Row: Component<ChildProps> = ({ children, className }) => (
    <div class={ `flex-row-center ${ className }` }>{ children }</div>
);

export default Row;
