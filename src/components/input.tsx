/* @refresh reload */
import { type Component, createSignal, JSX, onMount, Setter, Show } from "solid-js"
import Row from "./row"
import { Icon } from "solid-heroicons"
import { magnifyingGlass, xMark } from "solid-heroicons/solid"
import { getElementById } from "../utils/dom"

function setupEventListener(id: string, setIsHover: Setter<boolean>): () => void {
  let isMounted = true

  function hover(hover: boolean): void {
    if (isMounted) {
      setIsHover(hover)
    }
  }

  const el = getElementById(id)
  el?.addEventListener("pointerenter", () => hover(true))
  el?.addEventListener("pointerleave", () => hover(false))

  return () => {
    el?.removeEventListener("pointerenter", () => hover(true))
    el?.removeEventListener("pointerleave", () => hover(false))
    isMounted = false
  }
}

/**
 * Sets isText to 'true' or 'false' using the setIsText function.
 * if the value of the input element is not empty and it's different from the current value
 */
function setSetIsText(id: string | undefined, isText: boolean, setIsText: Setter<boolean>): void {
  if (id) {
    const el = getElementById<HTMLInputElement | HTMLTextAreaElement>(id)
    if (el && (el.value !== "") !== isText) {
      setIsText(el.value !== "")
    }
  }
}

interface Input<T extends HTMLElement> extends InputProps<T> {
  leading?: JSX.Element
  trailing?: JSX.Element
  onChange?: () => void
  inputClass?: string
}

export const Input: Component<Input<HTMLInputElement>> = (
  // TODO remove leading and trailing from component
  {
    className,
    id,
    name,
    type = "text",
    title,
    placeholder,
    required = false,
    onChange,
    leading,
    trailing,
    inputClass,
    ref
  }
): JSX.Element => {
  /**
   * Is 'true' if the input element is in focus
   */
  const [isFocused, setIsFocused] = createSignal(false)
  /**
   * Is 'true' if the user is hovering over the input element
   */
  const [isHover, setIsHover] = createSignal(false)
  /**
   * Is 'true' if the input element contains any characters
   */
  const [isText, setIsText] = createSignal(false)

  onMount(() => {
    if (id && title) {
      setupEventListener(id, setIsHover)
    }
  })

  return (
    <Row className={`relative ${className}`}>
      {leading}
      <HoverTitle title={title} isActive={isFocused() || isHover() || isText()} htmlFor={id} />
      <input
        class={`border-2 border-gray-500 bg-default-bg outline-none hover:border-t-cyan-400 
                focus:border-cyan-500 ${inputClass}`}
        id={id}
        ref={ref}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        name={name ?? undefined}
        type={type}
        placeholder={placeholder ?? undefined}
        required={required}
        onInput={() => {
          setSetIsText(id, isText(), setIsText)
          if (onChange) {
            onChange()
          }
        }}
      />
      {trailing}
    </Row>
  )
}

const HoverTitle: Component<{ title?: string; isActive?: boolean; htmlFor?: string }> = ({
  title,
  isActive = false,
  htmlFor
}) => (
  <label
    class={`pointer-events-none absolute
                 ${isActive ? "default-bg -top-2 left-3 text-sm" : "left-2 top-1"} 
            text-gray-600 transition-all duration-150 dark:text-gray-400`}
    for={htmlFor}
  >
    <div class={"relative z-50"}>{title}</div>
    <div class={"default-bg absolute bottom-1/3 z-10 h-2 w-full"} />
  </label>
)

interface SearchProps extends InputProps {
  typingDefault?: boolean
}

export const Search: Component<SearchProps> = ({
  typingDefault = false,
  id = "search",
  className,
  ref
}) => {
  const [typing, setTyping] = createSignal(typingDefault)

  function getInputElement() {
    return getElementById<HTMLInputElement>(id)
  }

  function clearSearch(): void {
    const el = getInputElement()
    if (el) {
      el.value = ""
      setTyping(false)
      history.replaceState(null, "", location.pathname)
      el.focus()
    }
  }

  function onChange(): void {
    const el = getInputElement()
    if (el && (el.value !== "") !== typing()) {
      setTyping(el.value !== "")
    }
  }

  return (
    <Input
      inputClass={`rounded-xl pl-7 h-10 w-full pr-8`}
      className={`w-full ${className}`}
      id={id}
      ref={ref}
      placeholder={"¬A & B -> C"}
      type={"text"}
      onChange={onChange}
      leading={
        <Icon path={magnifyingGlass} aria-label={"Magnifying glass"} class={"absolute pl-2"} />
      }
      trailing={
        <Show when={typing()} keyed>
          <button class={"absolute right-2"} title={"Clear"} type={"reset"} onClick={clearSearch}>
            <Icon path={xMark} aria-label={"The letter X"} />
          </button>
        </Show>
      }
    />
  )
}
