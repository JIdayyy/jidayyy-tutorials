/* eslint-disable react/function-component-definition */
import Lottie from "lottie-react";
import terminalLottie from "../../Lotties/terminal.json";

const TerminalLottie = () => {
  return (
    <Lottie
      className="invisible md:visible min-w-[400px]"
      style={{ width: "40%" }}
      animationData={terminalLottie}
      loop
    />
  );
};

export default TerminalLottie;
