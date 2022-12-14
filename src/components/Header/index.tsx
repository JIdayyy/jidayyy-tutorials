import TerminalLottie from "../Lotties/Terminal";

export default function Header() {
  return (
    <div className=" w-full flex  mt-5 justify-between text-white">
      <div className="text-6xl min-w-1/3 text-left w-1/2 flex flex-col justify-center items-start">
        <h1 className="text-6xl">
          Les tutos de <span className="text-blue-100">Jidayyy</span> !
        </h1>
        <p className="text-6xl">Sers toi un ☕️ et détends toi !</p>
      </div>
      <TerminalLottie />
    </div>
  );
}
