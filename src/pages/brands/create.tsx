import { type NextPage } from "next";
import { AppLayout } from "~/page-components/AppLayout";
import { BrandCreate } from "~/page-components/BrandCreate";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const BrandCreatePage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <BrandCreate />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  BrandCreatePage as default,
};
