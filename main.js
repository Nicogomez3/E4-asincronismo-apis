const pokedexContainer = document.querySelector('.pokedex--container');
const form = document.getElementById('poke--form');
const inputPoke = document.getElementById('inputNumber');
const message = document.querySelector('.message');


// URL base


const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";


// Función para hacer la solicitud a la PokeAPI
const requestPokemon = async (pokemon) => {
  try {
    const response = await fetch(`${BASE_URL}${pokemon.toLowerCase()}`);
    if (!response.ok) {
      throw new Error('Pokémon not found');
      
  }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(`Hubo un error en la petición: ${error}`);
    return null;
  }
};



const typeColors = {
  electric: '#FFEA70',
  normal: '#B09398',
  fire: '#FF675C',
  water: '#0596C7',
  ice: '#AFEAFD',
  rock: '#999799',
  flying: '#7AE7C7',
  grass: '#4A9681',
  psychic: '#FFC6D9',
  ghost: '#561D25',
  bug: '#A2FAA3',
  poison: '#795663',
  ground: '#D2B074',
  dragon: '#DA627D',
  steel: '#1D8A99',
  fighting: '#2F2F2F',
  default: '#2A1A1F',
};


// Función para formatear los datos de la PokeAPI
const getPokeData = (pokeData) => {
  return {
    pokeName: pokeData.name,
    image: pokeData.sprites.front_default,
    types: pokeData.types.map(typeInfo => typeInfo.type.name).join(', '),
    height: pokeData.height / 10,
    weight: pokeData.weight / 10,
    stats: pokeData.stats.map(stat => ({
      name: stat.stat.name,
      base_stat: stat.base_stat
    }))
  };
  
};

// Función para crear la plantilla HTML del Pokémon
const createPokeTemplateHTML = (pokeData) => {
  const {
    pokeName,
    image,
    types,
    height,
    weight,
    stats
  } = pokeData;

  const mainType = types.split(', ')[0];
  const bgColor = typeColors[mainType] || typeColors.default;

  const statsHTML = stats.map(stat => `<p>${stat.name}: ${stat.base_stat}</p>`).join('');


  return `
  <div class="card">


      <img style="background-color: ${bgColor};" src="${image}" alt="${pokeName}"> 


    <div class="card--name">
      <h2>Nombre: ${pokeName}</h2>
    </div>
    
    <div class="info-container">
        <p>Altura: ${height} Cms</p>
        <p>Peso: ${weight} KG</p>
        <p>Tipo: ${types}</p>
        <p>Estadisticas:  ${statsHTML}  </p> 
    </div>

  </div>
  
  `;
};

// Función para renderizar la tarjeta del Pokémon en el HTML
const renderPokeCard = (pokeData) => {
  pokedexContainer.innerHTML = createPokeTemplateHTML(pokeData);
 
};


//Funcion para manejar el mensaje de error 

const handleError = (error, searchedPokemon) => {
  message.textContent = `No se encontró el Pokémon "${searchedPokemon}". Por favor, verifica el numero e inténtalo de nuevo.`;
  pokedexContainer.innerHTML = `
  <div class="img--notfound">
    <img src="./assets/img/error.png" alt="error">
  </div>
  ` ;
  console.log(pokedexContainer.innerHTML)
  form.reset();
};


// Función para buscar el Pokémon
const searchPokemon = async (e) => {
  e.preventDefault();
  const searchedPokemon = inputPoke.value.trim();

  console.log(`Buscando Pokémon: ${searchedPokemon}`);

  if (searchedPokemon === "") {
    message.textContent = "Por favor ingrese un Pokémon.";
    pokedexContainer.innerHTML= `
    <div class="img--notfound">
      <img src="./assets/img/notfound2.png" alt="error">
    </div>
    ` ;
    return;
  }

  const fetchedPoke = await requestPokemon(searchedPokemon);


  if (!fetchedPoke) {
    handleError(null, searchedPokemon);
    pokedexContainer.innerHTML =  `
    <div class="img--notfound">
      <img src="./assets/img/error.png" alt="error">
    </div>
    ` ;
    
    form.reset();
    return;
  }

  const formattedPokeData = getPokeData(fetchedPoke);
  renderPokeCard(formattedPokeData);
  form.reset();
  message.textContent = "";
};

// Inicializar el evento de envío del formulario
const init = () => {
  form.addEventListener("submit", searchPokemon);
};


