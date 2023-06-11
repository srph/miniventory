import { type NextPage } from "next";
import { AppLayout } from "~/page-components/AppLayout";
import { CustomerEdit } from "~/page-components/CustomerEdit";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const CustomerEditPage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <CustomerEdit />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  CustomerEditPage as default,
};
