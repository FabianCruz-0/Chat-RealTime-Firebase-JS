const login = document.querySelector('#login')
const formEnviarMsj = document.querySelector('#formEnviarMsj')
const chat = document.querySelector('#chat')
const mensaje = document.querySelector('#mensaje')

firebase.auth().onAuthStateChanged(user => {
    if(user){
        logout()
        formEnviarMsj.classList = 'input-group fixed-bottom p-5';
        chat.style.overflowY='scroll';
        contenidoChat(user)
    }else{
        loginFunct()
        formEnviarMsj.classList = 'd-none';
        chat.style.overflowY='hidden';
        chat.innerHTML = /*html*/`
            <p class="lead mt-5 text-center fueraSesion">Debes iniciar sesión</p>
        `
    }
})

const contenidoChat = (user) => {

    formEnviarMsj.addEventListener('submit', event => {
        event.preventDefault()
        if(!mensaje.value.trim()){
            return
        }
        let fechaMensaje = new Date();
        let dia= fechaMensaje.getDate();
        let mes = fechaMensaje.getMonth();
        mes+=1
        let anio = fechaMensaje.getFullYear();
        let hora = fechaMensaje.getHours();
        let minutos = fechaMensaje.getMinutes();
        let distinguirHora = 'AM';
        if (hora>=12)
        {
            hora = 24-hora
            distinguirHora = 'PM'
        }

        if(minutos<10)
        {
            minutos='0'+minutos
        }
        let fechaAMostrar = ''+dia+'/'+mes+'/'+anio+'. Hora: '+hora+':'+minutos+' '+distinguirHora+'.'
        firebase.firestore().collection('mensajes').add({
            mensaje: mensaje.value,
            uid: user.uid,
            uname:user.displayName,
            fecha: Date.now(),
            fechaMostrar: fechaAMostrar
        }).then(res => {
        })
        mensaje.value = ''
    })

    firebase.firestore().collection('mensajes').orderBy('fecha')
        .onSnapshot(query => {
            chat.innerHTML=''
            query.forEach(doc => {
                if(user.uid === doc.data().uid){
                    chat.innerHTML += /*html*/`
                    <div class="d-flex justify-content-end mb-4">
                        <span class="badge badge-primary mensajeEnviado fw-bold text-end">
                            ${doc.data().uname} &nbsp; <span class="fw-light fst-italic">${doc.data().fechaMostrar}</span> <br>
                            <span class="fw-light">${doc.data().mensaje}</span>
                        </span>
                    </div>
                    `
                }else{
                    chat.innerHTML += /*html*/`
                    <div class="d-flex justify-content-start mb-4">
                        <span class="badge badge-primary mensajeRecibido fw-bold text-start">
                            ${doc.data().uname} &nbsp; <span class="fw-light fst-italic">${doc.data().fechaMostrar}</span> <br>
                            <span class="fw-light">${doc.data().mensaje}</span>
                        </span>
                    </div>
                    `
                }
                chat.scrollTop = chat.scrollHeight
            })
        })

}


const loginFunct = () => {

    login.innerHTML = `
        <button class="btn fw-bold" id="btnAcceder"><img src="../styles/imgs/google.png" width="30px"> &nbsp; Iniciar sesión</button>
    `
    
    const btnAcceder = document.querySelector('#btnAcceder')
    
    btnAcceder.addEventListener('click', async() => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
         });
        try {
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
    })

}

const logout = () => {
    login.innerHTML = `
        <button class="btn bg-danger text-white fw-bold" id="btnCerrar">Cerrar Sesión</button>
    `
    const btnCerrar = document.querySelector('#btnCerrar')
    btnCerrar.addEventListener('click', () => firebase.auth().signOut())
}