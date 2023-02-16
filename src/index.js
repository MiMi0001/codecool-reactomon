import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {useRouteError} from "react-router-dom";
import {Outlet, Link} from "react-router-dom";
import {Form, useLoaderData} from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    return (
        <div>
            <h1> Ohhh! A Pokemon error occurred! </h1>
            <p>
                <i>Error message: {error.statusText || error.message}</i>
            </p>
        </div>
    )
}


function PokemonApp() {
    return (
        <div>
            <div id="nav">
                <NavBar/>
            </div>

            <div id="content">
                <Outlet/>
            </div>
        </div>
    )
}


function NavBar() {
    return (
        <ul>
            <li><Link to={"/pokemons"}> Pokemons </Link></li>
            <li><Link to={"/types"}> Types </Link></li>
        </ul>
    );
}


async function listLoader() {
    let response = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
    return response.data['results'];
}

async function pokemonLoader({params}) {
    let id = params.pokemonId;
    let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
}

function PokemonList() {
    // state = {
    //     pokemons: []
    // }
    //
    // componentDidMount() {
    //     axios.get(`https://pokeapi.co/api/v2/pokemon`)
    //         .then(response => {
    //             const pokemons = response.data['results'];
    //             this.setState({ pokemons });
    //         })
    // }
    let pokemons = useLoaderData();
    return (
        <ul>
            {
                pokemons.map((pokemon, index) =>
                    <li key={index}><Link to={`/pokemon/${index + 1}`}> {pokemon.name} </Link></li>
                )
            }
        </ul>
    )
}

class TypeList extends React.Component {
    state = {
        types: []
    }

    componentDidMount() {
        axios.get("https://pokeapi.co/api/v2/type").then((response) => {
            let types = response.data['results'];
            this.setState({types: types});
        });
    }

    render() {
        return (
            <ul>
                {this.state.types
                    .map((type, index) =>
                        <li key={index}> {type.name} </li>
                    )
                }
            </ul>
        )
    }
}

function PokemonDetail() {
    let pokemon = useLoaderData();
    let image_url = pokemon.sprites.front_default;

    return (
        <div>
            <h4> Name: {pokemon.name}</h4>
            <h4> Height: {pokemon.height}</h4>
            <h4> Weight: {pokemon.weight}</h4>
            <h4> Base experience: {pokemon.base_experience}</h4>
            <img src={image_url} width="250"></img>
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <PokemonApp/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/pokemons",
                element: <PokemonList/>,
                loader: listLoader
            },
            {
                path: "/types",
                element: <TypeList/>
            },
            {
                path: "/pokemon/:pokemonId",
                element: <PokemonDetail/>,
                loader: pokemonLoader
            }
        ]
    },


]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
