import { useState } from "react";
import { Button } from "~/ui-components";
import { api } from "~/utils/api";
import { BrandItem } from "./BrandItem";

const Brand: React.FC = () => {
  const [search, setSearch] = useState("");

  const { data: brandsQuery } = api.brands.getDetailedList.useQuery({
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
        <div className="w-[240px]">Name</div>
        <div className="w-[400px]">Inventory</div>
        <div className="ml-auto w-[120px]">Date Added</div>
        <span className="ml-auto w-[20px]"></span>
      </div>

      <div className="mb-3"></div>

      <div className="space-y-2">
        {brandsQuery?.brands.map((brand) => {
          return <BrandItem key={brand.id} brand={brand} />;
        })}
      </div>
    </div>
  );
};

export { Brand };
