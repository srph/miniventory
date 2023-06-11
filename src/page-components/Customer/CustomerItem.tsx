import Link from "next/link";
import { BigNumber } from "bignumber.js";
import { TbPencil } from "react-icons/tb";

const Empty = () => {
  return <span className="text-neutral-300">N/A</span>;
};

const CustomerItem: React.FC = ({ customer }) => {
  return (
    <div className="group flex items-center rounded bg-neutral-500 py-3 px-3">
      <div className="flex w-[320px] items-center gap-2">
        {customer.thumbnailUrl ? (
          <img
            src={customer.thumbnailUrl}
            className="h-[32px] w-[32px] rounded"
          />
        ) : (
          <div className="h-[32px] w-[32px] rounded bg-neutral-400" />
        )}

        <div className="flex w-full items-center justify-between gap-2">
          <span className="w-full truncate text-white">{customer.name}</span>
        </div>
      </div>

      <span className="w-[200px]">{customer.phone || <Empty />}</span>

      <span className="w-[200px]">{customer.email || <Empty />}</span>

      <span className="w-[200px]">{customer.note || <Empty />}</span>

      <span className="ml-auto opacity-0 group-hover:opacity-100">
        <Link
          href={`/customers/${customer.id}/edit`}
          className="text-xl text-neutral-300"
        >
          <TbPencil />
        </Link>
      </span>
    </div>
  );
};

export { CustomerItem };
