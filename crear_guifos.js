window.onload = eventosPaginaCrearGuifos;
const constraints = {
     audio: false,
     controls: true,
    video: {
       width: 675, height: 420 
    }
}

let arrayGifos = []
function comenzarACrearGifos(){
    let instrucciones = document.getElementById('contenedor_guifos');
    let contenedorCamara = document.getElementById('contenedor_mis_guifos');
    if(instrucciones.style.display = 'block'){
        instrucciones.style.display = 'none';
        contenedorCamara.style.display = 'block'
    }
    getVideo()
};

async function accesoCamara(){
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;  
}

async function getVideo(){
    let video = document.getElementById('video')
    let stream = await accesoCamara();
    video.srcObject = stream;
    video.play()
}
let recorder 
async function grabarVideo(){
    let ocultarBtn = document.getElementById('ocultar');
    let controles = document.getElementById('btn-grabar')
    if(controles.style.display = 'block'){
        ocultarBtn.style.display = 'none';
        controles.style.display = 'flex';
    }
    let stream = await accesoCamara();
    let tituloCambiado = document.getElementById('captura-gif');
    tituloCambiado.innerHTML = ("Capturando Tu Guifo");
    recorder = RecordRTC(stream, {
        type: 'gif',
        width: 675, 
        height: 420 
    });
    recorder.startRecording();
}

async function pararGrabacion(){
    
    recorder.stopRecording(async function () {
        let gifContainer = document.getElementById('gif')
        let blob = recorder.getBlob();
        let url = URL.createObjectURL(blob);
        console.log(url);
        gifContainer.src = url;
        arrayGifos.unshift(gifContainer)
        console.log(arrayGifos)
        gifContainer.onloadedmetadata = function(e) {
            gifContainer.play();
          };
    })
    mostrarGiphy();
}

function mostrarGiphy(){
     let video = document.getElementById('video');
     let gif = document.getElementById('gif');
     let btnParaSubirGif = document.getElementById('btn-captura')
     let btnGrabar = document.getElementById('btn-grabar')
     if(video.style.display = 'block'){        
        video.style.display = 'none';
        gif.style.display = ' block';
        btnGrabar.style.display = 'none';
       btnParaSubirGif.style.display = 'flex'
   }
}

function eventosPaginaCrearGuifos(){
    document.getElementById('comenzar').addEventListener('click', comenzarACrearGifos);
    document.getElementById('capturar').addEventListener('click', grabarVideo);
    document.getElementById('stop').addEventListener('click', pararGrabacion);
}