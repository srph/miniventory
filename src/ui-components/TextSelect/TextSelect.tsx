import React from "react";

interface TextSelectProps {
  label?: string;
  error?: string;
  value?: string;
  children?: string;
  placeholder?: string;
  onChange?: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Make this a polymorphic component that can be a a button or link
const TextSelect: React.FC<TextSelectProps> = ({
  label,
  error,
  children,
  placeholder,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="mb-3 block w-full font-medium text-neutral-400">
          {label}
        </label>
      )}
      <select
        className="block w-full rounded border border-neutral-700 bg-neutral-800 py-3 px-3 leading-none"
        {...props}
      >
        <option>{placeholder ?? "Select an option"}</option>
        {children}
      </select>

      {error && (
        <>
          <div className="mb-2"></div>
          <div className="text-red-600">{error}</div>
        </>
      )}
    </div>
  );
};

export { TextSelect };
