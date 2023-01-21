/* @refresh reload */
import Layout from "./components/layout";
import { Input } from "./components/input";
import { Icon } from "solid-heroicons";
import TruthTable from "./components/truth-table";
import { InfoBox, MyDisclosure, MyDisclosureContainer } from "./components/output";
import { diffChars } from "diff";
import MyMenu from "./components/menu";
import type { FetchResult } from "./types/interfaces";
import { type Accessor, type Component, createSignal, JSX, onMount, Show } from "solid-js";
import { For, render } from "solid-js/web";
import Row from "./components/row";
import {
    arrowDownTray, arrowPath,
    check,
    eye,
    eyeSlash,
    funnel,
    magnifyingGlass,
    xMark
} from "solid-heroicons/solid";
import { Button, MySwitch } from "./components/button";
import MyDialog from "./components/dialog";
import { exportToExcel } from "./functions/export";

type Option = { name: string, value: "NONE" | "TRUE" | "FALSE" | "DEFAULT" | "TRUE_FIRST" | "FALSE_FIRST" };

// TODO move some code to new components
const TruthTablePage: Component = () => {

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

    const [hideValues, setHideValues] = createSignal(hideOptions[0]);

    const sortOptions: Option[] = [
        { name: "Sort by default", value: "DEFAULT" },
        { name: "Sort by true first", value: "TRUE_FIRST" },
        { name: "Sort by false first", value: "FALSE_FIRST" },
    ];

    const [sortValues, setSortValues] = createSignal(sortOptions[0]);

    const [isLoaded, setIsLoaded] = createSignal<boolean | null>(null);

    const [error, setError] = createSignal<string | null>(null);

    /**
     * Updates the state of the current expression to the new search with all whitespace removed.
     * If the element is not found, reset.
     */
    function onClick(e: { preventDefault: () => void; }): void {
        e.preventDefault(); // Stops the page from reloading onClick
        let exp = getInputElement()?.value;

        exp = exp.replaceAll("|", "/")

        if (exp) {
            history.pushState(null, "", `?exp=${ encodeURIComponent(exp) }`);
            getFetchResult(exp).then(null);
        }
    }

    async function getFetchResult(exp: string): Promise<void> {
        setFetchResult(null);

        if (exp !== "") {
            setError(null);
            setIsLoaded(false);
            fetch(`https://api.martials.no/simplify-truths/do/simplify/table?exp=${ encodeURIComponent(exp) }&simplify=${ simplifyEnabled() }
            &hide=${ hideValues().value }&sort=${ sortValues().value }`)
                .then(res => res.json())
                .then(res => setFetchResult(res))
                .catch(err => setError(err.toString()))
                .finally(() => setIsLoaded(true));
        }
    }

    const inputId = "truth-input";

    function getInputElement(): HTMLInputElement | null {
        return document.getElementById(inputId) as HTMLInputElement | null;
    }

    function onTyping(): void {
        const el = getInputElement();
        if (el && (el.value !== "") !== typing()) {
            setTyping(el.value !== "");
        }
    }

    function clearSearch(): void {
        const el = getInputElement();
        if (el) {
            el.value = "";
            setTyping(false);
            history.replaceState(null, "", location.pathname);
            el.focus();
        }
    }

    const tableId = "truth-table";
    const filenameId = "excel-filename";

    onMount((): void => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has("exp")) {
            const exp = searchParams.get("exp");
            if (exp !== "") {
                getInputElement().value = exp;
                getFetchResult(exp).then(null);
            }
        }

        // Focuses searchbar on load
        getInputElement()?.focus();
    });

    function _exportToExcel(): void {
        const value = (document.getElementById(filenameId) as HTMLInputElement | null)?.value;
        exportToExcel({
            name: value !== "" ? value : undefined, tableId
        });
    }

    return (
        <Layout title={ "Truth tables" }>

            <div id={ "truth-content" }>
                <div class={ "max-w-2xl mx-auto" }>
                    <MyDisclosureContainer>
                        <MyDisclosure title={ "How to" }>
                            <p>{ `Fill in a truth expression and it will be simplified for you as much as possible.
                            It will also genereate a truth table with all possible values. You can use a single letter,
                             word or multiple words without spacing for each atomic value. 
                            If you do not want to simplify the expression, simply turn off the toggle.
                            Keywords for operators are defined below. Parentheses is also allowed` }</p>
                        </MyDisclosure>
                        <MyDisclosure title={ "Keywords" }>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Not:</td>
                                        <td>!</td>
                                    </tr>
                                    <tr>
                                        <td>And:</td>
                                        <td>&</td>
                                    </tr>
                                    <tr>
                                        <td>Or:</td>
                                        <td>|</td>
                                        <td>/</td>
                                    </tr>
                                    <tr>
                                        <td class={ "pr-2" }>Implication:</td>
                                        <td>{ "->" }</td>
                                    </tr>
                                </tbody>
                            </table>
                        </MyDisclosure>
                    </MyDisclosureContainer>

                    <form class={ "flex-row-center" } onSubmit={ onClick } autocomplete={ "off" }>

                        <Input className={ `rounded-xl pl-7 h-10 w-52 sm:w-96 pr-8` }
                               id={ "truth-input" }
                               placeholder={ "¬A & B -> C" }
                               type={ "text" }
                               onChange={ onTyping }
                               leading={ <Icon path={ magnifyingGlass } aria-label={ "Magnifying glass" }
                                               class={ "pl-2 absolute" } /> }
                               trailing={ <Show when={ typing() } keyed>
                                   <button class={ "absolute left-44 sm:left-[22rem]" }
                                           title={ "Clear" }
                                           type={ "reset" }
                                           onClick={ clearSearch }>
                                       <Icon path={ xMark } aria-label={ "The letter X" } />
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
                                            <Icon path={ eyeSlash } aria-label={ "An eye with a slash through it" }
                                                  class={ `mx-1 ${ hideValues().value === "TRUE" ?
                                                      "text-green-500" : "text-red-500" }` } />
                                        } fallback={
                                            <Icon path={ eye } aria-label={ "An eye" } class={ "mx-1" } />
                                        } keyed />
                                    }
                                    children={
                                        <For each={ hideOptions }>
                                            { (option) => (
                                                <SingleMenuItem onClick={ () => setHideValues(option) }
                                                                option={ option }
                                                                currentValue={ hideValues } />
                                            ) }
                                        </For>
                                    } itemsClassName={ "right-0" }
                            />
                        </div>

                        <div class={ "h-min relative" }>
                            <MyMenu title={ "Sort results" } id={ "sort-results" }
                                    button={ <Icon path={ funnel } aria-label={ "Filter" }
                                                   class={ `h-6 w-6 ${ sortValues().value === "TRUE_FIRST" ? "text-green-500" :
                                                       sortValues().value === "FALSE_FIRST" && "text-red-500" }` } /> }
                                    children={
                                        <For each={ sortOptions }>
                                            { (option) => (
                                                <SingleMenuItem option={ option } currentValue={ sortValues }
                                                                onClick={ () => setSortValues(option) } />
                                            ) }
                                        </For>
                                    }
                                    itemsClassName={ "right-0" }
                            />
                        </div>

                        <Show when={ isLoaded() } keyed>

                            <MyDialog title={ "Download" }
                                      description={ "Export current table (.xlsx)" }
                                      button={ <>
                                          <p class={ "sr-only" }>{ "Download" }</p>
                                          <Icon aria-label={ "Download" } path={ arrowDownTray } />
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

                    <Show when={ isLoaded() === false } keyed>
                        <Icon path={ arrowPath } aria-label={ "Loading indicator" } class={ "animate-spin mx-auto" } />
                    </Show>

                    <Show when={ error() } keyed>
                        <ErrorBox title={ "Fetch error" } error={ error() } />
                    </Show>

                    <Show when={ error() === null && isLoaded() && fetchResult()?.status.code !== 200 } keyed>
                        <ErrorBox title={ "Input error" } error={ fetchResult()?.status.message } />
                    </Show>

                    <Show when={ simplifyEnabled() && fetchResult()?.orderOperations?.length > 0 } keyed>

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

                    </Show>

                </div>

                <Show when={ isLoaded() && fetchResult()?.status?.code === 200 } keyed>
                    <Show when={ simplifyEnabled() } keyed>
                        <InfoBox className={ "w-fit mx-auto pb-1 text-lg text-center" }
                                 title={ "Output" + ":" } id={ "expression-output" }>
                            <p>{ fetchResult()?.after }</p>
                        </InfoBox>
                    </Show>

                    <div class={ "flex justify-center m-2" }>
                        <div id={ "table" } class={ "h-[45rem] overflow-auto" }>

                            <TruthTable header={ fetchResult()?.header }
                                        table={ fetchResult()?.table?.truthMatrix } id={ tableId } />

                        </div>
                    </div>
                </Show>

            </div>

        </Layout>
    );
}

export default TruthTablePage;

interface SingleMenuItem {
    option: Option,
    currentValue?: Accessor<Option>,
    onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>,
}

const SingleMenuItem: Component<SingleMenuItem> = ({ option, currentValue, onClick }) => {
    const isSelected = () => currentValue()?.value === option.value;
    return (
        <button class={ `hover:underline cursor-pointer last:mb-1 flex-row-center` }
                onClick={ onClick }>
            <Icon path={ check } aria-label={ isSelected() ? "A checkmark" : "Nothing" }
                  class={ `text-white ${ !isSelected() && "text-transparent" }` } />
            { option.name }
        </button>
    );
}

const ErrorBox: Component<{ title: string, error: string }> = ({ title, error }) => {
    return (
        <InfoBox className={ "w-fit text-center mx-auto" }
                 title={ title }
                 error={ true }>
            <p>{ error }</p>
        </InfoBox>
    )
}

render(() => <TruthTablePage />, document.getElementById("root") as HTMLElement);
