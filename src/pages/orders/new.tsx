import React, { useState, useMemo } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import * as Popover from "@radix-ui/react-popover";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { Command } from "cmdk";
import { config } from "~/config";
import {
  Autocomplete,
  AutocompleteOption,
  Button,
  TextInput,
} from "~/components";
import { AppLayout } from "~/page-components/AppLayout";
import { api } from "~/utils/api";
import { getAuthenticatedServerSideProps } from "~/server/auth";

// <Autocomplete items={items} onSelect={} onCreate={} option={} placeholder={{ input: '' }}><Button></Autocomplete>

const OrdersNew: NextPage = () => {
  const [itemsFilter, setItemsFilter] = useState("");

  const [customersFilter, setCustomersFilter] = useState("");

  const {
    data: itemsQuery,
    isLoading: isItemsQueryLoading,
    error: itemsQueryError,
  } = api.inventory.getAll.useQuery({
    search: itemsFilter,
  });

  const {
    data: customersQuery,
    isLoading: isCustomersQueryLoading,
    error: customersQueryError,
  } = api.customers.getAll.useQuery({
    search: customersFilter,
  });

  type Item = NonNullable<typeof itemsQuery>["items"][number];

  type Customer = NonNullable<typeof itemsQuery>["customers"][number];

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [items, setItems] = useState<Item[]>([]);

  const customers: AutocompleteOption<Customer>[] = useMemo(() => {
    return (customersQuery?.customers ?? []).map((customer) => {
      return { label: customer.name, value: customer.id, meta: customer };
    });
  }, [customersQuery]);

  const options: AutocompleteOption<Item>[] = useMemo(() => {
    return (itemsQuery?.items ?? []).map((item) => {
      return { label: item.name, value: item.id, meta: item };
    });
  }, [itemsQuery]);

  const selected = useMemo(() => {
    return items.map((item) => item.id);
  }, [items]);

  const handleSelectCustomer = (_: string, option: Customer) => {
    setCustomer(option);
  };

  const handleSelect = (_: string, option: Item) => {
    setItems((items) => [...items, option]);
  };

  const handleRemove = (index: number) => {
    return () => {
      setItems((items) => {
        return items.filter((_, i) => i !== index);
      });
    };
  };

  return (
    <>
      <Head>
        <title>{config.app.title} - Orders</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <div className="mx-auto w-[1280px] px-2">
          <div className="flex gap-12">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">New Purchase Order</h2>

                <div>
                  <Autocomplete<Item>
                    options={options}
                    selected={selected}
                    option={({ meta: item }) => (
                      <div className="flex items-center gap-2 rounded px-2 py-2 group-aria-selected:bg-neutral-500">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            className="h-[24px] w-[24px] rounded-full"
                          />
                        ) : (
                          <div className="h-[24px] w-[24px] rounded-full bg-neutral-500 group-aria-selected:bg-neutral-400" />
                        )}

                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="w-full truncate text-neutral-300 group-aria-selected:text-white">
                            {item.name}
                          </span>
                          <span className="shrink-0 text-neutral-500 group-aria-selected:text-neutral-300">
                            ({item.quantity} pcs)
                          </span>
                        </div>
                      </div>
                    )}
                    width={400}
                    isLoading={isItemsQueryLoading}
                    error={itemsQueryError}
                    onInput={setItemsFilter}
                    onSelect={handleSelect}
                  >
                    <Button type="button" variant="primary">
                      Add Item
                    </Button>
                  </Autocomplete>
                </div>
              </div>

              <div className="mb-8"></div>

              <div>
                {items.map((item, i) => (
                  <div
                    className="border-b-none flex items-center border-t border-l border-r border-neutral-700 bg-neutral-800 px-4 py-4 first:rounded-tl first:rounded-tr last:rounded-br last:rounded-bl last:border-b"
                    key={i}
                  >
                    <div className="flex w-[400px] shrink-0 items-center gap-4">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          className="h-[120px] w-[120px] rounded-full bg-neutral-500"
                        />
                      ) : (
                        <div className="h-[120px] w-[120px] rounded-full bg-neutral-500"></div>
                      )}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="mb-2"></div>
                        <span className="text-neutral-400">
                          {item.quantity} pcs / {item.retailPrice}.00 per piece
                        </span>
                      </div>
                    </div>

                    <div className="w-[140px] shrink-0">
                      <h4 className="text-neutral-400">Quantity</h4>
                      <div className="mb-2"></div>
                      <span className="font-medium">{item.quantity}</span>
                    </div>

                    <div className="w-[140px] shrink-0">
                      <h4 className="text-neutral-400">Price</h4>
                      <div className="mb-2"></div>
                      <span className="font-medium">{item.retailPrice}.00</span>
                    </div>

                    <div className="w-[140px] shrink-0">
                      <h4 className="text-neutral-400">Total</h4>
                      <div className="mb-2"></div>
                      <span className="font-medium">
                        {item.retailPrice * item.quantity}.00
                      </span>
                    </div>

                    <div className="w-full">
                      <button
                        type="button"
                        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
                        onClick={handleRemove(i)}
                      >
                        <IoClose />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[360px] shrink-0">
              <div className="flex h-[40px] items-center">
                <h2 className="transform text-2xl">Order Summary</h2>
              </div>

              <div className="mb-8"></div>

              <div className="rounded border border-neutral-700 bg-neutral-800 px-4 py-4">
                <div>
                  <label className="font-medium text-neutral-400">
                    Customer
                  </label>
                  <div className="mb-4"></div>

                  {customer == null && (
                    <Autocomplete<Item>
                      options={customers}
                      selected={customer ? [customer.id] : undefined}
                      option={({ meta: customer }) => (
                        <div className="flex items-center gap-2 rounded px-2 py-2 group-aria-selected:bg-neutral-500">
                          {customer.thumbnailUrl ? (
                            <img
                              src={customer.thumbnailUrl}
                              className="h-[24px] w-[24px] rounded-full"
                            />
                          ) : (
                            <div className="h-[24px] w-[24px] rounded-full bg-neutral-500 group-aria-selected:bg-neutral-400" />
                          )}

                          <span className="truncate text-neutral-300 group-aria-selected:text-white">
                            {customer.name}
                          </span>

                          <span className=" text-blue-500 group-aria-selected:text-neutral-300">
                            {customer.type === "reseller" && <MdVerified />}
                          </span>
                        </div>
                      )}
                      width={320}
                      isLoading={isItemsQueryLoading}
                      error={itemsQueryError}
                      closeOnSelect
                      onInput={setCustomersFilter}
                      onSelect={handleSelectCustomer}
                    >
                      <Button type="button" full>
                        Select Customer
                      </Button>
                    </Autocomplete>
                  )}

                  {Boolean(customer) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded px-2 py-2">
                        {customer.thumbnailUrl ? (
                          <img
                            src={customer.thumbnailUrl}
                            className="h-[24px] w-[24px] rounded-full"
                          />
                        ) : (
                          <div className="h-[24px] w-[24px] rounded-full bg-neutral-500 group-aria-selected:bg-neutral-400" />
                        )}

                        <span className="truncate text-neutral-300 group-aria-selected:text-white">
                          {customer.name}
                        </span>

                        <span className=" text-blue-500 group-aria-selected:text-neutral-300">
                          {customer.type === "reseller" && <MdVerified />}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
                        onClick={() => setCustomer(null)}
                      >
                        <IoClose />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-8"></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-neutral-400">
                      Total Sales
                    </label>

                    <div>2,320.00</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-neutral-400">
                      Expected Profit
                    </label>

                    <div>2,320.00</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-neutral-400">
                      Total Profit
                    </label>

                    <div>2,320.00</div>
                  </div>
                </div>

                <div className="mb-8"></div>

                <Button full variant="primary">
                  Confirm Purchase Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export {
  getAuthenticatedServerSideProps as getServerSideProps,
  OrdersNew as default,
};
