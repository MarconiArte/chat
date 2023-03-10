const socket = io({
    autoConnect:false
});
let user;
const chatBox = document.getElementById('chatbox');

Swal.fire({
    title:"Identificate",
    input:"text",
    text:"Ingresa nombre de usuario",
    inputValidator: (value) =>{
        return !value && "Necesitas colocar un usuario valido para proseguir"
    },
    allowOutsideClick:false,
    allowEscapeKey:false
}).then(result =>{
    user = result.value;
    socket.connect();
    socket.emit('authenticated',user);
})

chatBox.addEventListener('keyup', e =>{
    if(e.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit('message',{user,message:chatBox.value.trim()})
            chatBox.value ="";
        }
    }
})

//Socket listeners
socket.on('logs',data =>{
    const logsPanel = document.getElementById('logsPanel');
    let message = '';

    data.forEach(msg=>{
        message += `${msg.user} dice: ${msg.message} <br />`
    })
    logsPanel.innerHTML = message;
});


socket.on('newUserConnected', data =>{
    if(!user) return;
    Swal.fire({
        toast:true,
        position:'top-end',
        showConfirmButton:false,
        timer:2000,
        title:`${data} se ha unido al chat`,
        icon:'success'
    })
})