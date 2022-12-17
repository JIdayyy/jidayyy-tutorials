import { motion } from "framer-motion";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export default function AnimationOpacity({ children }: IProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
