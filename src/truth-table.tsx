/* @refresh reload */
import Layout from "./components/layout";
import { Input } from "./components/input";
// import { Check, Download, Eye, EyeOff, Filter, Search, X } from "react-feather";
import { Icon } from "solid-heroicons";
import TruthTable from "./components/truth-table";
import { InfoBox, MyDisclosure, MyDisclosureContainer } from "./components/output";
// import MySwitch from "./components/switch";
// import { diffChars } from "diff";
// import { Menu } from "@headlessui/react";
// import MyMenu from "./components/menu";
// import { type BookType, utils, write, writeFile } from "xlsx"
// import MyDialog from "./components/myDialog";
import type { FetchResult } from "./types/interfaces";
import { type Component, createSignal, JSX, Show } from "solid-js";
import { For, render } from "solid-js/web";
import Row from "./components/row";
import { magnifyingGlass, xMark } from "solid-heroicons/solid";

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

    const hideOptions = [
        { name: "Show all result", value: "NONE" },
        { name: "Hide true results", value: "TRUE" },
        { name: "Hide false results", value: "FALSE" },
    ];

    const sortOptions = [
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

        if (exp && exp !== "") {

            // TODO add loading animation
            let result: FetchResult | undefined;
            await fetch(`https://api.martials.no/simplify-truths/simplify/table?exp=${ exp }&simplify=${ simplifyEnabled() }`)
                .then(res => res.json())
                .then(res => result = res)
                .catch(err => console.error(err)) // TODO show error on screen
                .finally();

            console.log(result);
            setFetchResult(result);
        }
        else {
            setFetchResult(null);
        }
    }

    function onTyping() {
        console.log("typing");
        const el = (document.getElementById(inputId) as HTMLInputElement | null);
        if (el && (el.value !== "") !== typing()) {
            setTyping(el.value !== "");
        }
    }

    function clearSearch() {
        const el = (document.getElementById(inputId) as HTMLInputElement | null);
        if (el) {
            el.value = "";
            setFetchResult(null);
            setTyping(false);
            el.focus();
        }
    }

    const tableId = "truth-table";
    const filenameId = "excel-filename";

    document.addEventListener("DOMContentLoaded", () => {
        // Focuses searchbar on load
        (document.getElementById(inputId) as HTMLInputElement | null)?.focus();
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
    // function exportToExcel(
    //     {
    //         type = "xlsx",
    //         name = "Truth Table",
    //         dl = false
    //     }: { type?: BookType, name?: string, dl?: boolean }): any {
    //
    //     const element = document.getElementById(tableId);
    //     const wb = utils.table_to_book(element, { sheet: "sheet1" });
    //     return dl ?
    //         write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
    //         writeFile(wb, name + "." + type);
    // }
    //
    // function _exportToExcel(): void {
    //     const value = (document.getElementById(filenameId) as HTMLInputElement | null)?.value;
    //     exportToExcel({
    //         name: value !== "" ? value : undefined,
    //     });
    // }

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
                                   <button class={ "absolute left-44 sm:left-[22rem]" /*TODO*/ }
                                           title={ "Clear" }
                                           type={ "reset" }
                                           onClick={ clearSearch }>
                                       <Icon path={ xMark } class={ "h-6" } />
                                   </button>
                               </Show> }
                        />
                        <input id={ "truth-input-button" }
                               title={ "Generate (Enter)" }
                               type={ "submit" }
                               class={ "button min-w-50px h-10 ml-2" }
                               value={ "Generate" } />
                    </form>

                    <Row className={ "my-1 gap-2" }>
                        <span class={ "h-min" }>{ "Simplify" }: </span>
                        {/*<MySwitch onChange={ setSimplifyEnabled } checked={ simplifyEnabled } title={ t("simplify") }*/ }
                        {/*          name={ t("toggleSimplify") } className={ "mx-1" } />*/ }

                        <div class={ "h-min relative" }>
                            {/*<MyMenu title={ "Filter results" }*/ }
                            {/*        // button={*/ }
                            {/*        //     hideValues().value === "none" ?*/ }
                            {/*        //         <Eye className={ "mx-1" } /> :*/ }
                            {/*        //         <EyeOff className={ `mx-1 ${ hideValues().value === "TRUE" ?*/ }
                            {/*        //             "text-green-500" : "text-red-500" }` } />*/ }
                            {/*        // }*/ }
                            {/*        children={*/ }
                            {/*            <For each={ hideOptions }>*/ }
                            {/*                { (option) => (*/ }
                            {/*                    <SingleMenuItem onClick={ () => setHideValues(option) }*/ }
                            {/*                                    option={ option }*/ }
                            {/*                                    currentValue={ hideValues } />)*/ }
                            {/*                }*/ }
                            {/*            </For>*/ }
                            {/*        } itemsClassName={ "right-0" }*/ }
                            {/*/>*/ }
                        </div>

                        <div class={ "h-min relative" }>
                            {/*<MyMenu title={ t("sort") + " " + t("results") }*/ }
                            {/*        button={ <Filter*/ }
                            {/*            className={ sortValues().value === "trueFirst" ?*/ }
                            {/*                "text-green-500" : sortValues().value === "falseFirst" ? "text-red-500" : "" } /> }*/ }
                            {/*        children={*/ }
                            {/*            <For each={ sortOptions }>*/ }
                            {/*                { option => (*/ }
                            {/*                    <SingleMenuItem option={ option } currentValue={ sortValues }*/ }
                            {/*                                    onClick={ () => setSortValues(option) } />)*/ }
                            {/*                }*/ }
                            {/*            </For>*/ }
                            {/*        }*/ }
                            {/*        itemsClassName={ "right-0" }*/ }
                            {/*/>*/ }
                        </div>

                        {/*{*/ }
                        {/*    fetchResult()?.expression &&*/ }
                        {/*    <MyDialog title={ t("download") }*/ }
                        {/*              description={ t("exportCurrentTable") + " (.xlsx)" }*/ }
                        {/*              button={ <><p class={ "sr-only" }>{ t("download") }</p><Download /></> }*/ }
                        {/*              callback={ _exportToExcel }*/ }
                        {/*              acceptButtonName={ t("download") }*/ }
                        {/*              cancelButtonName={ t("cancel") }*/ }
                        {/*              buttonClasses={ `float-right` }*/ }
                        {/*              buttonTitle={ t("exportCurrentTable") }*/ }
                        {/*              acceptButtonId={ "download-accept" }>*/ }
                        {/*        <p>{ t("filename") }:</p>*/ }
                        {/*        <Input className={ "border-rounded h-10" } id={ filenameId }*/ }
                        {/*               placeholder={ "Truth Table" } />*/ }
                        {/*    </MyDialog>*/ }
                        {/*}*/ }

                    </Row>
                    {/*{*/ }
                    {/*    fetchResult && fetchResult()?.status.code !== 200 &&*/ }
                    {/*    <InfoBox className={ "w-fit text-center" }*/ }
                    {/*             title={ t("inputError") }*/ }
                    {/*             error={ true }>*/ }
                    {/*        <p>{ fetchResult()?.status.message }</p>*/ }
                    {/*    </InfoBox>*/ }
                    {/*}*/ }
                    {/*{*/ }
                    {/*    fetchResult()?.orderOperations && simplifyEnabled() && fetchResult()?.orderOperations.length > 0 &&*/ }
                    {/*    <MyDisclosureContainer>*/ }
                    {/*        <MyDisclosure title={ t("showMeHowItsDone") }>*/ }
                    {/*            <table class={ "table" }>*/ }
                    {/*                <tbody>*/ }
                    {/*                    <For each={ fetchResult()?.orderOperations }>{*/ }
                    {/*                        (operation, index) => (*/ }
                    {/*                            <tr class={ "border-b border-dotted border-gray-500" }>*/ }
                    {/*                                <td>{ index() + 1 }:</td>*/ }
                    {/*                                <td class={ "px-2" }>*/ }
                    {/*                                    /!*<For each={ diffChars(operation.before, operation.after) }>*!/*/ }
                    {/*                                    /!*    { (part) => (*!/*/ }
                    {/*                                    /!*        <span class={*!/*/ }
                    {/*                                    /!*            `${ part.added && "bg-green-500 dark:bg-green-700 default-text-black-white" } *!/*/ }
                    {/*                                    /!*            ${ part.removed && "bg-red-500 dark:bg-red-700 default-text-black-white" }` }>*!/*/ }
                    {/*                                    /!*        { part.value }*!/*/ }
                    {/*                                    /!*    </span>) }*!/*/ }
                    {/*                                    /!*</For>*!/*/ }
                    {/*                                    { typeof window !== "undefined" && window.outerWidth <= 640 &&*/ }
                    {/*                                        <p>{ t("using") }: { operation.law }</p> }*/ }
                    {/*                                </td>*/ }
                    {/*                                { typeof window !== "undefined" && window.outerWidth > 640 &&*/ }
                    {/*                                    <td>{ t("using") }: { operation.law }</td> }*/ }
                    {/*                            </tr>*/ }
                    {/*                        ) }*/ }
                    {/*                    </For>*/ }
                    {/*                </tbody>*/ }
                    {/*            </table>*/ }
                    {/*        </MyDisclosure>*/ }
                    {/*    </MyDisclosureContainer>*/ }
                    {/*}*/ }
                </div>
                {
                    fetchResult()?.expression &&
                    <>
                        {/*<div class={ "flex flex-row" }>*/ }
                        {/*    {*/ }
                        {/*        simplifyEnabled &&*/ }
                        {/*        <InfoBox className={ "w-fit mx-auto pb-1 text-lg text-center" }*/ }
                        {/*                 title={ t("output") + ":" } id={ "expression-output" }>*/ }
                        {/*            <p>{ fetchResult()?.after }</p>*/ }
                        {/*        </InfoBox>*/ }
                        {/*    }*/ }
                        {/*</div>*/ }

                        <div class={ "flex justify-center m-2" }>
                            <div id={ "table" } class={ "h-[45rem] overflow-auto" }>

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
    option: any,
    currentValue?: any,
    onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>,
}

const SingleMenuItem: Component<SingleMenuItem> = ({ option, currentValue, onClick }) => {
    return (<></>
        // <Menu.Item>
        //     <div
        //         class={ `hover:underline cursor-pointer last:mb-1 flex-row-center` }
        //         onClick={ onClick }>
        //         <Check
        //             className={ `${ currentValue.value !== option.value && "text-transparent" }` } />
        //         { option.name }
        //     </div>
        // </Menu.Item>
    );
}

render(() => <TruthTablePage />, document.getElementById("root") as HTMLElement);
