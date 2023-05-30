import { type NextPage } from "next";
import { AppLayout } from "~/page-components/AppLayout";
import { InventoryEdit } from "~/page-components/InventoryEdit";
import { getAuthenticatedServerSideProps } from "~/server/auth";

const InventoryEditPage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <InventoryEdit />
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  InventoryEditPage as default,
};
