import { formatDistanceToNow } from "date-fns";
import { BigNumber } from "bignumber.js";
import Boring from "boring-avatars";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { IoCaretDown } from "react-icons/io5";
import * as Accordion from "@radix-ui/react-accordion";
import { api } from "~/utils/api";

const InventoryItem: React.FC = ({ item }) => {
  return (
    <div className="flex items-center rounded bg-neutral-500 py-3 px-3">
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
    </div>
  );
};

export { InventoryItem };
