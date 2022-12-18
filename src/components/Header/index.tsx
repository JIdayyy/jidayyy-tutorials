import dynamic from "next/dynamic";

const DynamicLottie = dynamic(() => import("../Lotties/Terminal"), {
  ssr: true,

  loading: () => (
    <div className="flex w-[40%] min-w-[400px] min-h-[400px] h-full justify-center items-center mb-4  bg-gray-300 rounded dark:bg-gray-700">
      <svg
        className="w-12 h-12 text-gray-200 dark:text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
  ),
});

export default function Header() {
  return (
    <div className="px-2 w-full z-0 relative flex flex-col align-middle items-center mt-5 justify-between text-white">
      <div className="max-w-7xl w-full py-10 flex justify-between md:justify-between">
        <div className="text-2xl  md:text-6xl  min-w-1/3 text-left w-full md:w-1/2 flex flex-col justify-center items-start">
          <h1 className="text-2xl  md:text-6xl">
            <span className="text-blue-100">Jidayyy&apos;s</span>
            <p className="text-2xl  md:text-6xl">Tutorials</p>
          </h1>
          <p className="text-2xl  md:text-6xl">Grab a ☕️ and chill a bit !</p>
        </div>
        <DynamicLottie />
      </div>
    </div>
  );
}
