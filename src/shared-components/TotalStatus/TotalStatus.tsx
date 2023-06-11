import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface TotalStatusProps {
  positive: boolean;
}

const TotalStatus: React.FC<TotalStatusProps> = ({ positive }) => {
  if (positive) {
    return (
      <span className="text-emerald-400">
        <AiOutlinePlus />
      </span>
    );
  }

  return (
    <span className="text-red-500">
      <AiOutlineMinus />
    </span>
  );
};

export { TotalStatus };
