import { type NextPage } from "next";
import { AppLayout } from "~/page-components/AppLayout";
import { CustomerCreate } from "~/page-components/CustomerCreate";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const CustomerCreatePage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <CustomerCreate />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  CustomerCreatePage as default,
};
