import Navbar from "../Navbar";
import WaveSmall from "../svgs/wavesmall";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-screen   relative min-h-screen flex flex-col justify-start items-center">
      <Navbar />
      {children}
      <WaveSmall className="rotate-180 absolute bottom-0 pointer-events-none  left-0  opacity-25 w-screen" />
    </div>
  );
}
