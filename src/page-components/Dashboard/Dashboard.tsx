import * as Accordion from "@radix-ui/react-accordion";
import { Button } from "~/ui-components";
import { api } from "~/utils/api";
import { TransactionItem } from "./TransactionItem";
import { TotalStatus } from "~/shared-components/TotalStatus";
import BigNumber from "bignumber.js";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Dashboard: React.FC = () => {
  const { data: transactionsQuery } = api.transactions.getAll.useQuery({
    search: "",
  });

  return (
    <div className="mx-auto w-[1280px] px-2">
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

      <Accordion.Root type="single" collapsible className="space-y-4">
        <div className="space-y-6">
          {transactionsQuery?.transactionsByMonth.map((group) => {
            return (
              <div key={group.label}>
                <div className="mb-4 flex items-center justify-between">
                  <h3>{group.label}</h3>

                  <div className="flex items-center gap-1">
                    <TotalStatus positive={group.total >= 0} />
                    {new BigNumber(group.total).abs().toFormat(2)}
                  </div>
                </div>

                <div className="space-y-2">
                  {group.transactions.map((transaction) => {
                    return (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Accordion.Root>
    </div>
  );
};

export { Dashboard };
