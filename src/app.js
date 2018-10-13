const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const getIceObject = require('./getIceObject');
const io = require('socket.io-client')
const socket = io('https://vccall-webrtc.herokuapp.com');
// const config = {host: 'localhost', port: 3000, secure:true, key:'peerjs'}


getIceObject(iceCinfig => {
    console.log('iceCinfig', iceCinfig)
    const connectionObj = {
        // host: 'vccall-webrtc.herokuapp.com', port: 443, proxied: true,
        key: 'tkv5g2acaree9udi',
        config: iceCinfig
    };
    const peerId = getPeer();
    socket.emit('NEW_PEER_ID', peerId);
    const peer = new Peer(peerId, connectionObj);


    $('#ulPeerId').on('click', 'li', function () {
        const peerId = $(this).attr('id');
        openStream(stream => {
            playVideo(stream, 'localStream');
            const call = peer.call(peerId, stream);
            call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'))
        });
    });
    $('#btnCall').click(() => {
        const friendId = $('#txtFriendId').val();
        openStream(stream => {
            playVideo(stream, 'localStream');
            const call = peer.call(friendId, stream);
            call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'))
        });
    })

    peer.on('call', (call) => {
        openStream(stream => {
            playVideo(stream, 'localStream');
            call.answer(stream);
            call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'))
        });
    });

})

function getPeer() {
    let id = uid(10);
    $('#peer-id').append(id);
    return id;
}
socket.on('ONLINE_PEER_ARRAY', arrPeerId => {
    arrPeerId.forEach(id => {
        $('#ulPeerId').append(`<li id="${id}">${id}</li>`);
    });
});
socket.on('SOMEONE_DISCONNECT', peerId => {
    $(`#${peerId}`).remove();
});
socket.on('NEW_CLIENT_CONNECT', id => {
    $('#ulPeerId').append(`<li id="${id}">${id}</li>`);
});

let costomConfig;