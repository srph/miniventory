import React, { useState, useMemo } from "react";
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
  option?: (option: AutocompleteOption<T>) => React.ReactNode;
  onInput?: (value: string) => void;
  onSelect: (value: string, meta?: T) => void;
  onCreate?: (value: string, meta?: T) => void;
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
  onInput,
  onSelect,
  onCreate,
  children,
}: AutocompleteProps<T>) {
  const [input, setInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value);

    onInput?.(value);

    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    setInput("");
    onInput?.("");
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
    <Command>
      <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <div>{children}</div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="w-[320px] rounded border border-neutral-700 bg-neutral-800 px-3 py-3"
            sideOffset={16}
          >
            <div className="px-1.5">
              <Command.Input
                value={input}
                onValueChange={handleInputChange}
                className="block w-full rounded border border-neutral-700 bg-neutral-800 py-3 px-3 leading-none text-white"
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
                        onSelect(opt.value, opt.meta);
                      }}
                    >
                      {option(opt)}
                    </Command.Item>
                  );
                })}
            </Command.List>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </Command>
  );
}

export { Autocomplete };
