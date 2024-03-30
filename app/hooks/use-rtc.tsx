// /**
//  * Create hooks to use web rtc
//  */
// import { useEffect, useRef, useState } from "react";

// enum PeerType {
//   OFFER = "offer",
//   ANSWER = "answer",
//   CANDIDATE = "candidate",
// }

// export default function useRTC() {
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const roomChannelRef = useRef<WebSocket | null>(null);
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

//   useEffect(() => {
//     const peerConnection = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com:19302",
//         },
//       ],
//     });
//     peerConnectionRef.current = peerConnection;

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         roomChannelRef.current?.send({
//           type: "broadcast",
//           event: PeerType.CANDIDATE,
//           payload: event.candidate,
//         });
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       setRemoteStream(event.streams[0]);
//     };

//     return () => {
//       peerConnection.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (localStream) {
//       localStream.getTracks().forEach((track) => {
//         peerConnectionRef.current?.addTrack(track, localStream);
//       });
//     }
//   }, [localStream]);

//   function createOffer() {
//     if (!peerConnectionRef.current) {
//       return;
//     }
//     peerConnectionRef.current
//       .createOffer()
//       .then((offer) => {
//         console.log("Created offer :: ", offer);
//         peerConnectionRef.current!.setLocalDescription(offer);
//         roomChannelRef.current!.send({
//           type: "broadcast",
//           event: PeerType.OFFER,
//           payload: offer.sdp,
//         });
//       })
//       .catch((error) => console.error(error));
//   }

//   function sendAnswer(offer: RTCSessionDescriptionInit) {
//     if (!peerConnectionRef.current) {
//       return;
//     }
//     peerConnectionRef.current
//       .setRemoteDescription(new RTCSessionDescription(offer))
//       .then(() => peerConnectionRef.current!.createAnswer())
//       .then((answer) => {
//         console.log("Created answer :: ", answer);
//         peerConnectionRef.current!.setLocalDescription(answer);
//         roomChannelRef.current!.send({
//           type: "broadcast",
//           event: PeerType.ANSWER,
//           payload: answer.sdp,
//         });
//       })
//       .catch((error) => console.error(error));
//   }

//   function sendICECandidate(candidate: RTCIceCandidate) {
//     console.log("sendICECandidate :: ", candidate);
//     roomChannelRef.current!.send({
//       type: "broadcast",
//       event: PeerType.CANDIDATE,
//       payload: candidate,
//     });
//   }

//   return {
//     setLocalStream,
//     setRemoteStream,
//     createOffer,
//     sendAnswer,
//     sendICECandidate,
//     roomChannelRef,
//   };
// }
