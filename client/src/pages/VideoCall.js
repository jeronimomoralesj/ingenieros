import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5001"); // Use correct backend URL

const VideoCall = () => {
  const { roomId } = useParams();
  const [myStream, setMyStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const userVideo = useRef(null);
  const videoContainer = useRef(null); // Reference for holding multiple video elements

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId, socket.id);

    socket.on("user-connected", (userId) => {
      console.log("User connected:", userId);
      handleNewUser(userId);
    });

    socket.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
      handleUserDisconnect(userId);
    });

    socket.on("offer", (data) => {
      handleOffer(data);
    });

    socket.on("answer", (data) => {
      handleAnswer(data);
    });

    socket.on("candidate", (data) => {
      handleCandidate(data);
    });

    return () => {
      socket.emit("disconnect");
    };
  }, [roomId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        userVideo.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);

  const handleNewUser = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // ICE server configuration
    });

    peerConnection.addStream(myStream);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { target: userId, candidate: event.candidate });
      }
    };

    peerConnection.onaddstream = (event) => {
      const newVideoElement = document.createElement("video");
      newVideoElement.srcObject = event.stream;
      newVideoElement.play();
      videoContainer.current.appendChild(newVideoElement);
    };

    createOffer(peerConnection, userId);
    setPeerConnections((prev) => ({ ...prev, [userId]: peerConnection }));
  };

  const createOffer = (peerConnection, userId) => {
    peerConnection.createOffer().then((offer) => {
      return peerConnection.setLocalDescription(offer);
    }).then(() => {
      socket.emit("offer", { target: userId, offer: peerConnection.localDescription });
    });
  };

  const handleOffer = (data) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.addStream(myStream);

    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { target: data.userId, candidate: event.candidate });
      }
    };

    peerConnection.onaddstream = (event) => {
      const newVideoElement = document.createElement("video");
      newVideoElement.srcObject = event.stream;
      newVideoElement.play();
      videoContainer.current.appendChild(newVideoElement);
    };

    peerConnection.createAnswer().then((answer) => {
      return peerConnection.setLocalDescription(answer);
    }).then(() => {
      socket.emit("answer", { target: data.userId, answer: peerConnection.localDescription });
    });

    setPeerConnections((prev) => ({ ...prev, [data.userId]: peerConnection }));
  };

  const handleAnswer = (data) => {
    const peerConnection = peerConnections[data.userId];
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const handleCandidate = (data) => {
    const peerConnection = peerConnections[data.userId];
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  const handleUserDisconnect = (userId) => {
    const peerConnection = peerConnections[userId];
    if (peerConnection) {
      peerConnection.close();
      delete peerConnections[userId];
      // Remove the video element
      const videoElements = videoContainer.current.querySelectorAll('video');
      videoElements.forEach((video) => {
        if (video.srcObject === peerConnection.getRemoteStreams()[0]) {
          video.remove();
        }
      });
    }
  };

  return (
    <div>
      <h1>Video Call - Room: {roomId}</h1>
      <video ref={userVideo} autoPlay muted style={{ width: "100%", height: "250px", borderRadius:"50px" }} />
      <div ref={videoContainer}></div> {/* Container for other video streams */}
    </div>
  );
};

export default VideoCall;
