import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import { Chat } from "./cmps/Chat";
import { Loby } from "./cmps/Loby";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join-room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <Loby joinRoom={joinRoom} setUsername={setUsername} setRoom={setRoom} />
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
