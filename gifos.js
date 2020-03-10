const apiKey = 'dkVRyCXXNDv7wwCKsRBvO6XVQ5xtqNNi';
//////////////asyn function que uso para los fetch//////////////////////
async function getApi(url) {
    let found = await fetch(url);
    let response = await found.json();
    console.log(response);
    return response;
};

////////////////////////////////window onload////////////////////////////////////////////////////////////////////
window.onload = cargaPagina;
////////////////////////////////funcion de window onload///////////////////////////////////////////////////////////////////
function cargaPagina() {
    mostrarSugerenciasPorCuatro();
    getTendencias();
    eventos();
    opcionesDeOtrasBusquedas();
    mostrarBusquedasGuardadas();
}
/////////////////////////////////trae de a 1 objeto////////////////////////////////////////////////////////////////////////////////
function getSugerencias() {
    getApi('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey + '&tag=&rating=G')
        .then(obtenerSugerencia);
};
function obtenerSugerencia(random) {
    let contenedorSugerencias = document.getElementById('contenedor-sugerencias');
    let box = document.createElement('div');
    box.classList.add('sugerencia');
    contenedorSugerencias.appendChild(box);

    let descripcion = document.createElement('div');
    descripcion.className = ('barra-gradient');
    let titulo = document.createElement('p');
    titulo.innerHTML = ('#') + random.data.title;
    descripcion.appendChild(titulo);

    let cruz = document.createElement('img');
    cruz.src = './imagenes/close.svg';
    
    descripcion.appendChild(cruz);
    box.appendChild(descripcion);

    let imagen = document.createElement('img');
    imagen.src = random.data.images.downsized_large.url;
    imagen.classList = 'giphy-sugerido';
    box.appendChild(imagen);
    let boton = document.createElement('button');
    boton.innerHTML = 'Ver más';
    box.appendChild(boton);
    boton.addEventListener('click', () =>{
         let buscador = document.getElementById('input-buscar');
         buscador.value = random.data.title;
         habilitarBotonBuscar();
         buscador.scrollIntoView();
    });
};
/////////////////////iterar para obtener 4 sugerencias///////////////////
function mostrarSugerenciasPorCuatro() {
    for (i = 0; i < 4; i++) {
        getSugerencias();
    };
};
/////////////////////traer tendencias///////////////////////////////////
function getTendencias() {
    getApi('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=12&rating=G')
        .then(mostrartendencias);
};
//////////////////////muestra las tendencias//////////////////////////////
function mostrartendencias(datos) {
    for (i = 0; i < datos.data.length; i++) {
        let tendenciasContainer = document.getElementById('contenedor-tendencias');
        let giphyTendencia = document.createElement('div');
        giphyTendencia.className = ('tendencia');
        tendenciasContainer.appendChild(giphyTendencia);

        let imagen = document.createElement('img');
        imagen.src = datos.data[i].images.downsized_medium.url;
        giphyTendencia.appendChild(imagen)

        let titulo = document.createElement('div');
        titulo.className = ('barra-gradient');
        let nombre = document.createElement('p')
        nombre.innerHTML = datos.data[i].title;
        titulo.appendChild(nombre)
        
        imagen.addEventListener('mouseover', () => {
            if (titulo.style.display = 'none') {
                titulo.style.display = 'block';
                giphyTendencia.appendChild(titulo);
            }
        });
        imagen.addEventListener('mouseleave', () => {
            if (titulo.style.display = 'block') {
                titulo.style.display = 'none';
            }
        })
        imagen.addEventListener('click', () => {
            let buscador = document.getElementById('input-buscar');
            buscador.value = nombre.textContent;
            habilitarBotonBuscar();
            buscador.scrollIntoView();
        });
    };
};
//////////////////Realizar busquedas////////////////////////
function getApiResults() {
    let busqueda = document.getElementById('input-buscar').value;
    guardarBusquedas();
    getApi('http://api.giphy.com/v1/gifs/search?q=' + busqueda + '&api_key=' + apiKey)
        .then(busquedasEncontradas)
            .then(mostrarUltimaBusqueda)
                .then(desactivarBotonBuscar);
};
function busquedasEncontradas(datos) {
    let contenedorImagen = document.getElementById('contenedorDeBusqueda');
    let gifsEncontrados = document.createElement('div');
    gifsEncontrados.id = 'Busqueda';
    gifsEncontrados.className = 'contenedor-de-giphys';
    for (i = 0; i < datos.data.length; i++) {

        console.log(datos.data[i].images.downsized_large.url)
        let imagen = document.createElement('img');
        imagen.src = datos.data[i].images.downsized_large.url;
        gifsEncontrados.appendChild(imagen)
    };
    contenedorImagen.innerHTML = gifsEncontrados.innerHTML;
    limpiarInput();
};
///////////////////////Elegir theme////////////////////////////////
function elegirTema() {
    let menu = document.getElementById('menu-temas');
    menu.style.display = 'flex';
    document.body.addEventListener('click', () => {
        menu.style.display = 'none';
    });
    event.stopPropagation()
};
//////////////////Cambiar theme Dark//////////////////////////
function cambiarTemaDark() {
    let logoSailorDark = document.getElementById('logo-day');
    logoSailorDark.id = 'gifOF_logo';
    logoSailorDark.src = './imagenes/gifOF_logo_dark.png';
    let body = document.body;
    body.className = 'modo-dark';
};
/////////////////Cambiar theme Day/////////////////////////////////
function cambiarTemaDay() {
    let logoSailorDark = document.getElementById('gifOF_logo');
    logoSailorDark.id = 'logo-day';
    logoSailorDark.src = './imagenes/gifOF_logo.png';
    let body = document.body;
    body.className = 'day';
};
///////////////////Display menu cuando se escribe en el input////////////////////
function displayMenuBuscador() {
    let busqueda = document.getElementById('input-buscar').value;
    let menu = document.getElementById('menu-opciones');
    if (busqueda !== null) {
        menu.style.display = 'block';
        document.body.addEventListener('click', () => {
            if (menu) {
                menu.style.display = 'none';
            } else {
                menu.style.display = 'block';
            }
        });
    };
};
//////////////////Habilita boton de busqueda//////////////////////
function habilitarBotonBuscar() {
    let boton = document.getElementById("buscar");
    let lupa = document.getElementById('lupa');
    let buscador = document.getElementById('input-buscar');
    if (buscador.value) {
        boton.disabled = false;
        lupa.src = './imagenes/lupa.svg';
        boton.className = 'boton-habilitado';
    }
};
///////////////Desactiva boton buscar//////////////////////
function desactivarBotonBuscar() {
    let lupa = document.getElementById('lupa');
    lupa.src = './imagenes/lupa_inactive.svg';
    let boton = document.getElementById("buscar");
    boton.classList.toggle("buscar");
};
////////////////////////Menu de otras opciones de busqueda///////////
const opciones = ['Giphys más buscados', 'Tendencias 2020', 'Lugares maravillosos',
    'Caidas graciosas', 'Oscar´s 2020', 'Coronavirus', 'Kisses', 'Mate',
    'Argentina', 'Winter is coming', 'Add, commit & push'];
function opcionesDeOtrasBusquedas() {
    let menuOpcionesDeBusqueda = document.getElementById('menu-opciones');
    let opcionDeBusquedas = document.createElement('div');

    for( i = 0; i < 3; i++){
        let opcion = document.createElement('div');
        let random = Math.floor(Math.random() * 11);
        opcion.innerHTML = opciones[random];
        opcionDeBusquedas.appendChild(opcion);
    }
        menuOpcionesDeBusqueda.innerHTML = opcionDeBusquedas.innerHTML;
        opcionDeBusquedas.addEventListener('click', () => {
        buscador.innerHTML = opcionesDeBusqueda.textContent;
        habilitarBotonBuscar();
    });
}
/////////////////local storage + botones celestes//////////////
let historialDeBusqueda = [];
let historialLocalStorage = JSON.parse(localStorage.getItem('busquedasRealizadas'));
function guardarBusquedas() {
    let busqueda = document.getElementById('input-buscar').value;
    if (JSON.parse(localStorage.getItem('busquedasRealizadas')) !== null) {
        historialDeBusqueda = JSON.parse(localStorage.getItem('busquedasRealizadas'));
    }
    historialDeBusqueda.push(busqueda);
    localStorage.setItem('busquedasRealizadas', JSON.stringify(historialDeBusqueda));
};
function mostrarBusquedasGuardadas() {
    for(i = 0; i < historialLocalStorage.length; i++) {
        let contenedorBotonesDeBusquedas = document.getElementById('botones-de-busquedas');
        let botonBusquedasRealizadas = document.createElement('button');
        botonBusquedasRealizadas.innerHTML = historialLocalStorage[i];
        contenedorBotonesDeBusquedas.insertAdjacentElement('afterbegin', botonBusquedasRealizadas);
        botonBusquedasRealizadas.addEventListener('click', () => {
            let buscador = document.getElementById('input-buscar');
            buscador.value = botonBusquedasRealizadas.textContent;
            habilitarBotonBuscar();
        });
    };
};
function mostrarUltimaBusqueda(){
    let contenedorBotonesDeBusquedas = document.getElementById('botones-de-busquedas');
        let botonBusquedasRealizadas = document.createElement('button');
        botonBusquedasRealizadas.innerHTML = historialDeBusqueda[historialDeBusqueda.length - 1];
        contenedorBotonesDeBusquedas.insertAdjacentElement('afterbegin', botonBusquedasRealizadas);
        botonBusquedasRealizadas.addEventListener('click', () => {
            let buscador = document.getElementById('input-buscar');
            buscador.value = botonBusquedasRealizadas.textContent;
            habilitarBotonBuscar();
    });
};

function hiceEnter(event) {
    if (event.which === 13) {
        getApiResults();
        limpiarInput();
    }
        event.stopPropagation();
};
function limpiarInput() {
    let buscador = document.getElementById('input-buscar');
    buscador.value = '';
};
/////////////////////////////////////Ir a mis guifos////////////
function getMisGuifos(){
    let contenedorMisGuifos = document.getElementById('contenedor_mis_guifos');
    let divAOcultarUno = document.getElementById('buscador');
    let divAOcultarDos = document.getElementById('contenedor-sugerencias');
    let divAOcultarTres = document.getElementById('contenedor-tendencias')
    
    if(contenedorMisGuifos.style.display = 'none'){
        divAOcultarUno.style.display = 'none';
        divAOcultarDos.style.display = 'none';
        divAOcultarTres.style.display = 'none';
        contenedorMisGuifos.style.display = 'block';
    };
}
function eventos() {
    document.getElementById('input-buscar').addEventListener('keyup', displayMenuBuscador);
    document.getElementById('input-buscar').addEventListener('change', habilitarBotonBuscar);
    document.getElementById('input-buscar').addEventListener('focus', limpiarInput);
    document.getElementById('buscar').addEventListener('click', getApiResults);
    document.getElementById('btn-3').addEventListener('click', elegirTema);
    document.getElementById('dark').addEventListener('click', cambiarTemaDark);
    document.getElementById('day').addEventListener('click', cambiarTemaDay);
    document.getElementById('btn-4').addEventListener('click', getMisGuifos);
    document.body.addEventListener('keypress', hiceEnter);
};
