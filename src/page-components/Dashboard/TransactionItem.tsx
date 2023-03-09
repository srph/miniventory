import { formatDistanceToNow } from "date-fns";
import { BigNumber } from "bignumber.js";
import Boring from "boring-avatars";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { IoCaretDown } from "react-icons/io5";
import * as Accordion from "@radix-ui/react-accordion";
import { api } from "~/utils/api";

const TransactionItem: React.FC = ({ transaction }) => {
  const { data: itemsQuery } = api.transactions.getTransactionItems.useQuery({
    transactionId: transaction.purchaseOrder.id,
  });

  return (
    <Accordion.Item
      value={transaction.id}
      className="overflow-hidden rounded bg-neutral-500"
    >
      <Accordion.Header className="flex h-[48px] items-center py-3 px-3">
        <div className="w-[240px] shrink-0">
          <span className="font-mono">{transaction.purchaseOrder.code}</span>
        </div>

        <div className="w-[200px] shrink-0">
          {Boolean(transaction.purchaseOrder.customer) && (
            <div className="flex items-center gap-2">
              <Boring
                size={24}
                colors={["#0F7D7E", "#76B5A0", "#FFFDD1", "#FF7575", "#D33649"]}
                name="Marie Joyce"
              />
              {transaction.purchaseOrder.customer.name}
            </div>
          )}
        </div>

        <div className="w-[200px] shrink-0">
          {transaction.purchaseOrder.totalQuantity} units purchased
        </div>

        <div className="w-[200px] shrink-0">
          <div className="flex items-center gap-2">
            {transaction.purchaseOrder.totalProfit > 0 && (
              <span className="text-emerald-400">
                <AiOutlineArrowUp />
              </span>
            )}

            {transaction.purchaseOrder.totalProfit <= 0 && (
              <span className="text-red-500">
                <AiOutlineArrowDown />
              </span>
            )}

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

          <Accordion.Trigger>
            <IoCaretDown />
          </Accordion.Trigger>
        </div>
      </Accordion.Header>

      <Accordion.Content className="overflow-hidden py-3 px-3">
        <div>
          <div className="flex items-center">
            <div className="w-[440px]">
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
                  <div className="w-[440px]">
                    <div className="flex items-center gap-2">
                      {t.item.thumbnailUrl ? (
                        <img
                          src={t.item.thumbnailUrl}
                          className="h-[24px] w-[24px] rounded"
                        />
                      ) : (
                        <div className="h-[24px] w-[24px] rounded bg-neutral-800" />
                      )}

                      <span>
                        {t.item.name}{" "}
                        <span className="text-neutral-300">
                          ({t.quantity}x)
                        </span>
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
      </Accordion.Content>
    </Accordion.Item>
  );
};

export { TransactionItem };
