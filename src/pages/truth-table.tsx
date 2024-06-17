/* @refresh reload */
import Layout from "../components/layout"
import { Input, Search } from "../components/input"
import { Icon } from "solid-heroicons"
import TruthTable from "../components/truth-table"
import { InfoBox, MyDisclosure, MyDisclosureContainer } from "../components/output"
import { diffChars } from "diff"
import MyMenu from "../components/menu"
import { type Accessor, type Component, createSignal, JSX, onMount, Show } from "solid-js"
import { For } from "solid-js/web"
import Row from "../components/row"
import { arrowDownTray, arrowPath, check, eye, eyeSlash, funnel } from "solid-heroicons/solid"
import { Button, MySwitch } from "../components/button"
import MyDialog from "../components/dialog"
import { exportToExcel } from "../utils/export"
import { Link } from "../components/link"
import { isTouch } from "../utils/touch"
import { replaceOperators } from "../utils/expressionUtils"
import { getElementById } from "../utils/dom"
import { useSearchParams } from "@solidjs/router"

type Option = {
  name: string
  value: "NONE" | "TRUE" | "FALSE" | "DEFAULT" | "TRUE_FIRST" | "FALSE_FIRST"
}

const fetchUrls = [
  "http://localhost:8000/simplify/table/",
  "https://api.martials.no/simplify-truths/v2/simplify/table/"
]

