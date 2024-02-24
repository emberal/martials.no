/* @refresh reload */
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "solid-headless"
import { Icon } from "solid-heroicons"
import { type Component, JSX } from "solid-js"
import { chevronUp } from "solid-heroicons/solid"

interface InfoBoxProps extends TitleProps {
  error?: boolean
}

export const InfoBox: Component<InfoBoxProps> = ({ title, children, error = false, className }) => (
  <div class={`border-rounded ${error ? "border-red-500" : "border-gray-500"} ${className}`}>
    <p class={`border-b px-2 ${error ? "border-red-500" : "border-gray-500"}`}>{title}</p>
    <div class={"mx-2"}>{children}</div>
  </div>
)

interface MyDisclosureProps extends TitleProps {
  defaultOpen?: boolean
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

export const MyDisclosure: Component<MyDisclosureProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
  id,
  onClick
}): JSX.Element => (
  <div id={id} class={`border-rounded bg-default-bg ${className}`}>
    <Disclosure defaultOpen={defaultOpen}>
      {({ isOpen }) => (
        <>
          <DisclosureButton onClick={onClick} class={`flex-row-center w-full justify-between px-2`}>
            <p class={`py-1`}>{title}</p>
            <Icon path={chevronUp} class={`w-5 ${isOpen() && "rotate-180 transform"} transition`} />
          </DisclosureButton>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            show
          >
            <DisclosurePanel>
              <div class={"px-2 pb-2 text-gray-300"}>{children}</div>
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  </div>
)

export const MyDisclosureContainer: Component<ChildProps> = ({ children, className }) => (
  <div
    class={`border-rounded mb-2 flex flex-col gap-1
                                bg-cyan-900 p-2 dark:border-gray-800 ${className}`}
  >
    {children}
  </div>
)
