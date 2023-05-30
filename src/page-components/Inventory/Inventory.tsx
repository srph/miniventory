import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "~/ui-components";
import { api } from "~/utils/api";
import { InventoryItem } from "./InventoryItem";

const Inventory: React.FC = () => {
  const [search, setSearch] = useState("");

  const { data: itemsQuery } = api.inventory.getAll.useQuery({
    search,
  });

  console.log(
    api.inventory.getAll.useQuery({
      search,
    })
  );

  const { push } = useRouter();

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
          <Button variant="primary" onClick={() => push("/inventory/create")}>
            New Product
          </Button>
        </div>
      </div>

      <div className="mb-16"></div>

      <div className="flex items-center px-3 font-medium text-neutral-500">
        <span className="w-[160px]">Brand</span>
        <div className="w-[400px]">Name</div>
        <span className="w-[160px]">Factory Price</span>
        <span className="w-[160px]">Retail Price</span>
        <span className="w-[160px]">Quantity</span>
        <span className="w-[20px]"></span>
      </div>

      <div className="mb-3"></div>

      <div className="space-y-2">
        {itemsQuery?.items.map((item) => {
          return <InventoryItem key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

export { Inventory };
