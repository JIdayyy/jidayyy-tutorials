/* eslint-disable react/function-component-definition */
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";

const Admin: NextPageWithLayout = () => {
  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  if (status === "loading") return <div>Loading...</div>;

  if (data?.user?.role !== Role.ADMIN) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  return <div className="w-full">ADMIN PAGE</div>;
};

export default Admin;
