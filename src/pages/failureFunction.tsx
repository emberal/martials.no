/* @refresh reload */

import { Component, createSignal } from "solid-js";
import { Input } from "../components/input";
import Layout from "../components/layout";
import { failureFunction } from "../utils/failureFunction";
import { For } from "solid-js/web";

type FFProps = { char: string, index: number }

const FailureFunctionPage: Component = () => {
    let inputRef: HTMLInputElement | undefined = undefined;

    const [result, setResult] = createSignal<ReadonlyArray<FFProps>>()

    function onSubmit(e: Event) {
        e.preventDefault()
        if (inputRef) {
            const input = inputRef.value;
            const splitInput = input.split("")
            const output = failureFunction(input)

            if (output.length !== splitInput.length) {
                console.error("Something went wrong")
            }
            else {
                setResult(output.map((value, index) => {
                    return { char: splitInput[index], index: value } as FFProps
                }))
            }
        }
    }

    return (
        <Layout title={ "Failure function" }>
            <div class={ "container mx-auto max-w-2xl overflow-auto" }>
                <p>Failure Function</p>
                <form onsubmit={ onSubmit }>
                    <Input ref={ inputRef } inputClass={ "rounded-2xl w-full h-10 px-3" } />
                </form>
                <table class={ "mb-3" }>
                    <thead>
                        <tr>
                            <For each={ result() }>
                                { ({ char }) =>
                                    <th class={ "border border-black" }>{ char }</th>
                                }
                            </For>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <For each={ result() }>
                                { ({ index }) =>
                                    <td class={ "border border-black" }>{ index }</td>
                                }
                            </For>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default FailureFunctionPage;
