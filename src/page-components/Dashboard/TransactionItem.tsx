import { formatDistanceToNow } from "date-fns";
import { BigNumber } from "bignumber.js";
import Boring from "boring-avatars";
import { TotalStatus } from "~/shared-components/TotalStatus";
import { IoCaretDown } from "react-icons/io5";
import * as Accordion from "@radix-ui/react-accordion";
import { api } from "~/utils/api";

const TransactionItem: React.FC = ({ transaction }) => {
  const { purchaseOrder, restockOrder } = transaction;

  const { data: itemsQuery } = api.transactions.getTransactionItems.useQuery({
    purchaseOrderId: purchaseOrder?.id,
    restockOrderId: restockOrder?.id,
  });

  return (
    <Accordion.Item
      value={transaction.id}
      className="overflow-hidden rounded bg-neutral-500"
    >
      <Accordion.Header className="flex h-[48px] items-center py-3 px-3">
        <div className="w-[240px] shrink-0">
          <span className="font-mono">
            {purchaseOrder ? purchaseOrder.code : restockOrder.code}
          </span>
        </div>

        <div className="w-[40px] shrink-0">
          {Boolean(purchaseOrder?.customer) && (
            <div className="flex items-center gap-2">
              <Boring
                size={24}
                colors={["#0F7D7E", "#76B5A0", "#FFFDD1", "#FF7575", "#D33649"]}
                name="Marie Joyce"
              />
            </div>
          )}
        </div>

        <div className="w-[200px] shrink-0">
          {Boolean(purchaseOrder) && (
            <span>{purchaseOrder.totalQuantity} units purchased</span>
          )}

          {restockOrder && (
            <span>{restockOrder.totalQuantity} units restocked</span>
          )}
        </div>

        <div className="w-[200px] shrink-0"></div>

        <div className="w-[200px] shrink-0">
          {Boolean(purchaseOrder) && (
            <div className="flex items-center gap-2">
              <TotalStatus positive />

              <span className="font-medium">
                {new BigNumber(purchaseOrder.totalSales).toFormat(2)}
              </span>
            </div>
          )}

          {Boolean(restockOrder) && (
            <div className="flex items-center gap-2">
              <TotalStatus positive={false} />

              <span className="font-medium">
                {new BigNumber(restockOrder.totalExpenses).toFormat(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full justify-end gap-8">
          <span className="text-neutral-300">
            {Boolean(purchaseOrder) && (
              <span>
                {formatDistanceToNow(new Date(purchaseOrder.createdAt))} ago
              </span>
            )}

            {Boolean(restockOrder) && (
              <span>
                {formatDistanceToNow(new Date(restockOrder.createdAt))} ago
              </span>
            )}
          </span>

          <Accordion.Trigger>
            <span className="text-neutral-300">
              <IoCaretDown />
            </span>
          </Accordion.Trigger>
        </div>
      </Accordion.Header>

      <Accordion.Content className="overflow-hidden px-3 pb-3">
        <div>
          <div className="flex items-center">
            <div className="w-[280px]">
              <div className="font-medium text-neutral-300">Item</div>
            </div>

            <div className="w-[200px]">
              <div className="font-medium text-neutral-300">Quantity</div>
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
                <div className="flex items-center" key={t.id}>
                  <div className="w-[280px]">
                    <div className="flex items-center gap-2">
                      {t.item.thumbnailUrl ? (
                        <img
                          src={t.item.thumbnailUrl}
                          className="h-[24px] w-[24px] rounded"
                        />
                      ) : (
                        <div className="h-[24px] w-[24px] rounded bg-neutral-800" />
                      )}

                      <span>{t.item.name}</span>
                    </div>
                  </div>

                  <div className="w-[200px]">{t.quantity} pc</div>

                  <div className="w-[200px]">
                    {purchaseOrder && (
                      <span>
                        {new BigNumber(t.transactionPrice).toFormat(2)}
                      </span>
                    )}

                    {restockOrder && (
                      <span>{new BigNumber(t.factoryPrice).toFormat(2)}</span>
                    )}
                  </div>

                  <div className="w-[200px]">
                    {purchaseOrder && (
                      <span>
                        {new BigNumber(t.transactionPrice)
                          .multipliedBy(t.quantity)
                          .toFormat(2)}
                      </span>
                    )}

                    {restockOrder && (
                      <span>
                        {new BigNumber(t.factoryPrice)
                          .multipliedBy(t.quantity)
                          .toFormat(2)}
                      </span>
                    )}
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
