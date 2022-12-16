/* eslint-disable @typescript-eslint/no-use-before-define */

import mermaid from "mermaid";
import { ReactNode, useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCode: any = (arr = []) =>
  arr
    .map((dt: any) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

export function Code({
  children,
  className,
}: {
  children: ReactNode[];
  className?: string | undefined;
}) {
  const demoid = useRef(`dome${randomid()}`);
  const code = getCode(children);
  const demo = useRef<HTMLElement>(null);
  useEffect(() => {
    if (demo.current) {
      try {
        const str = mermaid.render(
          demoid.current,
          code,
          () => null,
          demo.current
        );
        demo.current.innerHTML = str;
      } catch (error) {
        demo.current.innerHTML = error as string;
      }
    }
  }, [code, demo]);
  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoid.current} style={{ display: "none" }} />
      </code>
    );
  }
  return <code className={String(className)}>{children}</code>;
}
