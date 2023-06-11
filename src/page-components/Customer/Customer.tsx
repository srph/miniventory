import { useState } from "react";
import { Button } from "~/ui-components";
import { api } from "~/utils/api";
import { CustomerItem } from "./CustomerItem";

const Customer: React.FC = () => {
  const [search, setSearch] = useState("");

  const { data: customersQuery } = api.customers.getAll.useQuery({
    search,
  });

  return (
    <div className="mx-auto w-[1000px] px-2">
      <div className="flex items-center justify-between">
        <div className="w-[400px]">
          <input
            type="text"
            placeholder="Search for an item by name"
            className="block w-full rounded border border-neutral-700 bg-neutral-800 py-3 px-3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button>Stock</Button>
        </div>
      </div>

      <div className="mb-16"></div>

      <div className="flex items-center px-3 font-medium text-neutral-500">
        <div className="w-[320px]">Name</div>
        <div className="w-[200px]">Phone</div>
        <div className="w-[200px]">Email</div>
        <div className="w-[200px]">Note</div>
        <span className="w-[20px]"></span>
      </div>

      <div className="mb-3"></div>

      <div className="space-y-2">
        {customersQuery?.customers.map((customer) => {
          return <CustomerItem key={customer.id} customer={customer} />;
        })}
      </div>
    </div>
  );
};

export { Customer };
