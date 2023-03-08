import { type NextPage } from "next";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { config } from "~/config";
import { Button } from "~/components";
import { getGuestServerSideProps } from "~/server/auth";

const Login: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>{config.app.title} - Login</title>
      </Head>

      <div className="flex h-screen bg-neutral-900 font-sans text-white">
        <div className="w-1/2 bg-neutral-300"></div>

        <div className="h-full w-1/2">
          <div className="flex h-full items-center justify-center py-4 px-4">
            <div className="w-[240px]">
              Welcome Back
              <div className="mb-4"></div>
              <Button full variant="primary" onClick={() => signIn()}>
                Login with Discord
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { getGuestServerSideProps as getServerSideProps, Login as default };
