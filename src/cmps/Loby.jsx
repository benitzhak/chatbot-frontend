export const Loby = ({setUsername,setRoom,joinRoom}) => {
  return (
    <div className="joinChatContainer">
      <h3>Join a Chat</h3>
      <input
        type="text"
        placeholder="Your Name"
        onChange={(ev) => {
          setUsername(ev.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Room ID"
        onChange={(ev) => {
          setRoom(ev.target.value);
        }}
      />
      <button onClick={() => joinRoom()}>Join A Room</button>
    </div>
  );
};
