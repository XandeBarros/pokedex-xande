const conteudo = document.querySelector('.conteudo');
let offset = 0;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

async function pegarDados(offsetValue) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offsetValue}`;
  console.log('Buscando pokemóns!');
  const response = await fetch(url, {
    method: 'GET', 
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}

async function pegarTipo(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  const response = await fetch(url, {
    method: 'GET', 
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  console.log(data);
  const types = data.types;
  const tipos = [];
  for (const type of types) {
    tipos.push(type.type.name.capitalize());
  }
  if (data.id < 10) {
    let pokemonID = '00' + data.id;
    tipos.push(pokemonID);
  } else if (data.id < 100) {
    let pokemonID = '0' + data.id;
    tipos.push(pokemonID);
  } else {
    let pokemonID = data.id;    
    tipos.push(pokemonID);
  }
  
  return tipos;
}

async function pegarPokemons(offsetValue) {
  const dados = await pegarDados(offsetValue);

  const pokemons = dados.results;
  
  for (const pokemon of pokemons) {
    const tiposArray = await pegarTipo(pokemon.name);
    const pokemonID = tiposArray.pop();
    
    const logoTipos = [];
    for (const logo of tiposArray) {
      logoTipos.push(`<img class="pokemon__dados--tipoImg"  src="https://raw.githubusercontent.com/vinicoder/pokedex/master/src/assets/icons/types/${logo}.svg" alt="Tipo do Pokemon"></img>`);
    }
    const logos = logoTipos.join(' ');

    const divPokemon = document.createElement('div');
    divPokemon.classList.add('pokemon');
    logoTipos.join(' ');
  
    divPokemon.innerHTML = `
      <div class="pokemon__dados">
        <h2 class="pokemon__dados--id">#${pokemonID}</h2>
        <p class="pokemon__dados--nome">${pokemon.name.capitalize()}</p>
        <a href="#" class="pokemon__dados--tipo ${tiposArray[0]}" id="${pokemon.name}">
          ${tiposArray.join(' ')}
          ${logos}
        </a>
      </div>
      <a href="" class="pokemon__imagem">
        <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonID}.png" alt="Imagem do Pokemon" class="pokemon__imagem--img">
      </a>
    `;
    conteudo.appendChild(divPokemon);
  }
}

pegarPokemons(offset);

async function showLoading() {
  /// add class loading 
  setTimeout(() => {
    /// remove class loading

    setTimeout(() => {;
      offset += 10;
      pegarPokemons(offset);
    }, 500);
  }, 500);
}

window.addEventListener('scroll', () => {
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.documentElement;
  console.log((scrollY + innerHeight >= scrollHeight));

  if ((scrollY + innerHeight >= scrollHeight - 2)) {
    showLoading();
  }
});
