import React, { useState, useMemo, useRef } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";

export interface AutocompleteOption<T> {
  label: string;
  value: string;
  meta: T;
}

interface AutocompleteProps<T> {
  children: React.ReactNode;
  options: AutocompleteOption<T>[];
  isLoading?: boolean;
  error?: Error | undefined;
  selected?: string[];
  closeOnSelect?: boolean;
  width?: number;
  option?: (option: AutocompleteOption<T>) => React.ReactNode;
  onInput?: (value: string) => void;
  onSelect: (value: string, meta: T) => void;
  onCreate?: (value: string, meta: T) => void;
}

function DefaultOption<T>({ value, label }: AutocompleteOption<T>) {
  return (
    <div className="flex items-center gap-2 rounded px-2 py-2 group-aria-selected:bg-neutral-500">
      {label}
    </div>
  );
}

function Autocomplete<T>({
  options,
  option = DefaultOption,
  isLoading,
  selected,
  closeOnSelect,
  width = 320,
  onInput,
  onSelect,
  onCreate,
  children,
}: AutocompleteProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value);

    onInput?.(value);
  };

  const handleSelect = (option: AutocompleteOption<T>) => {
    inputRef.current?.focus();

    onSelect(option.value, option.meta);

    if (closeOnSelect) {
      handleInputChange("");
      setIsOpen(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    handleInputChange("");
  };

  const ids = useMemo(() => {
    if (selected == null) {
      return {};
    }

    return selected.reduce((object: Record<string, boolean>, id: string) => {
      object[id] = true;
      return object;
    }, {});
  }, [selected]);

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <div>{children}</div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          style={{ width }}
          className="rounded border border-neutral-700 bg-neutral-800 px-3 py-3"
          sideOffset={16}
        >
          <Command label="Autocomplete" shouldFilter={false}>
            <div className="px-1.5">
              <Command.Input
                ref={inputRef}
                value={input}
                onValueChange={handleInputChange}
                className="block w-full rounded border border-neutral-700 bg-neutral-800 py-3 px-3 leading-none text-white focus:outline-1 focus:outline-neutral-500"
                placeholder="Search for an item to add"
              />
            </div>

            <div className="mb-2"></div>

            <Command.List>
              {isLoading && (
                <Command.Loading>
                  <div className="py-2 text-center text-neutral-500">
                    Loading...
                  </div>
                </Command.Loading>
              )}

              <Command.Empty>
                <div className="py-2 text-center text-neutral-500">
                  No results found
                </div>
              </Command.Empty>

              {options
                .filter((option) => {
                  return !ids[option.value];
                })
                .map((opt) => {
                  return (
                    <Command.Item
                      key={opt.value}
                      value={opt.value}
                      className="group"
                      onSelect={() => {
                        handleSelect(opt);
                      }}
                    >
                      {option(opt)}
                    </Command.Item>
                  );
                })}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { Autocomplete };
