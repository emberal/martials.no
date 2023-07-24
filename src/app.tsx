import { Route, Router, Routes } from "@solidjs/router";
import HomePage from "./pages/home";
import TruthTablePage from "./pages/truth-table";
import PageNotFound from "./pages/404";
import { render } from "solid-js/web";
import { type Component } from "solid-js";

const App: Component = () => (
    <Routes>
        <Route path={ "/" } element={ <HomePage /> } />
        <Route path={ "/simplify-truths" } element={ <TruthTablePage /> } />
        <Route path={ "*" } element={ <PageNotFound /> } />
    </Routes>
);

render(
    () => (
        <Router>
            <App />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
