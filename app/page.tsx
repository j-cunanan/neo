import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import SidePanel from "./components/side-panel";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <SidePanel /> {/* Add the Side Panel to the layout */}
      <main className="flex-1 flex flex-col items-center gap-10 p-24 background-gradient">
        {/* <Header /> */}
        <ChatSection />
      </main>
    </div>
  );
}
