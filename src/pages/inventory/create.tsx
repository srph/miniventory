import { type NextPage } from "next";
import { AppLayout } from "~/page-components/AppLayout";
import { InventoryCreate } from "~/page-components/InventoryCreate";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const InventoryNewPage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <InventoryCreate />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  InventoryNewPage as default,
};
