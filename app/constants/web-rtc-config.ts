export const WEB_RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
    { urls: "turn:homeo@turn.bistri.com:80", credential: "homeo" },
  ],
};
