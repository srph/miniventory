import { type NextPage } from "next";
import Head from "next/head";
import { config } from "~/config";
import { AppLayout } from "~/page-components/AppLayout";
import { Customer } from "~/page-components/Customer";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const CustomersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{config.app.title} - Customers</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Customer />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  CustomersPage as default,
};