import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { config } from "~/config";
import { Button } from "~/ui-components";
import { getGuestServerSideProps } from "~/server/auth";
import login from "~/assets/login.png";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>{config.app.title} - Login</title>
      </Head>

      <div className="flex h-screen bg-neutral-900 font-sans">
        <div className="relative w-1/2 overflow-hidden bg-neutral-300">
          <Image src={login} alt="tite" fill className="z-40" />

          <div className="relative z-50 h-full">
            <div className="p-10">
              <h1 className="inline border-2 border-black p-2 font-bold uppercase leading-none text-black">
                M
              </h1>
            </div>

            <div className="absolute bottom-0 left-0 z-50 p-10">
              <div className="text-2xl text-black">
                &mdash; Anything worth doing, is worth doing poorly.
              </div>
            </div>
          </div>
        </div>

        <div className="h-full w-1/2 text-white">
          <div className="flex h-full items-center justify-center py-4 px-4">
            <div className="w-[240px]">
              Welcome Back
              <div className="mb-4"></div>
              <Button full variant="primary" onClick={() => signIn()}>
                Login with Discord
              </Button>
              <div className="mb-[320px]"></div>
              <div className="text-center">By Joyce and Kier</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { getGuestServerSideProps as getServerSideProps, Login as default };
