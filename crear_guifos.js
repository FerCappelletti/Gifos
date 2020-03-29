mostrarMisGifos();
window.onload = onloadMisGuifos;

function onloadMisGuifos() {
    eventosPaginaCrearGuifos();
}
const apiKey = 'dkVRyCXXNDv7wwCKsRBvO6XVQ5xtqNNi';

const constraints = {
    audio: false,
    controls: true,
    video: {
        height: { max: 420 }
    }
}


function elegirTema() {
    let menu = document.getElementById('menu-temas');
    menu.style.display = 'flex';
    document.body.addEventListener('click', () => {
        menu.style.display = 'none';
    });
    event.stopPropagation()
};

function cambiarTemaDark() {
    let logoSailorDark = document.getElementById('logo-day-gifos');
    logoSailorDark.id = 'gifOF_logo';
    logoSailorDark.src = './imagenes/gifOF_logo_dark.png';
    let body = document.body;
    body.className = 'modo-dark';
};

function cambiarTemaDay() {
    let logoSailorDark = document.getElementById('gifOF_logo');
    logoSailorDark.src = './imagenes/gifOF_logo.png';
    let body = document.body;
    body.className = 'day';
};

let cont = document.getElementById('contenedor-1');
let misGuifos = document.getElementById('contenedor-mis-guifos');
let cont2 = document.getElementById('contenedor-2');
let inst = document.getElementById('instrucciones');
let chequeo = document.getElementById('chequeo');
let capture = document.getElementById('capturando');
let sub = document.getElementById('subiendo');
let exito = document.getElementById('exito');


function instrucciones() {
    cont.style.display = 'none';
    misGuifos.style.display = 'none';
    cont2.style.display = 'block';
    inst.style.display = 'block';
}


async function accesoCamara() {
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
}

function comenzarACrearGifos() {
    inst.style.display = 'none';
    chequeo.style.display = 'block';
    let gif = document.getElementById('gif');
    gif.style.display = 'none';
    getVideo();
};


async function getVideo() {
    let video = document.getElementById('video')
    let stream = await accesoCamara();
    video.srcObject = stream;
    video.play()
}
let recorder;
async function grabarVideo() {
    let btnControles = document.getElementById('btn-controles');
    btnControles.style.display = 'none';

    let btnParaGrabar = document.getElementById('capturando');
    btnParaGrabar.style.display = 'flex';

    let p = document.getElementById('aCambiar');
    p.innerHTML = 'Capturando tu guifo';

    let stream = await accesoCamara();
    recorder = RecordRTC(stream, {
        type: 'gif',
    });

    recorder.startRecording();
    cronometrar();
}

let cronometro;
function cronometrar() {
    contador_ms = 0;
    contador_s = 0;

    let ms = document.getElementById('milisegundos');
    let s = document.getElementById('segundos');

    cronometro = setInterval(
        function () {
            if (contador_ms == 60) {
                contador_ms = 00;
                contador_s++;
                s.innerHTML = contador_s;

                if (contador_s == 0) {
                    contador_s = 00
                }
            }
            ms.innerHTML = contador_ms;
            contador_ms++;

        }, 10)
}

function pararGrabacion() {
    clearInterval(cronometro);

    recorder.stopRecording(function () {
        let gifContainer = document.getElementById('gif')
        let gifo = document.createElement('img');
        gifContainer.appendChild(gifo);
        let blob = recorder.getBlob();
        let url = URL.createObjectURL(blob);
        gifo.src = url;

    });
    mostrarGiphy();
};

function mostrarGiphy() {
    let video = document.getElementById('video');
    let gif = document.getElementById('gif');
    let btnParaSubirGif = document.getElementById('btn-captura');
    let btnGrabar = document.getElementById('btn-grabar');
    if (video.style.display = 'block') {
        video.style.display = 'none';
        gif.style.display = ' block';
        btnGrabar.style.display = 'none';
        btnParaSubirGif.style.display = 'flex';
    };
};

async function formData() {
    gifSubiendo();
    let form = new FormData()
    let blob = await recorder.getBlob()
    form.append('file', blob, 'myGif.gif');
    form.append('api_key', apiKey)

    subirGif(form);
}
function gifSubiendo() {
    chequeo.style.display = 'none';
    sub.style.display = 'block';
};


async function subirGif(form) {
    fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + apiKey, {
        method: 'POST',
        body: form,
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw "Error en la llamada";
        }
    }).then((datos) => {
        id = datos.data.id;
        displayExito();
        return id
    }).then((id) => {
        //meterNuevo(id);
        guardarGifos(id)
    })
};

function guardarGifos(id) {
    let misGifos = [];
    let gifosLocalStorage = localStorage.getItem('Mis gifos');
    if (gifosLocalStorage !== null) {
        let misGifos = JSON.parse(gifosLocalStorage);
        misGifos.push(id);

        localStorage.setItem('Mis gifos', JSON.stringify(misGifos));
    } else {
        misGifos.unshift(id);
        localStorage.setItem('Mis gifos', JSON.stringify(misGifos))
    }
mostrarMisGifos();
}



async function mostrarMisGifos() {

    let gifosFromLS = await JSON.parse(localStorage.getItem('Mis gifos'))
    let cuadroMisGuifos = document.getElementById('contenedor-mis-guifos')
    
    if(gifosFromLS !== null){

        gifosFromLS.forEach(element => {
            
            let gif = document.createElement('img');
            let url = `https://media1.giphy.com/media/${element}/giphy.gif?cid=52afa79a31b48e99d4268c4cc71df9dcbf8f8b3c9db10a07&rid=giphy.gif`
        gif.src = url;
        

        gif.style.padding = '5px'
        cuadroMisGuifos.appendChild(gif);
        
        let linkBtn = document.getElementById('enlace-guifo');
        linkBtn.addEventListener('click', () => {
            let link = document.createElement("input");
            link.setAttribute('value', url);
            document.body.appendChild(link)
            link.select();
            document.execCommand('copy');
            document.body.removeChild(link);
            alert('Link de tu guifo copiado al portapapeles')
            
        });
    });
};
}

async function displayExito() {
    sub.style.display = 'none';
    exito.style.display = 'block';

    let miGifSubido = document.createElement('img');
    let gifContainer = document.getElementById('sub-exito');
    gifContainer.insertAdjacentElement('afterbegin', miGifSubido);

    let blob = recorder.getBlob();
    let url = URL.createObjectURL(blob);
    miGifSubido.src = url;

}

function eventosPaginaCrearGuifos() {
    document.getElementById('btn-3').addEventListener('click', elegirTema);
    document.getElementById('dark').addEventListener('click', cambiarTemaDark);
    document.getElementById('day').addEventListener('click', cambiarTemaDay);
    document.getElementById('btn-1').addEventListener('click', instrucciones);
    document.getElementById('comenzar').addEventListener('click', comenzarACrearGifos);
    document.getElementById('capturar').addEventListener('click', grabarVideo);
    document.getElementById('stop').addEventListener('click', pararGrabacion);
    document.getElementById('subir-guifo').addEventListener('click', formData);
}


