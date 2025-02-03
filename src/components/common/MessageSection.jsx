import { useState } from "react";

const MessageSection = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: "您的机票预订已确认，祝您旅途愉快！", date: "2023-07-20" },
    { id: 2, content: "滨海湾花园将于下周进行特别夜间展览，不要错过！", date: "2023-07-19" },
    { id: 3, content: "感谢您的反馈，我们已经处理了您的请求。", date: "2023-07-18" },
  ]);

  return (
    <ul className="space-y-4">
      {messages.map((message) => (
        <li key={message.id} className="border-b pb-2">
          <p className="text-sm text-gray-600">{message.date}</p>
          <p>{message.content}</p>
        </li>
      ))}
    </ul>
  );
};

export default MessageSection;
