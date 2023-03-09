import React from "react";
import cx from "classnames";
import Boring from "boring-avatars";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components";
import { signOut, useSession } from "next-auth/react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useSession();

  const { pathname, push } = useRouter();

  if (data?.user === undefined) {
    throw new Error("User is not logged in.");
  }

  return (
    <>
      <main className="h-full min-h-screen bg-neutral-900 font-sans leading-none text-white">
        <div className="border-t-2 border-b border-t-emerald-500 border-b-neutral-800 py-4">
          <div className="mx-auto w-[1280px] px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className={cx("rounded px-3 py-3 font-medium", {
                    "text-neutral-400 ": pathname !== "/",
                    "bg-neutral-500 text-white": pathname === "/",
                  })}
                >
                  Dashboard
                </Link>

                <Link
                  href="/inventory"
                  className={cx(
                    "rounded px-3 py-3 font-medium  hover:text-white",
                    {
                      "text-neutral-400 ": pathname !== "/inventory",
                      "bg-neutral-500 text-white": pathname === "/inventory",
                    }
                  )}
                >
                  Inventory
                </Link>

                <Link
                  href="/customers"
                  className={cx(
                    "rounded px-3 py-3 font-medium  hover:text-white",
                    {
                      "text-neutral-400 ": pathname !== "/customers",
                      "bg-neutral-500 text-white": pathname === "/customers",
                    }
                  )}
                >
                  Customers
                </Link>
              </div>

              <div className="flex items-center gap-6">
                {pathname === "/" && (
                  <Button variant="primary" onClick={() => push("/orders/new")}>
                    New Purchase Order
                  </Button>
                )}

                {pathname === "/inventory" && (
                  <Button variant="primary" onClick={() => push("/orders/new")}>
                    New Item
                  </Button>
                )}

                {pathname === "/customers" && (
                  <Button variant="primary" onClick={() => push("/orders/new")}>
                    New Customer
                  </Button>
                )}

                <button type="button" onClick={() => signOut()}>
                  <Boring
                    size={40}
                    colors={[
                      "#0F7D7E",
                      "#76B5A0",
                      "#FFFDD1",
                      "#FF7575",
                      "#D33649",
                    ]}
                    name={data.user.name}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10"></div>

        {children}

        <div className="h-[120px]"></div>
      </main>
    </>
  );
};

export { AppLayout };
