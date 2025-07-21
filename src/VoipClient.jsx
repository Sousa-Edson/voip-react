import React, { useEffect, useRef, useState } from "react";
import JsSIP from "jssip";
import { useParams } from "react-router-dom";

const VoipClient = () => {
  const { user } = useParams(); // Vai capturar o parâmetro da URL (/user/:user)
  const [session, setSession] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const remoteAudio = useRef(null);
  const userAgentRef = useRef(null);

  // Configura dinamicamente o usuário e senha conforme parâmetro URL
  const config = {
    uri: `sip:${user}@localhost`,
    password: user === "1001" ? "senha123" : user === "1002" ? "senha123" : "",
    sockets: [new JsSIP.WebSocketInterface("ws://localhost:8088/ws")],
    session_timers: false,
  };

  const startUA = () => {
    const ua = new JsSIP.UA(config);

    ua.on("registered", () => setIsRegistered(true));
    ua.on("registrationFailed", (e) =>
      console.error("Registration failed:", e)
    );
    ua.on("newRTCSession", (e) => {
      const newSession = e.session;

      if (session) session.terminate();
      setSession(newSession);

      newSession.on("ended", () => setSession(null));
      newSession.on("failed", () => setSession(null));
      newSession.on("accepted", () => console.log("Call accepted"));
      newSession.on("confirmed", () => console.log("Call confirmed"));

      newSession.connection.addEventListener("track", (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      });
    });

    ua.start();
    userAgentRef.current = ua;
  };

  const makeCall = () => {
    if (!userAgentRef.current) return;

    const eventHandlers = {
      progress: () => console.log("Call is in progress"),
      failed: (e) => console.log("Call failed", e),
      ended: () => console.log("Call ended"),
      confirmed: () => console.log("Call confirmed"),
    };

    // Faz a chamada para o outro usuário (ex: se eu sou 1001, chamo o 1002 e vice-versa)
    const destination = user === "1001" ? "1002" : "1001";

    const options = {
      eventHandlers,
      mediaConstraints: { audio: true, video: false },
      rtcOfferConstraints: { offerToReceiveAudio: 1, offerToReceiveVideo: 0 },
    };

    userAgentRef.current.call(`sip:${destination}@localhost`, options);
  };

  const hangup = () => {
    if (session) session.terminate();
  };

  useEffect(() => {
    startUA();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Cliente SIP React - Usuário {user}</h2>
      <p>Status: {isRegistered ? "Registrado" : "Não Registrado"}</p>

      <button onClick={makeCall} disabled={!isRegistered}>
        Fazer Chamada
      </button>
      <button onClick={hangup} disabled={!session}>
        Encerrar Chamada
      </button>

      <audio ref={remoteAudio} autoPlay />
    </div>
  );
};

export default VoipClient;