// TODO move some code to new components
const TruthTablePage: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  let inputElement: HTMLInputElement | undefined = undefined

  let simplifyDefault = searchParams.simplify === undefined || searchParams.simplify === "true",
    inputContent = !!searchParams.exp,
    hideIntermediate = searchParams.hideIntermediateSteps === "true"

  const [simplifyEnabled, setSimplifyEnabled] = createSignal(simplifyDefault)
  const [fetchResult, setFetchResult] = createSignal<FetchResult | null>(null)

  const hideOptions: Option[] = [
    { name: "Show all result", value: "NONE" },
    { name: "Hide true results", value: "TRUE" },
    { name: "Hide false results", value: "FALSE" }
  ]

  const [hideValues, setHideValues] = createSignal(hideOptions[0])

  const sortOptions: Option[] = [
    { name: "Sort by default", value: "DEFAULT" },
    { name: "Sort by true first", value: "TRUE_FIRST" },
    { name: "Sort by false first", value: "FALSE_FIRST" }
  ]

  const [sortValues, setSortValues] = createSignal(sortOptions[0])
  const [hideIntermediates, setHideIntermediates] = createSignal(hideIntermediate)
  const [isLoaded, setIsLoaded] = createSignal<boolean | null>(null)
  const [error, setError] = createSignal<{ title: string; message: string } | null>(null)
  const [useLocalhost, setUseLocalhost] = createSignal(false)

  /**
   * Updates the state of the current expression to the new search with all whitespace removed.
   * If the element is not found, reset.
   */
  function onClick(e: Event): void {
    e.preventDefault() // Stops the page from reloading onClick
    const exp = inputElement?.value

    if (exp) {
      setSearchParams({
        exp,
        simplify: simplifyEnabled(),
        hide: hideValues().value,
        sort: sortValues().value,
        hideIntermediateSteps: hideIntermediates()
      })

      void getFetchResult(exp)
    }
  }

  async function getFetchResult(exp: string | null): Promise<void> {
    setFetchResult(null)

    if (exp && exp !== "") {
      exp = replaceOperators(exp)
      setError(null)
      setIsLoaded(false)

      try {
        const response =
          await fetch(`${fetchUrls[useLocalhost() ? 0 : 1]}${encodeURIComponent(exp)}?
simplify=${simplifyEnabled()}&hide=${hideValues().value}&sort=${sortValues().value}&caseSensitive=false&
hideIntermediateSteps=${hideIntermediates()}`)

        const body = await response.json()
        if (!response.ok) {
          setError({
            title: "Input error",
            message: body.message
          })
        } else {
          const fetchResult: FetchResult = body
          setFetchResult(fetchResult)
        }
      } catch (e: any) {
        setError({
          title: "Error",
          message: e.message
        })
      } finally {
        setIsLoaded(true)
      }
    }
  }

  onMount((): void => {
    if (searchParams.exp) {
      const exp = searchParams.exp
      if (exp && inputElement) {
        inputElement.value = exp
      }
      const hide = searchParams.hide
      if (hide) {
        setHideValues(hideOptions.find((o) => o.value === hide) ?? hideOptions[0])
      }
      const sort = searchParams.sort
      if (sort) {
        setSortValues(sortOptions.find((o) => o.value === sort) ?? sortOptions[0])
      }

      void getFetchResult(exp)
    }

    // Focuses searchbar on load
    if (!isTouch()) {
      inputElement?.focus()
    }
  })

  const tableId = "truth-table"
  const filenameId = "excel-filename"

  function _exportToExcel(): void {
    const value = getElementById<HTMLInputElement>(filenameId)?.value
    exportToExcel({
      name: value !== "" ? value : undefined,
      tableId
    })
  }

  return (
    <Layout title={"Truth tables"}>
      <Show when={import.meta.env.DEV ?? false} keyed>
        (DEV) Use localhost:
        <MySwitch title={"Use localhost"} defaultValue={false} onChange={setUseLocalhost} />
      </Show>

      <div id={"truth-content"}>
        <div class={"mx-auto max-w-2xl"}>
          <HowTo />

          <form class={"flex-row-center"} onSubmit={onClick} autocomplete={"off"}>
            <Search ref={inputElement} typingDefault={inputContent} />

            <Button
              id={"truth-input-button"}
              title={"Generate (Enter)"}
              type={"submit"}
              className={"min-w-50px ml-2 h-10"}
              children={"Generate"}
            />
          </form>

          {/* Options row */}
          <Row className={"my-1 gap-2"}>
            <span class={"h-min"}>{"Simplify"}: </span>

            <MySwitch
              onChange={setSimplifyEnabled}
              defaultValue={simplifyEnabled()}
              title={"Simplify"}
              name={"Turn on/off simplify expressions"}
              className={"mx-1"}
            />

            <div class={"relative h-min"}>
              <MyMenu
                title={"Filter results"}
                id={"filter-results"}
                button={
                  <Show
                    when={hideValues().value !== "NONE"}
                    children={
                      <Icon
                        path={eyeSlash}
                        aria-label={"An eye with a slash through it"}
                        class={`mx-1 ${hideValues().value === "TRUE" ? "text-green-500" : "text-red-500"}`}
                      />
                    }
                    fallback={<Icon path={eye} aria-label={"An eye"} class={"mx-1"} />}
                    keyed
                  />
                }
                children={
                  <For each={hideOptions}>
                    {(option) => (
                      <SingleMenuItem
                        onClick={() => setHideValues(option)}
                        option={option}
                        currentValue={hideValues}
                      />
                    )}
                  </For>
                }
                itemsClassName={"right-0"}
              />
            </div>

            <div class={"relative h-min"}>
              <MyMenu
                title={"Sort results"}
                id={"sort-results"}
                button={
                  <Icon
                    path={funnel}
                    aria-label={"Filter"}
                    class={`h-6 w-6 ${
                      sortValues().value === "TRUE_FIRST"
                        ? "text-green-500"
                        : sortValues().value === "FALSE_FIRST" && "text-red-500"
                    }`}
                  />
                }
                children={
                  <For each={sortOptions}>
                    {(option) => (
                      <SingleMenuItem
                        option={option}
                        currentValue={sortValues}
                        onClick={() => setSortValues(option)}
                      />
                    )}
                  </For>
                }
                itemsClassName={"right-0"}
              />
            </div>

            <MySwitch
              title={"Hide intermediate values"}
              onChange={setHideIntermediates}
              defaultValue={hideIntermediates()}
            />

            <Show when={isLoaded() && error() === null} keyed>
              <MyDialog
                title={"Download"}
                description={"Export current table (.xlsx)"}
                button={
                  <>
                    <p class={"sr-only"}>{"Download"}</p>
                    <Icon aria-label={"Download"} path={arrowDownTray} />
                  </>
                }
                callback={_exportToExcel}
                acceptButtonName={"Download"}
                cancelButtonName={"Cancel"}
                buttonClass={`float-right`}
                buttonTitle={"Export current table"}
                acceptButtonId={"download-accept"}
              >
                <p>{"Filename"}:</p>
                <Input
                  className={"border-rounded h-10 px-2"}
                  id={filenameId}
                  placeholder={"Truth Table"}
                />
              </MyDialog>
            </Show>
          </Row>

          <Show when={error()} keyed>
            <ErrorBox
              title={error()?.title ?? "Error"}
              error={error()?.message ?? "Something went wrong"}
            />
          </Show>

          <Show when={isLoaded() === false} keyed>
            <Icon
              path={arrowPath}
              aria-label={"Loading indicator"}
              class={"mx-auto animate-spin"}
            />
          </Show>

          <Show when={simplifyEnabled() && (fetchResult()?.operations?.length ?? 0) > 0} keyed>
            <ShowMeHow fetchResult={fetchResult} />
          </Show>
        </div>

        <Show when={isLoaded() && error() === null && fetchResult()?.truthTable} keyed>
          <Show when={simplifyEnabled()} keyed>
            <InfoBox
              className={"mx-auto w-fit pb-1 text-center text-lg"}
              title={"Output:"}
              id={"expression-output"}
            >
              <p>{fetchResult()?.after}</p>
            </InfoBox>
          </Show>

          <div class={"m-2 flex justify-center"}>
            <div id={"table"} class={"h-[45rem] overflow-auto"}>
              <TruthTable
                header={fetchResult()!.truthTable!.header}
                table={fetchResult()!.truthTable!.truthMatrix}
                id={tableId}
              />
            </div>
          </div>
        </Show>
      </div>
    </Layout>
  )
}

