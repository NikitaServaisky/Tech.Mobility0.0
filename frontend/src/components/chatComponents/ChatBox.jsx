import React from "react";
import Button from "../buttonComponent/button";

const ChatBox = ({ rideId, userId, messages, message, setMessage, onSendMessage }) => {
  return (
    <div className="chat-box">
      <h3>צ'אט עם הנהג</h3>
      <div className="messages">
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.senderId === userId ? "אתה" : "נהג"}:</strong>{" "}
            {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="כתוב הודעה לנהג..."
      />
      <Button onClick={onSendMessage} label="שלח הודעה" />
    </div>
  );
};

export default ChatBox;
