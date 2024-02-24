/* @refresh reload */
import { type Component, createSignal } from "solid-js"

interface SwitchProps extends TitleProps {
  defaultValue?: boolean
  onChange?: (value: boolean) => void
}

export const MySwitch: Component<SwitchProps> = ({
  defaultValue = false,
  title,
  onChange,
  className,
  name,
  id
}) => {
  const [checked, setChecked] = createSignal(defaultValue)

  function handleChange() {
    const newChecked = !checked()
    setChecked(newChecked)
    if (onChange) {
      onChange(newChecked)
    }
  }

  return (
    <button
      id={id}
      onClick={handleChange}
      title={title}
      class={`${checked() ? "bg-cyan-900" : "bg-gray-500"} relative my-2 inline-flex h-6 w-11 items-center rounded-full ${className}`}
    >
      <span class={"sr-only"}>{name}</span>
      <span
        class={`${checked() ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-all`}
      />
    </button>
  )
}

export const Button: Component<ButtonProps> = ({
  className,
  title,
  children,
  id,
  onClick,
  type = "button"
}) => (
  <button
    title={title}
    id={id}
    type={type}
    class={`border-rounded cursor-pointer bg-cyan-900 px-2 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)
