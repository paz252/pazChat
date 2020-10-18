const socket = io('http://localhost:80');

let form = document.getElementById('send-container');
let body = document.querySelector('body');
let container = document.querySelector('.container');
let messageInp = document.getElementById('messageInp');
let sendButton = document.getElementById('sendButton');
let bg = document.querySelector('[bg]');
let circle = document.querySelector('[circle]');
let burger = document.querySelector('.burger');
let dd = document.querySelector('[dropdown]');
let dm = false;

burger.addEventListener('click', () => {
    dd.classList.toggle('no-show');
    bg.addEventListener('click', () => {
        bg.classList.toggle('bg-before');
        bg.classList.toggle('bg-after');
        circle.classList.toggle('circle-after');
        if (dm == false) {
            dm = true;
            body.style.backgroundImage = 'url(./static/black-bg.jpg)';
            container.style.backgroundColor = 'rgba(0,0,0,0.4)';
            messageInp.style.backgroundColor = '#252525';
            messageInp.style.color = 'whitesmoke';
            sendButton.style.backgroundColor = '#252525';
            sendButton.style.color = 'whitesmoke';
        } else {
            dm = false;
            body.style.backgroundImage = 'url(./static/white-bg.jpg)';
            container.style.backgroundColor = 'rgba(0,0,0,0.1)';
            messageInp.style.backgroundColor = 'transparent'
            messageInp.style.color = '#444857';
            sendButton.style.backgroundColor = 'transparent';
            sendButton.style.color = '#444857';
        }
    })
})

var audio = new Audio('./static/ping.mp3')

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    container.append(messageElement);
    container.scrollTo(0, container.scrollHeight);
    if (position == 'left') {
        audio.play();
    }
}

//If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInp.value = '';
})

//Ask the new joined client for his name and let the server know
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

//If the new user joins receive the name from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center');
});

//If server sends a message receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

//If a user leaves a chat, append the info to the container
socket.on('leave', name => {
    append(`${name} left the chat`, 'center');
});

