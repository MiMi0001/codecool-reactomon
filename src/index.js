import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {useRouteError} from "react-router-dom";
import {Outlet, Link} from "react-router-dom";
import {Form, useLoaderData} from "react-router-dom";
import styled from "styled-components";


const MainDiv = styled.div`
  background-image: linear-gradient(to left, burlywood, goldenrod);
`

const ContainerDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: start;
  height: 550px;
`

const CardDiv = styled.div`
    background-image: linear-gradient(to left, palegoldenrod, lightseagreen);
    border-radius: 25px;
    background-color: mediumpurple;
    color: wheat;
    width: 150px;
    height: 150px;
    text-align: center;
    font-size: 1.5em;
    border-style: groove;
    border-width: 7px;
    border-color: goldenrod;
    margin: 10px;
`

const NavDiv = styled.div`
    background-image: linear-gradient(to left, palegoldenrod, lightseagreen);
    font-size: 1.5em;
    height: 100px;
    
`

const NavButton = styled.button`
    background-image: linear-gradient(to left, coral, lightseagreen);
    border-radius: 25px;
    border-style: groove;
    border-width: 10px;
    border-color: coral;
    color: white;
    font-size: 1.5em;
    margin: 25px;
`

async function pokemonListLoader() {
    let response = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
    let pokemons = response.data['results'];

    for (let i=0; i<pokemons.length; i++) {
        let detailResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
        let detailData = detailResponse.data;
        let image_url = detailData.sprites.front_default;
        pokemons[i]["image"]=image_url;
    }

    return response.data['results'];
}


async function typeListLoader() {
    let response = await axios.get("https://pokeapi.co/api/v2/type");
    return await response.data['results'];

}


async function pokemonLoader({params}) {
    let id = params.pokemonId;
    let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
}


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
        <MainDiv>
            <div id="nav">
                <NavBar/>
            </div>

            <div id="content">
                <Outlet/>
            </div>
        </MainDiv>
    )
}


function NavBar() {
    return (
        <NavDiv>
            <NavButton> <Link to={"/pokemons"}> Pokemons </Link> </NavButton>
            <NavButton> <Link to={"/types"}> Types </Link> </NavButton>
        </NavDiv>
    );
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
        <ContainerDiv>
            {
                pokemons.map((pokemon, index) =>
                    <CardDiv>
                        <Link to={`/pokemon/${index + 1}`}> {pokemon.name} </Link>
                        <img src={pokemon.image}/>
                    </CardDiv>)
            }
        </ContainerDiv>
    )
}



function TypeList() {
    let types = useLoaderData();
    return (
        <ul>
            {types.map((type, index) =>
                <li key={index}> {type.name} </li>
            )
            }
        </ul>
    )
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
                loader: pokemonListLoader
            },
            {
                path: "/types",
                element: <TypeList/>,
                loader: typeListLoader
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
