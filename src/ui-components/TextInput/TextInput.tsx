import React from "react";

interface TextInputProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

type CombinedTextInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  TextInputProps;

// Make this a polymorphic component that can be a a button or link
const TextInput: React.FC<CombinedTextInputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="mb-3 block w-full font-medium text-neutral-400">
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder="Search for a transaction #"
        className="block w-full rounded border border-neutral-700 bg-neutral-800 py-3 px-3 leading-none"
        {...props}
      />
      {error && (
        <>
          <div className="mb-2"></div>
          <div className="text-red-600">{error}</div>
        </>
      )}
    </div>
  );
};

export { TextInput };
