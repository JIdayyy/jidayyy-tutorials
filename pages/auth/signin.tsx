/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Button from "../../src/components/Atoms/Button";
import Input from "../../src/components/Atoms/Input";
import Layout from "../../src/components/Layout/Layout";
import { NextPageWithLayout } from "../_app";

const SignIn: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  const { register } = useForm();

  return (
    <div className="w-screen h-screen flexColContainerCenter">
      <form className="flexColContainerCenter border-light w-1/5 border-blue-50 bg-blue-400 p-5 space-y-4">
        <h1>Sign In</h1>
        <Input
          variant="solid"
          placeholder="Email"
          register={register}
          type="text"
          name="email"
        />
        <Input
          variant="solid"
          placeholder="Password"
          register={register}
          type="password"
          name="password"
        />
        <Button text="Sign In" variant="action" className="w-full" />

        {providers &&
          Object.values(providers).map((provider) => (
            <div className="w-full px-2 py-1" key={provider.name}>
              <button type="button" onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
      </form>
    </div>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

SignIn.getLayout = (page) => <Layout>{page}</Layout>;

export default SignIn;
