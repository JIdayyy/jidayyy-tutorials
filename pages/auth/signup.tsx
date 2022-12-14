/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { InferGetServerSidePropsType } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import { FaGithubSquare } from "react-icons/fa";
import { AiFillGoogleSquare } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Button from "../../src/components/Atoms/Button";
import Input from "../../src/components/Atoms/Input";
import Layout from "../../src/components/Layout/Layout";
import { NextPageWithLayout } from "../_app";
import AnimationOpacity from "../../src/components/Animations/AnimationOpacity";

const SignUp: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  const { register } = useForm();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  const ProviderConfig = {
    Google: {
      icon: <AiFillGoogleSquare color="white" size="30px" />,
      color: "bg-orange-800 hover:bg-orange-400",
    },
    GitHub: {
      icon: <FaGithubSquare color="white" size="30px" />,
      color: "bg-blue-400 hover:bg-blue-200",
    },
    Discord: {
      icon: <BsDiscord color="white" size="30px" />,
      color: "bg-purple-800 hover:bg-purple-400",
    },
  };

  return (
    <div className="w-screen h-[80vh] flexColContainerCenter">
      <motion.h1
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        Sign Un
      </motion.h1>
      <AnimationOpacity>
        <form className="flex flex-col  items-center justify-center border-light min-w-[440px]  border-blue-50 bg-blue-400 p-5 space-y-4">
          <Input
            options={{
              required: true,
            }}
            variant="solid"
            placeholder="Email"
            register={register}
            type="text"
            disabled
            name="email"
            className="w-full "
          />
          <Input
            options={{
              required: true,
            }}
            variant="solid"
            placeholder="Password"
            register={register}
            disabled
            type="password"
            name="password"
            className="w-full "
          />
          <Button text="Sign Un" variant="action" className="w-full" />
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                type="button"
                onClick={() => signIn(provider.id)}
                className={`w-full border-blue-50 border ${
                  ProviderConfig[provider.name as keyof typeof ProviderConfig]
                    .color
                } flex items-center align-middle justify-between text-white px-2 py-2`}
                key={provider.name}
              >
                <span>
                  {
                    ProviderConfig[provider.name as keyof typeof ProviderConfig]
                      .icon
                  }
                </span>
                <p className="font-bold">Sign Un with {provider.name}</p>
                <span />
              </button>
            ))}
          <div className="w-full flex justify-center space-x-1 ">
            <p>Allready got an account ? Sign In</p>
            <p
              onClick={() => router.push("/auth/signin")}
              className="text-blue-50 cursor-pointer underline font-bold"
            >
              here !
            </p>
          </div>
        </form>
      </AnimationOpacity>
    </div>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

SignUp.getLayout = (page) => <Layout>{page}</Layout>;

export default SignUp;
