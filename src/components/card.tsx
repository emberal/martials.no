/* @refresh reload */
import { type Component } from "solid-js"
import { Link } from "./link"

const Card: Component<CardProps> = ({ children, className, title, to, newTab = false }) => (
  <div
    class={`relative h-32 w-72 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 ${className}`}
  >
    <div class={"relative p-5"}>
      <Link className={"text-white"} to={to} newTab={newTab}>
        <h3 class={"mx-auto w-fit text-center before:content-['↗']"}>{title}</h3>
      </Link>
      {children}
    </div>
  </div>
)

export default Card
