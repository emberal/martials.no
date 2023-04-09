/* @refresh reload */
import Layout from "./components/layout";
import { Input, Search } from "./components/input";
import { Icon } from "solid-heroicons";
import TruthTable from "./components/truth-table";
import { InfoBox, MyDisclosure, MyDisclosureContainer } from "./components/output";
import { diffChars } from "diff";
import MyMenu from "./components/menu";
import type { FetchResult, OrderOfOperation } from "./types/types";
import { type Accessor, type Component, createSignal, JSX, onMount, Show } from "solid-js";
import { For, render } from "solid-js/web";
import Row from "./components/row";
import {
    arrowDownTray, arrowPath,
    check,
    eye,
    eyeSlash,
    funnel
} from "solid-heroicons/solid";
import { Button, MySwitch } from "./components/button";
import MyDialog from "./components/dialog";
import { exportToExcel } from "./utils/export";
import { Link } from "./components/link";
import { isTouch } from "./utils/touch";
import { replaceOperators } from "./utils/expressionUtils";
import { getElementById } from "./utils/dom";

type Option = { name: string, value: "NONE" | "TRUE" | "FALSE" | "DEFAULT" | "TRUE_FIRST" | "FALSE_FIRST" };

const fetchUrls = [
    "http://localhost:8080/simplify/table/",
    "https://api.martials.no/simplify-truths/do/simplify/table/"
];

