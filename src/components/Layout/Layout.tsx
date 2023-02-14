import dynamic from "next/dynamic";
import { TranslateOpacity } from "../Animations/Transitions/Pages";
import Footer from "../Footer";
import Navbar from "../Navbar";
import WaveSmall from "../svgs/wavesmall";

interface LayoutProps {
  children: React.ReactNode;
}

const DynamicCookies = dynamic(() => import("../Cookies"), {
  ssr: false,
});

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-screen relative min-h-screen flex flex-col justify-start items-center">
      <Navbar />
      <TranslateOpacity>
        <main className="z-[1] flex flex-col min-h-screen justify-start items-center w-full relative">
          {children}
        </main>
      </TranslateOpacity>
      <Footer />
      <WaveSmall className="rotate-180 absolute bottom-0 pointer-events-none z-0 left-0  opacity-25 w-screen" />
      <DynamicCookies />
    </div>
  );
}
