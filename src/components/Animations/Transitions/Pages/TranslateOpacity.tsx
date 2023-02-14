/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import React from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import gsap from "gsap";

interface IProps {
  children: React.ReactNode;
}

export default function TranslateOpacity({ children }: IProps) {
  const router = useRouter();
  const clipPathRef = React.useRef(null);

  const onPageEnter = (element: any) => {
    gsap.fromTo(
      element,
      {
        y: 50,
        autoAlpha: 0,
        ease: "power3.out",
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 3,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".overlay",
      {
        duration: 1,
        "--clip": "100%",
      },
      {
        duration: 1,
        "--clip": "0%",
      }
    );
  };

  const onPageExit = (element: any) => {
    gsap
      .fromTo(
        ".overlay",
        {
          duration: 1,
          "--clip": "0%",
        },
        {
          duration: 1,
          "--clip": "100%",
        }
      )
      .then(() => {
        gsap.fromTo(
          element,
          {
            y: 0,
            autoAlpha: 1,
            ease: "power3.out",
          },
          {
            y: -50,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power3.inOut",
          }
        );
      });
  };

  return (
    <>
      <section className="overlay" ref={clipPathRef} />;
      <SwitchTransition>
        <Transition
          key={router.pathname}
          timeout={500}
          in
          onEnter={onPageEnter}
          onExit={onPageExit}
          mountOnEnter
          unmountOnExit
        >
          {children}
        </Transition>
      </SwitchTransition>
    </>
  );
}
