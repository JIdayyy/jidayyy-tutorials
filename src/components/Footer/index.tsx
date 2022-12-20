export default function Footer() {
  return (
    <div className="w-full py-2 flex flex-col items-center justify-center align-middle">
      <div className="space-x-2">
        <p>
          Made by{" "}
          <a
            href="https://github.com/JIdayyy"
            target="_blank"
            rel="noreferrer"
            className="text-blue-50"
          >
            Jidayyy
          </a>{" "}
          with ❤️ and ☕️ ! 🚀
        </p>
      </div>
      <div className="w-full flex space-x-2 justify-center align-middle items-center">
        <p>Powered by</p>
        <a
          className="text-blue-50"
          href="https://vercel.com/"
          target="_blank"
          rel="noreferrer"
        >
          Vercel
        </a>
        <p>and</p>
        <a
          className="text-blue-50"
          href="https://trpc.io/"
          target="_blank"
          rel="noreferrer"
        >
          Trpc
        </a>
      </div>
    </div>
  );
}
