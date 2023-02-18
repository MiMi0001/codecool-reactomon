import React, {useState, useContext} from 'react';
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
import {useLoaderData} from "react-router-dom";
import styled from "styled-components";


const ThemeContext = React.createContext(['light', ()=>{}]);

const ContainerDiv = styled.div`
  background-image: ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "linear-gradient(to left, burlywood, goldenrod);" : "linear-gradient(to left, black, goldenrod);" 
      return result
      }}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: start;
  height: 700px;
`

const CardDiv = styled.div`
    background-image:  ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "linear-gradient(to left, palegoldenrod, lightseagreen);" : "linear-gradient(to top, black, lightseagreen);"
      return result
    }}
    border-radius: 25px;
    color: wheat;
    border-color: ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "goldenrod;" : "darkslateblue;"
      return result
    }}
    border-style: groove;
    border-width: 7px;
    width: 150px;
    height: 140px;
    text-align: center;
    font-size: 1.5em;
    margin: 10px;
`

const NavDiv = styled.div`
    background-image: ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "linear-gradient(to left, palegoldenrod, lightseagreen);" : "linear-gradient(to left, black, lightseagreen);"
      return result
    }}
    font-size: 1.5em;
    height: 100px;   
`

const NavButton = styled.button`
    background-image: linear-gradient(to left, coral, lightseagreen);
    color: white;
    border-color: coral;
    border-radius: 25px;
    border-style: groove;
    border-width: 10px;
    font-size: 1.5em;
    margin: 25px;
`

const StyledThemeButton = styled.button`
    background-image: ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "linear-gradient(to left, darkslateblue, black);" : "linear-gradient(to left, deepskyblue, navajowhite);"
      return result
    }}
    color: ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "yellowgreen;" : "darkblue;"
      return result
    }}
    border-color: ${ () => {
      let theme = useContext(ThemeContext)[0];
      let result = (theme === 'light') ? "darkslateblue;" : "goldenrod;"
      return result
    }}
    border-radius: 25px;
    border-style: groove;
    border-width: 10px;
    font-size: 1.5em;
    margin: 25px;
    position: relative;
    left: 675px;
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
    let theme = useState("light");
    return (
        <ThemeContext.Provider value={theme}>
            <div>
                <div id="nav">
                    <NavBar/>
                </div>
                <ContainerDiv id="content">
                    <Outlet/>
                </ContainerDiv>
            </div>
        </ThemeContext.Provider>
    )
}


function NavBar() {
    return (
        <NavDiv>
            <NavButton> <Link to={"/pokemons"}> Pokemons </Link> </NavButton>
            <NavButton> <Link to={"/types"}> Types </Link> </NavButton>
            <ThemeButton />
        </NavDiv>
    );
}


function ThemeButton() {
    let [theme, setTheme] = useContext(ThemeContext);
    return(
        <StyledThemeButton onClick = { ()=> { setTheme( theme==='light' ? 'dark' : 'light') } } >
            {theme === 'light' ? 'Dark' : 'Light'}
        </StyledThemeButton>
    )
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
                        <img src={pokemon.image} alt=""/>
                    </CardDiv>)
            }
        </ContainerDiv>
    )
}



function TypeList() {
    let types = useLoaderData();
    return (
        <ContainerDiv>
            <ul>
                {types.map((type, index) =>
                    <li key={index}> {type.name} </li>
                )
                }
            </ul>
        </ContainerDiv>
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
            <img src={image_url} width="250" alt=""></img>
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
