import Navbar from "../Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-screen  min-h-screen flex flex-col justify-start items-center">
      <Navbar />
      {children}
    </div>
  );
}
