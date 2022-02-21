import { useState, useEffect, useRef } from "react";
import typingGif from "../assets/typing.gif";
import { RiSendPlaneFill } from "react-icons/ri";

export const Chat = ({ socket, username, room }) => {
  const [currMessage, setCurrMessage] = useState();
  const [messageList, setMessageList] = useState([]);
  const [typing, setTyping] = useState(false);
  let timer;

  const endOfMessages = useRef(null);

  const scroolToBottom = () => {
    endOfMessages.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (ev) => {
    ev.preventDefault();
    if (currMessage !== "") {
      const messageData = {
        room,
        author: username,
        message: currMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send-message", messageData);
      setMessageList((prev) => [...prev, messageData]);
      setCurrMessage("");
    }
  };

  const handleChange = (ev) => {
    ev.target.style.height = "auto";
    ev.target.style.height = ev.target.scrollHeight + "px";
    setCurrMessage(ev.target.value);
    socket.emit("typing", room);
  };

  useEffect(() => {
    scroolToBottom();
  }, [messageList]);

  useEffect(() => {
    // first time getting to chat
    setMessageList((prev) => [
      ...prev,
      {
        author: "Noby",
        message: `Hi ${username} I am Noby and I know the answer to any question in the world 🤩 Okay not any question but I am always happy to learn, try to ask me something.. 🧐`,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      },
    ]);
  }, []);

  useEffect(async () => {
    await socket.on("receive-message", (data) => {
      setTyping(false);
      setMessageList((prev) => [...prev, data]);
    });
    socket.on("bot-message", (botAnswer) => {
      setMessageList((prev) => [
        ...prev,
        {
          author: "Noby",
          message: botAnswer,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        },
      ]);
    });
    socket.on("other-typing", () => {
      setTyping(true);
      clearTimeout(timer);
      timer = setTimeout(() => setTyping(false), 2000);
      scroolToBottom();
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((obj, idx) => (
          <div
            className="message"
            key={idx}
            id={username === obj.author ? "you" : "other"}
          >
            <div>
              <div className="message-content">
                <p>{obj.message}</p>
              </div>
              <div className="message-meta">
                <p className="username">
                  {username === obj.author ? "me" : obj.author}
                </p>
                <p className="time"> , {obj.time}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessages}></div>
        {typing && (
          <div className="typing">
            <img src={typingGif} alt="" />
          </div>
        )}
      </div>
      <div className="chat-footer">
        <textarea
          value={currMessage}
          type="text"
          placeholder="Message..."
          onChange={(ev) => {
            handleChange(ev);
          }}
          onKeyPress={(ev) => ev.key === "Enter" && sendMessage(ev)}
        />
        <button onClick={() => sendMessage()}>
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
};
