import { type NextPage } from "next";
import Head from "next/head";
import { config } from "~/config";
import { AppLayout } from "~/page-components/AppLayout";
import { Brand } from "~/page-components/Brand";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const BrandsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{config.app.title} - Brands</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Brand />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  BrandsPage as default,
};