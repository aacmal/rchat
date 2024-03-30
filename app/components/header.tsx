import { Button, useDisclosure } from "@nextui-org/react";
import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { IconArrowLeft, IconPhoneCall } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { OutletContext } from "~/types";

import CallModal from "./call-modal";

enum PeerType {
  OFFER = "offer",
  ANSWER = "answer",
  CANDIDATE = "candidate",
}

interface Props {
  topic?: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  }[];
}
export default function Header(props: Props) {
  const { session, supabase } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const conversationId = useParams().id as string;
  const call = useDisclosure();

  // hanlde voice call
  useEffect(() => {
    let roomChannel: RealtimeChannel | undefined;
    if (!call.isOpen) {
      if (roomChannel) {
        roomChannel.unsubscribe();
      }
      return;
    }

    async function handleCall() {
      roomChannel = supabase.channel(`room:${conversationId}`);

      const micrphone = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      function addAudioToPeerConnection() {
        micrphone.getTracks().forEach((track) => {
          console.log("Adding track :: ", track);
          peerConnection.addTrack(track, micrphone);
        });
      }

      function sendOffer() {
        peerConnection
          .createOffer()
          .then((offer) => {
            console.log("Created offer :: ", offer);
            peerConnection.setLocalDescription(offer);
            roomChannel!.send({
              type: "broadcast",
              event: PeerType.OFFER,
              payload: offer.sdp,
            });
          })
          .catch((error) => console.error(error));
      }

      function sendAnswer(offer: RTCSessionDescriptionInit) {
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(offer))
          .then(() => peerConnection.createAnswer())
          .then((answer) => {
            console.log("Created answer :: ", answer);
            peerConnection.setLocalDescription(answer);
            roomChannel!.send({
              type: "broadcast",
              event: PeerType.ANSWER,
              payload: answer.sdp,
            });
          })
          .catch((error) => console.error(error));
      }

      function sendICECandidate(candidate: RTCIceCandidate) {
        console.log("sendICECandidate :: ", candidate);
        roomChannel!.send({
          type: "broadcast",
          event: PeerType.CANDIDATE,
          payload: candidate,
        });
      }

      roomChannel!.on(
        "broadcast",
        {
          event: PeerType.OFFER,
        },
        ({ payload }) => {
          console.log("Received offer :: ", payload);
          sendAnswer({ sdp: payload, type: "offer" });
        },
      );

      roomChannel!.on(
        "broadcast",
        { event: PeerType.ANSWER },
        ({ payload }) => {
          console.log("Received answer :: ", payload);
          peerConnection.setRemoteDescription(
            new RTCSessionDescription({
              sdp: payload as string,
              type: "answer",
            }),
          );
        },
      );

      roomChannel.on(
        "broadcast",
        { event: PeerType.CANDIDATE },
        ({ payload }: { payload: RTCIceCandidate }) => {
          console.log("Received ICE candidate :: ", payload);
          void peerConnection.addIceCandidate(
            new RTCIceCandidate({
              candidate: payload.candidate,
              sdpMid: payload.sdpMid,
              sdpMLineIndex: payload.sdpMLineIndex,
            }),
          );
        },
      );

      roomChannel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          addAudioToPeerConnection();
          sendOffer();
        }
      });

      peerConnection.ontrack = (event) => {
        const receivedStream = event.streams[0];
        console.log("Received remote stream :: ", receivedStream);
      };

      peerConnection.onicecandidate = (event) => {
        console.log("ICE candidate :: ", event.candidate);
        if (event.candidate) {
          sendICECandidate(event.candidate);
        }
      };
    }

    handleCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.isOpen]);

  // exclude the current user
  const otherProfiles = useMemo(
    () =>
      props.profiles?.filter((profile) => profile.id !== session.user.id)[0],
    [props.profiles, session.user.id],
  );

  // handle the title change
  useEffect(() => {
    document.title = `Chat With ${otherProfiles?.full_name}`;
  }, [otherProfiles]);

  return (
    <>
      <header className="sticky top-0 bg-background pt-3 shadow-2xl shadow-background/50">
        <div className="flex items-center justify-between rounded-lg border border-default-100 bg-default-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Button onPress={() => navigate(-1)} isIconOnly variant="light">
              <IconArrowLeft />
            </Button>
            <h1 className="text-sm font-semibold lg:text-lg">
              Chat With {otherProfiles?.full_name.split(" ")[0]}
            </h1>
          </div>
          <div className="flex gap-3">
            {/* <Tooltip content="Call"> */}
            <Button onPress={call.onOpen} isIconOnly>
              <IconPhoneCall />
            </Button>
            {/* </Tooltip> */}
            {/* <Tooltip content="Video Call">
              <Button isIconOnly>
                <IconVideo />
              </Button>
            </Tooltip> */}
          </div>
        </div>
      </header>
      <CallModal
        onOpenChange={call.onOpenChange}
        isOpen={call.isOpen}
        profiles={otherProfiles}
      />
    </>
  );
}

// function PrivateChat({ profiles }: Pick<Props, "profiles">) {
//   const { session } = useOutletContext<OutletContext>();
//   // exclude the current user
//   const otherProfiles = profiles?.filter(
//     (profile) => profile.id !== session.user.id,
//   )[0];

//   const navigate = useNavigate();

//   return (
//     <>
//       <div className="flex items-center gap-2">
//         <Button onPress={() => navigate(-1)} isIconOnly variant="light">
//           <IconArrowLeft />
//         </Button>
//         <h1 className="text-sm font-semibold lg:text-lg">
//           Chat With {otherProfiles?.full_name}
//         </h1>
//       </div>
//       {/* <Avatar
//         isBordered
//         size="md"
//         name={otherProfiles?.full_name}
//         src={otherProfiles?.avatar_url}
//       /> */}
//     </>
//   );
// }
