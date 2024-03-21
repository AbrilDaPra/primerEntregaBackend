const socket = io();
console.log("Client side connected!")

const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const chatMessages = document.getElementById('chat-messages');

//Función para enviar mensaje al hacer click en "SEND"
sendMessageBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('message', { user: user, message: message });
        messageInput.value = '';
    }
});

//Manejo la recepción dse mensajes y actualizo interfaz
socket.on('messageLogs', (messages) => {
    chatMessages.innerHTML = '';
    messages.forEach((msg) => {
        chatMessages.innerHTML += `<p>${msg.user}: ${msg.message}</p>`
    });
});

//Inicializo nombre del usuario al cargar la página
let user;

document.addEventListener('DOMContentLoaded', () => {
    Swal.fire({
        title: 'Welcome to the chat!',
        text: 'Enter your username',
        input: "text",
        inputValidator: (value) => {
            return !value && "Please enter your name."
        },
        confirmButtonText: 'OK'
      }).then((result) => {
        console.log("🚀 ~ result:", result)
        user = result.value
        socket.emit('auth', user)
      })
})