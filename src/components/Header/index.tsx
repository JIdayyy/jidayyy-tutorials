import TerminalLottie from "../Lotties/Terminal";

export default function Header() {
  return (
    <div className="px-2  w-full  flex flex-col align-middle items-center mt-5 justify-center text-white">
      <div className="max-w-7xl py-10 flex justify-center md:justify-between">
        <div className="text-2xl  md:text-6xl  min-w-1/3 text-left w-full md:w-1/2 flex flex-col justify-center items-start">
          <h1 className="text-2xl  md:text-6xl">
            Les tutos de <span className="text-blue-100">Jidayyy</span> !
          </h1>
          <p className="text-2xl  md:text-6xl">
            Sers toi un ☕️ et détends toi !
          </p>
        </div>
        <TerminalLottie />
      </div>
    </div>
  );
}
