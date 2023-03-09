import { BigNumber } from "bignumber.js";
import Boring from "boring-avatars";
import { AiOutlineArrowUp } from "react-icons/ai";
import { IoCaretDown } from "react-icons/io5";
import { Button } from "~/components";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/utils/api";

const Dashboard: React.FC = () => {
  const { data: transactionsQuery, isLoading: isTransactionsQueryLoading } =
    api.transactions.getAll.useQuery({ search: "" });

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
          <div className="rounded bg-neutral-500" key={i}>
            <div className="flex items-center py-3 px-3">
              <div className="w-[200px] shrink-0">
                {transaction.purchaseOrder.code}
              </div>
              <div className="w-[200px] shrink-0">
                <div className="flex items-center gap-2">
                  <Boring
                    size={24}
                    colors={[
                      "#0F7D7E",
                      "#76B5A0",
                      "#FFFDD1",
                      "#FF7575",
                      "#D33649",
                    ]}
                    name="Marie Joyce"
                  />
                  {transaction.purchaseOrder.customer.name}
                </div>
              </div>
              <div className="w-[200px] shrink-0">
                {transaction.purchaseOrder.totalQuantity} units purchased
              </div>
              <div className="w-[200px] shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">
                    <AiOutlineArrowUp />
                  </span>
                  <span className="font-medium">
                    {new BigNumber(
                      transaction.purchaseOrder.totalSales
                    ).toFormat(2)}
                  </span>
                </div>
              </div>

              <div className="flex w-full justify-end gap-8">
                <span className="text-neutral-300">
                  {formatDistanceToNow(
                    new Date(transaction.purchaseOrder.createdAt)
                  )}{" "}
                  ago
                </span>
                <IoCaretDown />
              </div>
            </div>

            <div className="py-3 px-3">
              <div className="flex items-center">
                <div className="w-[400px]">
                  <div className="font-medium text-neutral-300">Unit</div>
                </div>

                <div className="w-[200px]">
                  <div className="font-medium text-neutral-300">
                    Retail Price
                  </div>
                </div>

                <div className="w-[200px]">
                  <div className="font-medium text-neutral-300">
                    Selling Price
                  </div>
                </div>
              </div>

              <div className="mb-4"></div>

              <div className="space-y-2">
                {[[], [], []].map((item, j) => {
                  return (
                    <div className="flex items-center" key={j}>
                      <div className="w-[400px]">
                        <div className="flex items-center gap-3">
                          <div className="h-[24px] w-[24px] rounded bg-neutral-800" />
                          <span>
                            Sereese Beauty Face & Body{" "}
                            <span className="text-neutral-300">(4 pcs)</span>
                          </span>
                        </div>
                      </div>

                      <div className="w-[200px]">400.00</div>

                      <div className="w-[200px]">500.00</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Dashboard };
