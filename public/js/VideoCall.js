const socket = io()
const videoGrid = document.getElementById('video-grid')
var send = document.getElementById("send");
var message = document.getElementById("message");
var output = document.getElementById("output");
var handle = document.getElementById("handle");
const myPeer = new Peer(undefined, {})
let ownVideo;
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  ownVideo = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



send.addEventListener('click', function(){
  socket.emit("chat-msg", {
    message: message.value,
    handle: handle.value
    });

    message.value = '';
});

socket.on("chat-msg", function (data) {
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong>" + data.message + "</p>";
});


const btn = document.getElementById("mute/unmute");

const muteUnmute = () =>{
    if(ownVideo.getAudioTracks()[0].enabled){
      ownVideo.getAudioTracks()[0].enabled = false;
      btn.innerHTML="Unmute";
    }
    else{
      ownVideo.getAudioTracks()[0].enabled = true;
      btn.innerHTML="Mute"
    }
}

btn.addEventListener('click', muteUnmute);


const pause = document.getElementById("pause");

const pauseVideo = () => {
  if(ownVideo.getVideoTracks()[0].enabled){
      ownVideo.getVideoTracks()[0].enabled = false;
      pause.innerHTML="Resume";
  }
  else {
      ownVideo.getVideoTracks()[0].enabled = true;
      pause.innerHTML = "Pause";
  }
}


pause.addEventListener('click', pauseVideo)




pause.addEventListener('click', pauseVideo)