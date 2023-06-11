import { type NextPage } from "next";
import { AppLayout } from "~/page-components/AppLayout";
import { BrandEdit } from "~/page-components/BrandEdit";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const BrandEditPage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <BrandEdit />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  BrandEditPage as default,
};
