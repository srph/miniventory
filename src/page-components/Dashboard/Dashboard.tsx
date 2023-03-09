import * as Accordion from "@radix-ui/react-accordion";
import { Button } from "~/components";
import { api } from "~/utils/api";
import { TransactionItem } from "./TransactionItem";

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
          {transactionsQuery?.transactionsByMonth.map((group, i) => (
            <div>
              <h3 className="mb-4">{group.label}</h3>

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
          ))}
        </div>
      </Accordion.Root>
    </div>
  );
};

export { Dashboard };
