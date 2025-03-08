"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sampleChats = [
  { id: 1, name: "HYS Enterprise", messages: [
      { sender: "employer", text: "Hello, we reviewed your application." },
      { sender: "employee", text: "Thank you! Looking forward to the next steps." }
    ]
  },
  { id: 2, name: "EUROCOM Group", messages: [
      { sender: "employer", text: "We are interested in your profile." },
      { sender: "employee", text: "Great! Let me know the details." }
    ]
  },
  ,
  { id: 3, name: "Excellent", messages: [
    { sender: "employee", text: "Hi, i have applied for the position of Software developer in your company." },
      { sender: "employer", text: "Greetings, we look into your CV and you didn't match our expectation, thanks." },
      { sender: "employee", text: "Thank you." }
    ]
  }
  ,
  { id: 4, name: "Ethio Telecom", messages: [
      { sender: "employer", text: "We are interested in your profile. Please share your CV" },
      { sender: "employee", text: "Great! Wil share my CV ASAP." },
      { sender: "employer", text: "Thanks, Well received" },
      { sender: "employee", text: "Please let me know if there is other things i need to submit." },
    ]
  }
];

export default function Inbox() {
  const [selectedChat, setSelectedChat] = useState(sampleChats[0]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim() === "") return;
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, { sender: "employee", text: message }],
    });
    setMessage("");
  };

  return (
    <div className="flex min-h-[500px] p-4">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <ul>
          {sampleChats.map((chat) => (
            <li
              key={chat.id}
              className={`p-2 cursor-pointer ${selectedChat.id === chat.id ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">{selectedChat.name}</h2>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-100 rounded-md">
          {selectedChat.messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg w-fit max-w-[70%] ${
                msg.sender === "employee" ? "bg-blue-500 text-white self-start" : "bg-gray-300 self-end"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex mt-4 gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}