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
import { useRouteError } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

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


class PokemonApp extends React.Component {
    render() {
        return (
            <div>
                <div id ="nav">
                    <NavBar />
                </div>

                <div id = "content">
                    <Outlet />
                </div>
            </div>
         )
    }
}


class NavBar extends React.Component {
    render() {
        return (
            <ul>
                <li> <Link to={"/pokemons"}> Pokemons </Link> </li>
                <li> <Link to={"/types"}> Types </Link></li>
            </ul>
        );
    }
}


class PokemonList extends React.Component {
    state = {
        pokemons: []
    }

    componentDidMount() {
        axios.get(`https://pokeapi.co/api/v2/pokemon`)
            .then(response => {
                const pokemons = response.data['results'];
                this.setState({ pokemons });
            })
    }

    render() {
        return (
            <ul>
                {
                    this.state.pokemons
                        .map(pokemon =>
                            <li key={pokemon.name}>{pokemon.name}:  {pokemon.url}</li>
                        )
                }
            </ul>
        )
    }
}

class TypeList extends React.Component{
    state = {
        types : []
    }

    componentDidMount() {
        axios.get("https://pokeapi.co/api/v2/type").then((response)=> {
            let types = response.data['results'];
            this.setState({types: types});
        });
    }

    render() {
        return(
             <ul>
                 {this.state.types
                     .map((type, index)=>
                        <li key={index}> {type.name} </li>
                     )
                 }
             </ul>
        )
    }


}


const router = createBrowserRouter([
    {
        path: "/",
        element: <PokemonApp />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/pokemons",
                element: <PokemonList />
            },
            {
                path: "/types",
                element: <TypeList />
            }
        ]
    },


]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( <React.StrictMode>
            <RouterProvider router={router} />
            </React.StrictMode>
            );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
