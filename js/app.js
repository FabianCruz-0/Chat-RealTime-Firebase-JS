const login = document.querySelector('#login')
const formEnviarMsj = document.querySelector('#formEnviarMsj')
const chat = document.querySelector('#chat')
const mensaje = document.querySelector('#mensaje')

firebase.auth().onAuthStateChanged(user => {
    if(user){
        logout()
        formEnviarMsj.classList = 'input-group fixed-bottom p-5';
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
        firebase.firestore().collection('mensajes').add({
            mensaje: mensaje.value,
            uid: user.uid,
            uname:user.displayName,
            fecha: Date.now()
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
                            ${doc.data().displayName} <br>
                            <span class="fw-light">${doc.data().mensaje}</span>
                        </span>
                    </div>
                    `
                }else{
                    chat.innerHTML += /*html*/`
                    <div class="d-flex justify-content-start mb-4">
                        <span class="badge badge-primary mensajeRecibido fw-bold text-start">
                            ${doc.data().mensaje} <br>
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
        <button class="btn fw-bold" id="btnAcceder"><img src="../styles/imgs/google.png" width="30px"> &nbsp; Ingresar</button>
    `
    
    const btnAcceder = document.querySelector('#btnAcceder')
    
    btnAcceder.addEventListener('click', async() => {
        const provider = new firebase.auth.GoogleAuthProvider();
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