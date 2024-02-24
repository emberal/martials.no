/* @refresh reload */
import { type Component } from "solid-js"
import Header from "./header"
import Footer from "./footer"

const Layout: Component<TitleProps> = ({ children, title, className }) => (
  <div class={`relative min-h-screen bg-default-bg font-mono text-white ${className}`}>
    <div class="container mx-auto">
      <Header className={"py-3"} title={title} />
      <main>
        <div class={"pb-28"}>{children}</div>
        <Footer />
      </main>
    </div>
  </div>
)

export default Layout
