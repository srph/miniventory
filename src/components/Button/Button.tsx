import React from "react";
import { IoAmericanFootball } from "react-icons/io5";

interface ButtonProps {
  children: React.ReactNode;
}

type CombinedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps;

const Button: React.FC<CombinedButtonProps> = ({ children, ...rest }) => {
  return (
    <button type="button" className="rounded bg-neutral-500 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-neutral-400">
          <IoAmericanFootball />
        </span>
        <span className="font-medium">{children}</span>
      </div>
    </button>
  );
};

export { Button };
