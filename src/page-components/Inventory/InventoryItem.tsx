import Link from "next/link";
import { BigNumber } from "bignumber.js";
import { TbPencil } from "react-icons/tb";

const InventoryItem: React.FC = ({ item }) => {
  return (
    <div className="group flex items-center rounded bg-neutral-500 py-3 px-3">
      <span className="w-[160px]">
        <span className="text-neutral-300">{item.brand.name}</span>
      </span>

      <div className="flex w-[400px] items-center gap-2">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} className="h-[32px] w-[32px] rounded" />
        ) : (
          <div className="h-[32px] w-[32px] rounded bg-neutral-400" />
        )}

        <div className="flex w-full items-center justify-between gap-2">
          <span className="w-full truncate text-white">{item.name}</span>
        </div>
      </div>

      <span className="w-[160px]">
        {new BigNumber(item.factoryPrice).toFormat(2)}
      </span>

      <span className="w-[160px]">
        {new BigNumber(item.retailPrice).toFormat(2)}
      </span>

      <span className="w-[160px]">
        {item.quantity > 0 ? (
          <span>{item.quantity} pcs</span>
        ) : (
          <span className="text-neutral-300">Out of stock</span>
        )}
      </span>

      <span className="ml-auto opacity-0 group-hover:opacity-100">
        <Link
          href={`/inventory/${item.id}/edit`}
          className="text-xl text-neutral-300"
        >
          <TbPencil />
        </Link>
      </span>
    </div>
  );
};

export { InventoryItem };
