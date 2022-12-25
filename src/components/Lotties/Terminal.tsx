/* eslint-disable react/function-component-definition */
import Lottie from "lottie-react";
import terminalLottie from "../../Lotties/lf20_2glqweqs.json";

const TerminalLottie = () => {
  return (
    <Lottie
      className="invisible md:visible md:min-h-[400px] md:min-w-[400px]"
      style={{ width: "40%" }}
      animationData={terminalLottie}
      loop
    />
  );
};

export default TerminalLottie;
