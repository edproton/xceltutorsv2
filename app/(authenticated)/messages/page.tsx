import { Metadata } from "next";
import ChatBox from "./components/chat/chat-box";

export const metadata: Metadata = {
  title: "Messages | XcelTutors",
  description:
    "Connect with tutors and students through our messaging platform.",
};

export default function MessagePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ChatBox />
    </main>
  );
}
