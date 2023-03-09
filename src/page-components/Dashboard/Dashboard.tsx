import { BigNumber } from "bignumber.js";
import Boring from "boring-avatars";
import { AiOutlineArrowUp } from "react-icons/ai";
import { IoCaretDown } from "react-icons/io5";
import { Button } from "~/components";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/utils/api";
import { TransactionItem } from "./TransactionItem";

const Dashboard: React.FC = () => {
  const { data: transactionsQuery } = api.transactions.getAll.useQuery({
    search: "",
  });

  return (
    <div className="mx-auto w-[1120px] px-2">
      <div className="flex items-center justify-between">
        <div className="w-[400px]">
          <input
            type="text"
            placeholder="Search for a transaction #"
            className="block w-full rounded border border-neutral-700 bg-neutral-800 py-3 px-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button>Customer</Button>
          <Button>Types</Button>
          <Button>Sort</Button>
          <Button>Date</Button>
        </div>
      </div>

      <div className="mb-16"></div>

      <h3 className="mb-4">March 2023</h3>

      <div className="space-y-4">
        {transactionsQuery?.transactions.map((transaction, i) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export { Dashboard };
