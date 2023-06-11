import Link from "next/link";
import { TbPencil } from "react-icons/tb";
import { format } from "date-fns";
import BigNumber from "bignumber.js";

const Empty = () => {
  return <span className="text-neutral-300">N/A</span>;
};

const Inactive = () => {
  return (
    <span className="rounded bg-red-600 py-1 px-2 text-xs uppercase text-red-100">
      Inactive
    </span>
  );
};

const BrandItem: React.FC = ({ brand }) => {
  console.log(brand);

  const totalUnits = brand.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <div className="group flex items-center rounded bg-neutral-500 py-3 px-3">
      <div className="flex w-[240px] items-center gap-2">
        <span className="w-full truncate text-white">{brand.name}</span>
      </div>

      <span className="w-[400px]">
        {totalUnits > 0 ? (
          <span>
            {brand.items.length} items{" "}
            <span className="text-neutral-300">
              ({new BigNumber(totalUnits).toFormat()} units)
            </span>
          </span>
        ) : (
          <Inactive />
        )}
      </span>

      <span className="ml-auto w-[120px]">{format(brand.createdAt, "PP")}</span>

      <span className="ml-auto opacity-0 group-hover:opacity-100">
        <Link
          href={`/brands/${brand.id}/edit`}
          className="text-xl text-neutral-300"
        >
          <TbPencil />
        </Link>
      </span>
    </div>
  );
};

export { BrandItem };
