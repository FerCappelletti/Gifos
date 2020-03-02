const apiKey = 'dkVRyCXXNDv7wwCKsRBvO6XVQ5xtqNNi';
let buscador = document.getElementById('input-buscar');

async function getApi(url) {
    let found = await fetch(url);
    let response = await found.json();
    console.log(response);
    return response;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = cargaPagina;
///////////////////////////////////////////////////////////////////////////////////////////////////
function cargaPagina() {
    mostrarSugerenciasPorCuatro();
    getTendencias();
    eventos();
    guardarEnLocalStorage()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getSugerencias() {
    getApi('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey + '&tag=&rating=G')
        .then(obtenerSugerencia);
};
function obtenerSugerencia(random) {
    let contenedorSugerencias = document.getElementById('contenedor-sugerencias');
    let box = document.createElement('div');
    box.classList.add('sugerencia');
    contenedorSugerencias.appendChild(box);

    let descripcion = document.createElement('p');
    descripcion.id = 'titulo';
    descripcion.innerHTML = random.data.title;
    let cruz = document.createElement('img');
    cruz.src = './imagenes/close.svg';
    descripcion.appendChild(cruz);
    box.appendChild(descripcion);

    let boton = document.createElement('button');
    boton.innerHTML = 'Ver más';
    box.appendChild(boton);
    
    let imagen = document.createElement('img');
    imagen.src = random.data.images.downsized_large.url;
    imagen.classList.add('sugerencia');
    imagen.id = 'giphy-sugerido';
    box.appendChild(imagen);
    boton.addEventListener('click', () =>{
         let buscador = document.getElementById('input-buscar');
         buscador.value = random.data.title;
         habilitarBotonBuscar();
         buscador.scrollIntoView();
    });
};
function mostrarSugerenciasPorCuatro() {
    for (i = 0; i < 4; i++) {
        getSugerencias();
    };
};

function getTendencias() {
    getApi('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=12&rating=G')
        .then(mostrartendencias);
};

function mostrartendencias(datos) {
    for (i = 0; i < datos.data.length; i++) {
        let tendenciasContainer = document.getElementById('contenedor-tendencias');
        let giphyTendencia = document.createElement('div');
        giphyTendencia.className = 'tendencia';
        tendenciasContainer.appendChild(giphyTendencia);

        let imagen = document.createElement('img');
        imagen.src = datos.data[i].images.downsized_medium.url;
        giphyTendencia.appendChild(imagen)
            
        let titulo = document.createElement('p');
        titulo.id = 'titulo';
        titulo.innerText = datos.data[i].title;
        giphyTendencia.appendChild(titulo);   
        
        imagen.addEventListener('mouseover', () => {
        if(titulo.style.display = 'none'){
            titulo.style.display = 'block';
            }
        });

        imagen.addEventListener('click', () => {
            let buscador = document.getElementById('input-buscar');
            buscador.value = titulo.textContent;
            habilitarBotonBuscar();
            buscador.scrollIntoView();
            }
        );

        imagen.addEventListener('mouseleave', () => {
            if(titulo.style.display = 'block'){
                titulo.style.display = 'none';
            }
        })
    };
};

function elegirTema() {
    let menu = document.getElementById('menu-temas');
    menu.style.display = 'flex';
    document.body.addEventListener('click', () => {
        menu.style.display = 'none';
    });
    event.stopPropagation()
};
function cambiarTemaDark() {
    let logoSailorDark = document.getElementById('logo-day');
    logoSailorDark.id = 'gifOF_logo';
    logoSailorDark.src = './imagenes/gifOF_logo_dark.png';
    let body = document.body;
    body.className = 'modo-dark';
};

function cambiarTemaDay() {
    let logoSailorDark = document.getElementById('gifOF_logo');
    logoSailorDark.id = 'logo-day';
    logoSailorDark.src = './imagenes/gifOF_logo.png';
    let body = document.body;
    body.className = 'day';
};
function displayMenuBuscador() {
    let busqueda = document.getElementById('input-buscar').value;
    let menu = document.getElementById('menu-buscador');
    if (busqueda !== null) {
        menu.style.display = 'block';
        document.body.addEventListener('click', () => {
            if (menu){
                menu.style.display = 'none';
            } else {
                menu.style.display = 'block';
            }
        });
    };
};

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

function desactivarBotonBuscar() {
    let lupa = document.getElementById('lupa');
    lupa.src = './imagenes/lupa_inactive.svg';
    let boton = document.getElementById("buscar");
    boton.classList.toggle("buscar");
};

function getApiResults() {
    let busqueda = document.getElementById('input-buscar').value;
    getApi('http://api.giphy.com/v1/gifs/search?q=' + busqueda + '&api_key=' + apiKey)
        .then(busquedasEncontradas);
};
function busquedasEncontradas(datos) {
    let contenedorImagen = document.getElementById('contenedorDeBusqueda');
    let gifsEncontrados = document.createElement('div');
    gifsEncontrados.id = 'contenedorDeBusqueda';
    gifsEncontrados.className = 'dia';
    
    for (i = 0; i < datos.data.length; i++) {
        console.log(datos.data[i].images.downsized_large.url)
        let imagen = document.createElement('img');
        imagen.src = datos.data[i].images.downsized_large.url;
        gifsEncontrados.appendChild(imagen)
    };
    contenedorImagen.replaceWith(gifsEncontrados);
};
/////////////////local storage + botones celestes//////////////
let historialDeBusquedaLocalStorage = [];
function guardarEnLocalStorage(){
    let busqueda = document.getElementById('input-buscar').value;
    if(localStorage.getItem('historialLocalStorage') != null){
        localStorage.setItem('historialLocalStorage',  JSON.stringify(busqueda));
        historialDeBusquedaLocalStorage.unshift(busqueda);
}
    
};
function hacerBotones(){
        let contenedorBotonesDeBusquedas = document.getElementById('botones-de-busquedas');
        let botonBusquedasRealizadas = document.createElement('button');
        botonBusquedasRealizadas.innerHTML = historialDeBusquedaLocalStorage[0];
        contenedorBotonesDeBusquedas.insertAdjacentElement('afterbegin', botonBusquedasRealizadas);  
        botonBusquedasRealizadas.addEventListener('click', () => {
            let buscador = document.getElementById('input-buscar');
            buscador.value = botonBusquedasRealizadas.textContent;
            habilitarBotonBuscar();
            buscador.scrollIntoView();
            });
};

function hiceEnter(event) {
    if (event.which === 13) {
        habilitarBotonBuscar();
        getApiResults();
        getStorage();
    }
    event.stopPropagation();
};
function limpiarInput(){
    let buscador = document.getElementById('input-buscar');
    buscador.value = '';
};
function eventos() {
    document.getElementById('input-buscar').addEventListener('keyup', displayMenuBuscador);
    document.getElementById('input-buscar').addEventListener('change', habilitarBotonBuscar);
    document.getElementById('input-buscar').addEventListener('keypress', habilitarBotonBuscar);
    document.getElementById('input-buscar').addEventListener('click', getApiResults);
    document.getElementById('input-buscar').addEventListener('focus', limpiarInput);
    document.getElementById('buscar').addEventListener('click', guardarEnLocalStorage);
    document.getElementById('buscar').addEventListener('click', getApiResults);
    document.getElementById('buscar').addEventListener('click', hacerBotones);
    document.getElementById('buscar').addEventListener('click', desactivarBotonBuscar);
    document.getElementById('btn-3').addEventListener('click', elegirTema);
    document.getElementById('dark').addEventListener('click', cambiarTemaDark);
    document.getElementById('day').addEventListener('click', cambiarTemaDay);
    document.body.addEventListener('keypress', hiceEnter);
};

