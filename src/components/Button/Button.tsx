import React from "react";
import cx from "classnames";
import { IoAmericanFootball } from "react-icons/io5";

type ButtonVariant = "primary" | "default";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  full?: boolean;
}

type CombinedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps;

// Make this a polymorphic component that can be a a button or link
const Button: React.FC<CombinedButtonProps> = ({
  children,
  full = false,
  variant = "default",
  ...rest
}) => {
  return (
    <button
      type="button"
      className={cx("rounded px-4 py-3", {
        "bg-emerald-400": variant === "primary",
        "bg-neutral-500": variant === "default",
        "inline-block": !full,
        "block w-full": full,
      })}
      {...rest}
    >
      <div className="flex items-center gap-2">
        <span
          className={cx({
            "text-emerald-700": variant === "primary",
            "text-neutral-400": variant === "default",
          })}
        >
          <IoAmericanFootball />
        </span>

        <span
          className={cx("font-medium", {
            "text-emerald-800": variant === "primary",
          })}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

export { Button };
