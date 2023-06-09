const socket = io();

let user;
let chatInput = document.getElementById('chatbox')
Swal.fire ({
    title: 'Identify yourself!',
    input: 'text',
    text: 'Write down your name',
    inputValidator: (value) => {
        return !value && 'Writing a user name is mandatory'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user);
})

chatInput.addEventListener('keyup', ev => {
    if (ev.key === 'Enter') {
        if (chatInput.value.trim().length > 0) {
            socket.emit('msg', {user: user, message: chatInput.value});
            chatInput.value = "";
        }
    }
})

socket.on('uploadingMessages', data => {

    console.log(data);

    let log = document.getElementById('messagespot');
    let messages = "";

    data.forEach(message => {
        messages += `${message.user} says: ${message.message}</br>`;
    });

    log.innerHTML = messages;
})

socket.on('newUserConnected', data => {
    if (!user) return;
    console.log(data);
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${data} joined the chat`,
        icon: 'success'
    })
})