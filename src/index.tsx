/* @refresh reload */
import { For, render } from "solid-js/web";

import "./index.css";
import { type Component } from "solid-js";
import Layout from "./components/layout";
import Card from "./components/card";
import type { CardProps } from "./types/interfaces";

const cards = [
    {
        title: "API-er",
        children: <p>Sjekk ut mine API-er</p>,
        to: "https://api.martials.no/",
    },
    {
        title: "Hjemmeside",
        children: <p>Sjekk ut mine andre prosjekter</p>,
        to: "https://h600878.github.io/",
    }
] satisfies CardProps[];

const HomePage: Component = () => {
    return (
        <Layout title={ "Velkommen!" }>
            <div class={ "flex flex-wrap justify-center mt-10" }>
                <For each={ cards }>
                    { card =>
                        <Card title={ card.title } className={ "m-4" } to={ card.to }>{ card.children }</Card>
                    }
                </For>
            </div>
        </Layout>
    );
};

render(() => <HomePage />, document.getElementById("root") as HTMLElement);
