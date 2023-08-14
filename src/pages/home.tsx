/* @refresh reload */
import { For } from "solid-js/web";

import "../index.css";
import { type Component } from "solid-js";
import Layout from "../components/layout";
import Card from "../components/card";
import { Link } from "../components/link";

const apiRoot = "https://api.martials.no";

const cards = [
    {
        title: "API-er",
        children: <>
            <p>Sjekk ut mine API-er</p>
            <ul>
                <li>
                    <Link className={ "text-white" } to={ `${ apiRoot }/simplify-truths` }>
                        Forenkle sannhetsverdier
                    </Link>
                </li>
            </ul>
        </>,
        to: apiRoot,
        newTab: true,
    },
    {
        title: "Hjemmeside",
        children: <p>Sjekk ut mine andre prosjekter</p>,
        to: "https://emberal.github.io/",
        newTab: true,
    },
    {
        title: "Forenkle sannhetsverdier",
        children: <p>Implementering av API</p>,
        to: `/simplify-truths`,
    }
] satisfies CardProps[];

const HomePage: Component = () => (
    <Layout title={ "Velkommen!" }>
        <div class={ "flex flex-wrap justify-center mt-10" }>
            <For each={ cards }>
                { card =>
                    <Card title={ card.title } className={ "m-4" } to={ card.to } newTab={ card.newTab }>
                        { card.children }
                    </Card>
                }
            </For>
        </div>
    </Layout>
);

export default HomePage;
