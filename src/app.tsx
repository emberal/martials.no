import { Route, Router } from "@solidjs/router"
import HomePage from "./pages/home"
import TruthTablePage from "./pages/truth-table"
import PageNotFound from "./pages/404"
import { render } from "solid-js/web"
import FailureFunctionPage from "./pages/failureFunction"

render(
  () => (
    <Router>
      <Route path={"/"} component={HomePage} />
      <Route path={"/simplify-truths"} component={TruthTablePage} />
      <Route path={"/failure-function"} component={FailureFunctionPage} />
      <Route path={"*"} component={PageNotFound} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)
