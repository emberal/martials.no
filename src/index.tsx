/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import type { Component } from "solid-js";

const HomePage: Component = () => {
    return (
        <>
            <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
        </>
    );
};

render(() => <HomePage />, document.getElementById("root") as HTMLElement);
