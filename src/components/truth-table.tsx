/* @refresh reload */
import type { SimpleProps } from "../types/types";
import type { Table } from "../types/types";
import { For } from "solid-js/web";
import { type Component } from "solid-js";

interface TruthTableProps extends SimpleProps {
    table?: Table,
    header?: string[],
}

const TruthTable: Component<TruthTableProps> = (
    {
        table,
        header,
        className,
        style,
        id,
    }) => {

    return (
        <table class={ `border-2 border-gray-500 border-collapse table z-10 ${ className }` } id={ id }
               style={ style }>
            <thead>
                <tr>
                    <For each={ header }>
                        { (exp) => (
                            <th scope={ "col" }
                                class={ `bg-default-bg text-center sticky top-0 [position:-webkit-sticky;]
                             outline outline-2 outline-offset-[-1px] outline-gray-500` /*TODO sticky header at the top of the screen */ }>
                                <p class={ "px-2 w-max" }>{ exp }</p>
                            </th>
                        ) }
                    </For>
                </tr>
            </thead>
            <tbody>
                <For each={ table }>
                    { (row) =>
                        <tr class={ "hover:text-black" }>
                            <For each={ row }>
                                { (value) =>
                                    <td class={ `text-center border border-gray-500 last:underline
                                            ${ value ? "bg-green-700" : "bg-red-700" }` }>
                                        <p>{ value ? "T" : "F" }</p>
                                    </td>
                                }
                            </For>
                        </tr>
                    }
                </For>
            </tbody>
        </table>
    );
}

export default TruthTable;
