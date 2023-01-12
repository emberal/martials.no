/* @refresh reload */
import Layout from "./components/layout";
import { Input } from "./components/input";
import { Icon } from "solid-heroicons";
import TruthTable from "./components/truth-table";
import { InfoBox, MyDisclosure, MyDisclosureContainer } from "./components/output";
import { diffChars } from "diff";
import MyMenu from "./components/menu";
import { type BookType, utils, write, writeFile } from "xlsx"
import type { FetchResult } from "./types/interfaces";
import { type Component, createEffect, createSignal, JSX, onMount, Show } from "solid-js";
import { For, render } from "solid-js/web";
import Row from "./components/row";
import { arrowDownTray, check, eye, eyeSlash, funnel, magnifyingGlass, xMark } from "solid-heroicons/solid";
import { Button, MySwitch } from "./components/button";
import MyDialog from "./components/dialog";

type Option = { name: string, value: string };

// TODO move some code to new components
const TruthTablePage: Component = () => {

    const inputId = "truth-input";

    /**
     * Stores the boolean value of the simplify toggle
     */
    const [simplifyEnabled, setSimplifyEnabled] = createSignal(true);
    /**
     * The state element used to store the simplified string, "empty string" by default
     */
    const [fetchResult, setFetchResult] = createSignal<FetchResult | null>(null);

    /**
     * If the searchbar is empty, this state is 'false', otherwise 'true'
     */
    const [typing, setTyping] = createSignal(false);

    const hideOptions: Option[] = [
        { name: "Show all result", value: "NONE" },
        { name: "Hide true results", value: "TRUE" },
        { name: "Hide false results", value: "FALSE" },
    ];

    const sortOptions: Option[] = [
        { name: "Sort by default", value: "DEFAULT" },
        { name: "Sort by true first", value: "TRUE_FIRST" },
        { name: "Sort by false first", value: "FALSE_FIRST" },
    ];

    /**
     * The currently selected hide value, either 'none', 'true' or 'false'
     */
    const [hideValues, setHideValues] = createSignal(hideOptions[0]);

    /**
     * The currently selected sort value, either 'default', 'trueFirst' or 'falseFirst'
     */
    const [sortValues, setSortValues] = createSignal(sortOptions[0]);

    /**
     * Updates the state of the current expression to the new search with all whitespace removed.
     * If the element is not found, reset.
     */
    async function onClick(e: { preventDefault: () => void; }): Promise<void> {
        e.preventDefault(); // Stops the page from reloading onClick
        const exp = (document.getElementById(inputId) as HTMLInputElement | null)?.value;

        setFetchResult(null);

        if (exp && exp !== "") {

            // TODO add loading animation
            let result: FetchResult | undefined;
            await fetch(`https://api.martials.no/simplify-truths/simplify/table?exp=${ exp }&simplify=${ simplifyEnabled() }`)
                .then(res => res.json())
                .then(res => result = res)
                .catch(err => console.error(err)) // TODO show error on screen
                .finally();

            // console.log(result);
            setFetchResult(result);
        }
    }

    function getInputElement() {
        return document.getElementById(inputId) as HTMLInputElement | null;
    }

    function onTyping() {
        const el = getInputElement();
        if (el && (el.value !== "") !== typing()) {
            setTyping(el.value !== "");
        }
    }

    function clearSearch() {
        const el = getInputElement();
        if (el) {
            el.value = "";
            setFetchResult(null);
            setTyping(false);
            el.focus();
        }
    }

    const tableId = "truth-table";
    const filenameId = "excel-filename";

    onMount(() => {
        // Focuses searchbar on load
        getInputElement()?.focus();
    });

    /**
     * Exports the generated truth table to an excel (.xlsx) file
     *
     * @param type The downloaded files extension. Default is "xlsx"
     * @param name The name of the file, excluding the extension. Default is "Truth Table"
     * @param dl
     * @returns {any}
     * @author SheetJS
     * @link https://cdn.sheetjs.com/
     * @license Apache 2.0 License
     * SheetJS Community Edition -- https://sheetjs.com/
     *
     * Copyright (C) 2012-present   SheetJS LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *       http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function exportToExcel(
        {
            type = "xlsx",
            name = "Truth Table",
            dl = false
        }: { type?: BookType, name?: string, dl?: boolean }): any {

        const element = document.getElementById(tableId);
        const wb = utils.table_to_book(element, { sheet: "sheet1" });
        return dl ?
            write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
            writeFile(wb, name + "." + type);
    }

    function _exportToExcel(): void {
        const value = (document.getElementById(filenameId) as HTMLInputElement | null)?.value;
        exportToExcel({
            name: value !== "" ? value : undefined,
        });
    }

    return (
        <Layout title={ "Truth tables" }
            /*containerClass={ "!max-w-full overflow-x-hidden" }
            titleAndNavClass={ "max-w-2xl mx-auto" }
            footerClass={ "max-w-2xl left-1/2 -translate-x-1/2" }*/>
            <div id={ "truth-content" }>
                <div class={ "max-w-2xl mx-auto" }>
                    <MyDisclosureContainer>
                        <MyDisclosure title={ "How to" }>
                            <p>{ "truthTableHowTo" /*TODO*/ }</p>
                        </MyDisclosure>
                        <MyDisclosure title={ "Keywords" }>
                            <>
                                <p>not</p>
                                <p>and</p>
                                <p>or</p>
                                <p>implication</p>
                            </>
                        </MyDisclosure>
                    </MyDisclosureContainer>

                    <form class={ "flex-row-center" } onSubmit={ onClick } autocomplete={ "off" }>
                        <Input className={ `rounded-xl pl-7 h-10 w-52 sm:w-96 pr-8` }
                               id={ "truth-input" }
                               placeholder={ "¬A & B -> C" }
                               type={ "text" }
                               onChange={ onTyping }
                               leading={ <Icon path={ magnifyingGlass } class={ "pl-1 absolute h-6" } /> }
                               trailing={ <Show when={ typing() } keyed>
                                   <button class={ "absolute left-44 sm:left-[22rem]" }
                                           title={ "Clear" }
                                           type={ "reset" }
                                           onClick={ clearSearch }>
                                       <Icon path={ xMark } class={ "h-6" } />
                                   </button>
                               </Show> }
                        />
                        <Button id={ "truth-input-button" }
                                title={ "Generate (Enter)" }
                                type={ "submit" }
                                className={ "min-w-50px h-10 ml-2" }
                                children={ "Generate" } />
                    </form>

                    <Row className={ "my-1 gap-2" }>
                        <span class={ "h-min" }>{ "Simplify" }: </span>
                        <MySwitch onChange={ setSimplifyEnabled } defaultValue={ simplifyEnabled() }
                                  title={ "Simplify" }
                                  name={ "Turn on/off simplify expressions" } className={ "mx-1" } />

                        <div class={ "h-min relative" }>
                            <MyMenu title={ "Filter results" } id={ "filter-results" }
                                    button={
                                        <Show when={ hideValues().value !== "NONE" } children={
                                            <Icon path={ eyeSlash }
                                                  class={ `mx-1 h-6 w-6 ${ hideValues().value === "TRUE" ?
                                                      "text-green-500" : "text-red-500" }` } />
                                        } fallback={
                                            <Icon path={ eye } class={ "mx-1 h-6 w-6" } />
                                        } keyed />
                                    }
                                    children={
                                        <For each={ hideOptions }>
                                            { (option) => (
                                                <SingleMenuItem onClick={ () => setHideValues(option) }
                                                                option={ option }
                                                                currentValue={ hideValues() } />
                                            ) }
                                        </For>
                                    } itemsClassName={ "right-0" }
                            />
                        </div>

                        <div class={ "h-min relative" }>
                            <MyMenu title={ "Sort results" } id={ "sort-results" }
                                    button={ <Icon path={ funnel }
                                                   class={ `h-6 w-6 ${ sortValues().value === "TRUE_FIRST" ? "text-green-500" :
                                                       sortValues().value === "FALSE_FIRST" && "text-red-500" }` } /> }
                                    children={
                                        <For each={ sortOptions }>
                                            { (option) => (
                                                <SingleMenuItem option={ option } currentValue={ sortValues() }
                                                                onClick={ () => setSortValues(option) } />
                                            ) }
                                        </For>
                                    }
                                    itemsClassName={ "right-0" }
                            />
                        </div>

                        <Show when={ fetchResult()?.expression } keyed>

                            <MyDialog title={ "Download" }
                                      description={ "Export current table (.xlsx)" }
                                      button={ <>
                                          <p class={ "sr-only" }>{ "Download" }</p>
                                          <Icon class={ "w-6 h-6" } path={ arrowDownTray } />
                                      </> }
                                      callback={ _exportToExcel }
                                      acceptButtonName={ "Download" }
                                      cancelButtonName={ "Cancel" }
                                      buttonClasses={ `float-right` }
                                      buttonTitle={ "Export current table" }
                                      acceptButtonId={ "download-accept" }>
                                <p>{ "Filename" }:</p>
                                <Input className={ "border-rounded h-10 px-2" } id={ filenameId }
                                       placeholder={ "Truth Table" } />
                            </MyDialog>

                        </Show>

                    </Row>
                    {
                        fetchResult() && fetchResult()?.status.code !== 200 &&
                        <InfoBox className={ "w-fit text-center mx-auto" }
                                 title={ "Input error" }
                                 error={ true }>
                            <p>{ fetchResult()?.status.message }</p>
                        </InfoBox>
                    }
                    {
                        fetchResult()?.orderOperations && simplifyEnabled() && fetchResult()?.orderOperations.length > 0 &&
                        <MyDisclosureContainer>
                            <MyDisclosure title={ "Show me how it's done" }>
                                <table class={ "table" }>
                                    <tbody>
                                        <For each={ fetchResult()?.orderOperations }>{
                                            (operation, index) => (
                                                <tr class={ "border-b border-dotted border-gray-500" }>
                                                    <td>{ index() + 1 }:</td>
                                                    <td class={ "px-2" }>{

                                                        <For each={ diffChars(operation.before, operation.after) }>
                                                            { (part) => (
                                                                <span class={
                                                                    `${ part.added && "bg-green-700" }
                                                                    ${ part.removed && "bg-red-700" }` }>
                                                                { part.value }
                                                            </span>) }
                                                        </For> }

                                                        { typeof window !== "undefined" && window.outerWidth <= 640 &&
                                                            <p>{ "using" }: { operation.law }</p> }
                                                    </td>
                                                    { typeof window !== "undefined" && window.outerWidth > 640 &&
                                                        <td>{ "using" }: { operation.law }</td> }
                                                </tr>
                                            ) }
                                        </For>
                                    </tbody>
                                </table>
                            </MyDisclosure>
                        </MyDisclosureContainer>
                    }
                </div>
                {
                    fetchResult()?.expression &&
                    <>
                        <div class={ "flex flex-row" }>
                            {
                                simplifyEnabled &&
                                <InfoBox className={ "w-fit mx-auto pb-1 text-lg text-center" }
                                         title={ "Output" + ":" } id={ "expression-output" }>
                                    <p>{ fetchResult()?.after }</p>
                                </InfoBox>
                            }
                        </div>

                        <div class={ "flex justify-center m-2" }>
                            <div id={ "table" } class={ "h-[45rem] overflow-auto" }>
                                { /*TODO make sure table uses whole width and x-scrollable*/ }
                                <TruthTable header={ fetchResult()?.header ?? undefined }
                                            table={ fetchResult()?.table?.truthMatrix } id={ tableId } />

                            </div>
                        </div>
                    </>
                }
            </div>
        </Layout>
    );
}

export default TruthTablePage;

interface SingleMenuItem {
    option: Option,
    currentValue?: Option,
    onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>,
}

// TODO not rerendering when currentValue changes
const SingleMenuItem: Component<SingleMenuItem> = ({ option, currentValue, onClick }) => {
    return (
        <div class={ `hover:underline cursor-pointer last:mb-1 flex-row-center` }
             onClick={ onClick }>
            <Icon path={ check }
                  class={ `h-6 w-6 text-white ${ currentValue.value !== option.value && "text-transparent" }` } />
            { option.name }
        </div>
    );
}

render(() => <TruthTablePage />, document.getElementById("root") as HTMLElement);