export default TruthTablePage

interface SingleMenuItem {
  option: Option
  currentValue?: Accessor<Option>
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

const SingleMenuItem: Component<SingleMenuItem> = ({ option, currentValue, onClick }) => {
  const isSelected = () => currentValue?.().value === option.value
  return (
    <button class={`flex-row-center cursor-pointer last:mb-1 hover:underline`} onClick={onClick}>
      <Icon
        path={check}
        aria-label={isSelected() ? "A checkmark" : "Nothing"}
        class={`text-white ${!isSelected() && "invisible"}`}
      />
      {option.name}
    </button>
  )
}

const ErrorBox: Component<{ title: string; error: string }> = ({ title, error }) => (
  <InfoBox className={"mx-auto w-fit text-center"} title={title} error={true}>
    <p>{error}</p>
  </InfoBox>
)

interface ShowMeHowProps {
  fetchResult: Accessor<FetchResult | null>
}

const ShowMeHow: Component<ShowMeHowProps> = ({ fetchResult }) => (
  <MyDisclosureContainer>
    <MyDisclosure title={"Show me how it's done"}>
      <table class={"table"}>
        <tbody>
          <For each={fetchResult()?.operations}>{operationRow()}</For>
        </tbody>
      </table>
    </MyDisclosure>
  </MyDisclosureContainer>
)

const HowTo: Component = () => (
  <MyDisclosureContainer>
    <MyDisclosure title={"How to"}>
      <p>
        Fill in a truth expression and it will be simplified for you as much as possible. It will
        also genereate a truth table with all possible values. You can use a single letter, word or
        multiple words without spacing for each atomic value. If you do not want to simplify the
        expression, simply turn off the toggle. Keywords for operators are defined below.
        Parentheses is also allowed.
      </p>
      <p>
        API docs can be found <Link to={"https://api.martials.no/simplify-truths"}>here</Link>.
      </p>
    </MyDisclosure>

    <KeywordsDisclosure />
  </MyDisclosureContainer>
)

const operationRow = () => (operation: Operation, index: Accessor<number>) => (
  <tr class={"border-b border-dotted border-gray-500"}>
    <td>{index() + 1}:</td>
    <td class={"px-2"}>
      {
        <For each={diffChars(operation.before, operation.after)}>
          {(part) => (
            <span class={`${part.added && "bg-green-700"} ${part.removed && "bg-red-700"}`}>
              {part.value}
            </span>
          )}
        </For>
      }

      <Show when={typeof window !== "undefined" && window.outerWidth <= 640} keyed>
        <p>
          {"using"}: {operation.law}
        </p>
      </Show>
    </td>
    <Show when={typeof window !== "undefined" && window.outerWidth > 640} keyed>
      <td>
        {"using"}: {operation.law}
      </td>
    </Show>
  </tr>
)

const KeywordsDisclosure: Component = () => (
  <MyDisclosure title={"Keywords"}>
    <table>
      <thead>
        <tr class={"text-left"}>
          <th>Name</th>
          <th class={"pr-2"}>API</th>
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
          <td>|</td>
          <td>/</td>
          <td>OR</td>
        </tr>
        <tr>
          <td class={"pr-2"}>Implication:</td>
          <td>{"=>"}</td>
          <td class={"px-2"}>IMPLICATION</td>
          <td>IMP</td>
        </tr>
      </tbody>
    </table>
  </MyDisclosure>
)
