import { BigNumber } from "bignumber.js";
import Boring from "boring-avatars";
import { AiOutlineArrowUp } from "react-icons/ai";
import { IoCaretDown } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/utils/api";

const TransactionItem: React.FC = ({ transaction }) => {
  const { data: itemsQuery } = api.transactions.getTransactionItems.useQuery({
    transactionId: transaction.purchaseOrder.id,
  });

  console.log(itemsQuery);

  return (
    <div className="rounded bg-neutral-500">
      <div className="flex items-center py-3 px-3">
        <div className="w-[200px] shrink-0">
          {transaction.purchaseOrder.code}
        </div>
        <div className="w-[200px] shrink-0">
          <div className="flex items-center gap-2">
            <Boring
              size={24}
              colors={["#0F7D7E", "#76B5A0", "#FFFDD1", "#FF7575", "#D33649"]}
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
              {new BigNumber(transaction.purchaseOrder.totalSales).toFormat(2)}
            </span>
          </div>
        </div>

        <div className="flex w-full justify-end gap-8">
          <span className="text-neutral-300">
            {formatDistanceToNow(new Date(transaction.purchaseOrder.createdAt))}{" "}
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
            <div className="font-medium text-neutral-300">Price</div>
          </div>

          <div className="w-[200px]">
            <div className="font-medium text-neutral-300">Total</div>
          </div>
        </div>

        <div className="mb-4"></div>

        <div className="space-y-2">
          {itemsQuery?.transactionItems.map((t, i) => {
            return (
              <div className="flex items-center" key={i}>
                <div className="w-[400px]">
                  <div className="flex items-center gap-3">
                    <div className="h-[24px] w-[24px] rounded bg-neutral-800" />
                    <span>
                      {t.item.name}{" "}
                      <span className="text-neutral-300">({t.quantity}x)</span>
                    </span>
                  </div>
                </div>

                <div className="w-[200px]">
                  {new BigNumber(t.transactionPrice).toFormat(2)}
                </div>

                <div className="w-[200px]">
                  {new BigNumber(t.transactionPrice)
                    .multipliedBy(t.quantity)
                    .toFormat(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { TransactionItem };