// TODO move some code to new components
const TruthTablePage: Component = () => {

    let searchParams: URLSearchParams;
    let simplifyDefault = true, inputContent = false, hideIntermediate = false;

    if (typeof location !== "undefined") {
        searchParams = new URLSearchParams(location.search);

        if (searchParams.has("simplify")) {
            simplifyDefault = searchParams.get("simplify") === "true";
        }
        if (searchParams.has("exp")) {
            inputContent = true;
        }
        if (searchParams.has("hideIntermediate")) {
            hideIntermediate = searchParams.get("hideIntermediate") === "true";
        }
    }

    /**
     * Stores the boolean value of the simplify toggle
     */
    const [simplifyEnabled, setSimplifyEnabled] = createSignal(simplifyDefault);
    /**
     * The state element used to store the simplified string, "empty string" by default
     */
    const [fetchResult, setFetchResult] = createSignal<FetchResult | null>(null);

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

    const [hideIntermediates, setHideIntermediates] = createSignal(hideIntermediate);

    const [isLoaded, setIsLoaded] = createSignal<boolean | null>(null);

    const [error, setError] = createSignal<{ title: string, message: string } | null>(null);

    const [useLocalhost, setUseLocalhost] = createSignal(false);

    /**
     * Updates the state of the current expression to the new search with all whitespace removed.
     * If the element is not found, reset.
     */
    function onClick(e: { preventDefault: () => void; }): void {
        e.preventDefault(); // Stops the page from reloading onClick
        let exp = getInputElement()?.value;

        if (exp) {

            history.pushState(null, "", `?exp=${ encodeURIComponent(exp) }&simplify=${ simplifyEnabled() }&
hide=${ hideValues().value }&sort=${ sortValues().value }&hideIntermediate=${ hideIntermediates() }`);

            exp = replaceOperators(exp);

            getFetchResult(exp);
        }
    }

    function getFetchResult(exp: string | null): void {
        setFetchResult(null);

        if (exp && exp !== "") {
            setError(null);
            setIsLoaded(false);

            fetch(`${ fetchUrls[useLocalhost() ? 0 : 1] }${ encodeURIComponent(exp) }?
simplify=${ simplifyEnabled() }&hide=${ hideValues().value }&sort=${ sortValues().value }&caseSensitive=false&
hideIntermediate=${ hideIntermediates() }`)
                .then(res => res.json())
                .then(res => {
                    if (res.status !== "OK" && !res.ok) {
                        return setError({ title: "Input error", message: res.message });
                    }
                    return setFetchResult(res);
                })
                .catch(err => setError({ title: "Fetch error", message: err.toString() }))
                .finally(() => setIsLoaded(true));
        }
    }

    const inputId = "truth-input";

    function getInputElement(): HTMLInputElement | null {
        return getElementById(inputId);
    }

    onMount((): void => {

        const inputElement = getInputElement();

        if (searchParams.has("exp")) {
            const exp = searchParams.get("exp");
            if (exp && inputElement) {
                inputElement.value = exp;
            }
            const hide = searchParams.get("hide");
            if (hide) {
                setHideValues(hideOptions.find(o => o.value === hide) ?? hideOptions[0]);
            }
            const sort = searchParams.get("sort");
            if (sort) {
                setSortValues(sortOptions.find(o => o.value === sort) ?? sortOptions[0]);
            }

            getFetchResult(exp);
        }

        // Focuses searchbar on load
        if (!isTouch()) {
            inputElement?.focus();
        }
    });

    const tableId = "truth-table";
    const filenameId = "excel-filename";

    function _exportToExcel(): void {
        const value = getElementById<HTMLInputElement>(filenameId)?.value;
        exportToExcel({
            name: value !== "" ? value : undefined, tableId
        });
    }

    return (
        <Layout title={ "Truth tables" }>

            <Show when={ import.meta.env.DEV ?? false } keyed>
                (DEV) Use localhost:
                <MySwitch title={ "Use localhost" } defaultValue={ false }
                          onChange={ setUseLocalhost } />
            </Show>

            <div id={ "truth-content" }>
                <div class={ "max-w-2xl mx-auto" }>

                    <HowTo />

                    <form class={ "flex-row-center" } onSubmit={ onClick } autocomplete={ "off" }>

                        <Search id={ inputId } typingDefault={ inputContent } />

                        <Button id={ "truth-input-button" }
                                title={ "Generate (Enter)" }
                                type={ "submit" }
                                className={ "min-w-50px h-10 ml-2" }
                                children={ "Generate" } />

                    </form>

                    { /* Options row */ }
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

                        <MySwitch title={ "Hide intermediate values" }
                                  onChange={ setHideIntermediates }
                                  defaultValue={ hideIntermediates() } />

                        <Show when={ isLoaded() && error() === null } keyed>

                            <MyDialog title={ "Download" }
                                      description={ "Export current table (.xlsx)" }
                                      button={ <>
                                          <p class={ "sr-only" }>{ "Download" }</p>
                                          <Icon aria-label={ "Download" } path={ arrowDownTray } />
                                      </> }
                                      callback={ _exportToExcel }
                                      acceptButtonName={ "Download" }
                                      cancelButtonName={ "Cancel" }
                                      buttonClass={ `float-right` }
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

                    <Show when={ error() && isLoaded() } keyed>
                        <ErrorBox title={ error()?.title ?? "Error" }
                                  error={ error()?.message ?? "Something went wrong" } />
                    </Show>

                    <Show when={ simplifyEnabled() && (fetchResult()?.orderOperations?.length ?? 0) > 0 } keyed>
                        <ShowMeHow fetchResult={ fetchResult } />
                    </Show>

                </div>

                <Show when={ isLoaded() && error() === null } keyed>
                    <Show when={ simplifyEnabled() } keyed>
                        <InfoBox className={ "w-fit mx-auto pb-1 text-lg text-center" }
                                 title={ "Output:" } id={ "expression-output" }>
                            <p>{ fetchResult()?.after }</p>
                        </InfoBox>
                    </Show>

                    <div class={ "flex justify-center m-2" }>
                        <div id={ "table" } class={ "h-[45rem] overflow-auto" }>

                            <TruthTable header={ fetchResult()?.header ?? undefined }
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

const SingleMenuItem: Component<SingleMenuItem> = (
    {
        option,
        currentValue,
        onClick
    }) => {
    const isSelected = () => currentValue && currentValue().value === option.value;
    return (
        <button class={ `hover:underline cursor-pointer last:mb-1 flex-row-center` }
                onClick={ onClick }>
            <Icon path={ check } aria-label={ isSelected() ? "A checkmark" : "Nothing" }
                  class={ `text-white ${ !isSelected() && "invisible" }` } />
            { option.name }
        </button>
    );
}

const ErrorBox: Component<{ title: string, error: string }> = ({ title, error }) => (
    <InfoBox className={ "w-fit text-center mx-auto" }
             title={ title }
             error={ true }>
        <p>{ error }</p>
    </InfoBox>
);

interface ShowMeHowProps {
    fetchResult: Accessor<FetchResult | null>,
}

const ShowMeHow: Component<ShowMeHowProps> = ({ fetchResult }) => (
    <MyDisclosureContainer>
        <MyDisclosure title={ "Show me how it's done" }>
            <table class={ "table" }>
                <tbody>

                    <For each={ fetchResult()?.orderOperations }>
                        { orderOperationRow() }
                    </For>

                </tbody>
            </table>
        </MyDisclosure>
    </MyDisclosureContainer>
);

const HowTo: Component = () => (
    <MyDisclosureContainer>

        <MyDisclosure title={ "How to" }>
            <p>Fill in a truth expression and it will be simplified for you as much as possible.
               It will also genereate a truth table with all possible values. You can use a single
               letter,
               word or multiple words without spacing for each atomic value.
               If you do not want to simplify the expression, simply turn off the toggle.
               Keywords for operators are defined below. Parentheses is also allowed.</p>
            <p>API docs can be found <Link to={ "https://api.martials.no/simplify-truths" }>here</Link>.
            </p>
        </MyDisclosure>

        <KeywordsDisclosure />

    </MyDisclosureContainer>
);

const orderOperationRow = () => (operation: OrderOfOperation, index: Accessor<number>) => (
    <tr class={ "border-b border-dotted border-gray-500" }>
        <td>{ index() + 1 }:</td>
        <td class={ "px-2" }>{

            <For each={ diffChars(operation.before, operation.after) }>
                { (part) => (
                    <span class={ `${ part.added && "bg-green-700" } ${ part.removed && "bg-red-700" }` }>
                            { part.value }
                        </span>
                ) }
            </For> }

            <Show when={ typeof window !== "undefined" && window.outerWidth <= 640 } keyed>
                <p>{ "using" }: { operation.law }</p>
            </Show>

        </td>
        <Show when={ typeof window !== "undefined" && window.outerWidth > 640 } keyed>
            <td>{ "using" }: { operation.law }</td>
        </Show>
    </tr>
);

const KeywordsDisclosure: Component = () => (
    <MyDisclosure title={ "Keywords" }>
        <table>
            <thead>
                <tr class={ "text-left" }>
                    <th>Name</th>
                    <th class={ "pr-2" }>API</th>
                    <th>Other</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Not:</td>
                    <td>!</td>
                    <td>NOT</td>
                </tr>
                <tr>
                    <td>And:</td>
                    <td>&</td>
                    <td>AND</td>
                </tr>
                <tr>
                    <td>Or:</td>
                    <td>:</td>
                    <td>|</td>
                    <td>/</td>
                    <td>OR</td>
                </tr>
                <tr>
                    <td class={ "pr-2" }>Implication:</td>
                    <td>{ "->" }</td>
                    <td class={ "px-2" }>IMPLICATION</td>
                    <td>IMP</td>
                </tr>
            </tbody>
        </table>
    </MyDisclosure>
);

render(() => <TruthTablePage />, document.getElementById("root") as HTMLElement);
