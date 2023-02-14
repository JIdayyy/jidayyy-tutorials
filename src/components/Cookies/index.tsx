/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from "react";

const isEnabled =
  localStorage.getItem("cookies-enabled") === "true" ? true : false;

export default function Cookies() {
  const [cookiesEnabled, setCookiesEnabled] = useState(isEnabled);

  const handleClick = () => {
    localStorage.setItem("cookies-enabled", "true");
    setCookiesEnabled(true);
  };

  return (
    <>
      {!cookiesEnabled && (
        <div className="w-screen h-screen fixed z-[200] bg-black bg-opacity-50 flex items-center align-middle justify-center">
          <div className="lg:w-1/2 md:w-2/3  min-h-1/2 bg-white rounded-xl p-3 w-[95vw] md:p-5 lg:p-10 flex flex-col items-center justify-between">
            <h1 className="text-2xl text-black font-bold">Cookies</h1>
            <p className="text-black">
              Cookies are used to acces and store informations on your device,
              to offer personalized content and ads, to analyze our traffic and
              to provide social media features. We also share information about
              your use of our site with our social media, advertising and
              analytics partners who may combine it with other information that
              you&apos;ve provided to them or that they&apos;ve collected from
              your use of their services. You consent to our cookies if you
              continue to use our website.
            </p>
            <button
              onClick={handleClick}
              type="button"
              className="bg-black my-10 text-xl rounded-full px-8 py-2 text-white"
            >
              I AGREE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
