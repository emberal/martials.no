/* @refresh reload */
import { type Component, Show } from "solid-js"
import { Icon } from "solid-heroicons"
import { chevronLeft } from "solid-heroicons/solid"
import { Link } from "./link"
import { useLocation } from "@solidjs/router"

const Header: Component<TitleProps> = ({ className, title = "Title goes here" }) => {
  const location = useLocation()

  return (
    <header class={className}>
      <div class={"flex-row-center mx-auto w-fit"}>
        <Show when={location.pathname !== "/"} keyed>
          <Link to={"/"} newTab={false} title={"Back to homepage"}>
            <Icon path={chevronLeft} class={"text-cyan-500"} />
          </Link>
        </Show>

        <h1 class={"text-center text-cyan-500"}>{title}</h1>
      </div>
      <div class={"mx-auto w-fit"}>
        <p>Av Martin Berg Alstad</p>
      </div>
    </header>
  )
}

export default Header
