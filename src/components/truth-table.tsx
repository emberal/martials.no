/* @refresh reload */
import { For } from "solid-js/web"
import { type Component } from "solid-js"

interface TruthTableProps extends SimpleProps {
  table?: TruthMatrix
  header?: string[]
}

const TruthTable: Component<TruthTableProps> = ({ table, header, className, style, id }) => (
  <table
    class={`z-10 table border-collapse border-2 border-gray-500 ${className}`}
    id={id}
    style={style}
  >
    <thead>
      <tr>
        <For each={header}>
          {(exp) => (
            <th
              scope={"col"}
              class={
                `sticky top-0 bg-default-bg text-center outline outline-2 outline-offset-[-1px] outline-gray-500 [position:-webkit-sticky;]` /*TODO sticky header at the top of the screen */
              }
            >
              <p class={"w-max px-2"}>{exp}</p>
            </th>
          )}
        </For>
      </tr>
    </thead>
    <tbody>
      <For each={table}>
        {(row) => (
          <tr class={"hover:text-black"}>
            <For each={row}>
              {(value) => (
                <td
                  class={`border border-gray-500 text-center last:underline ${value ? "bg-green-700" : "bg-red-700"}`}
                >
                  <p>{value ? "T" : "F"}</p>
                </td>
              )}
            </For>
          </tr>
        )}
      </For>
    </tbody>
  </table>
)

export default TruthTable
