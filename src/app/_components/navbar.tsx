"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function Navbar() {
  const session = api.user.me.useSuspenseQuery()[0];
  let imageAlt;
  if (session?.image) {
    imageAlt = session.image;
  } else {
    imageAlt = undefined;
  }
  const fallBack = session?.name.replace(/^\s+/, "")[0];
  return (
    <div className="flex h-16 w-screen items-center justify-center bg-[#ee4492] text-[#ee4492]">
      <Link className="absolute left-0" href={"dashboard"}>
        <Image
          src={"/remine.png"}
          height={51}
          width={170}
          alt={"remine logo"}
        ></Image>
      </Link>

      <Menubar className="">
        <MenubarMenu>
          <MenubarTrigger>Purchasing</MenubarTrigger>
          <MenubarContent>
            <Link href={"/purchase-order"}>
              <MenubarItem>Purchase Order</MenubarItem>
            </Link>

            <MenubarSeparator />
            <Link href={"/supplier"}>
              <MenubarItem>Supplier</MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Inventory</MenubarTrigger>
          <MenubarContent>
            <Link href={"/product"}>
              <MenubarItem>Product</MenubarItem>
            </Link>
            <MenubarSeparator />
            <Link href={"/stock-card"}>
              <MenubarItem>Stock Card</MenubarItem>
            </Link>
            <MenubarSeparator />
            <Link href={"/warehouse"}>
              <MenubarItem>Warehouse</MenubarItem>
            </Link>
            <MenubarSeparator />
            <Link href={"/transfer-order"}>
              <MenubarItem>Transfer Order</MenubarItem>
            </Link>
            <MenubarSeparator />
            <Link href={"/repack-order"}>
              <MenubarItem>Repack Order</MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Sales</MenubarTrigger>
          <MenubarContent>
            <Link href={"/delivary-note"}>
              <MenubarItem>Delivary Note</MenubarItem>
            </Link>
            <MenubarSeparator />
            <Link href={"/customer"}>
              <MenubarItem>customer</MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="absolute right-5">
        <Menubar className="border-none bg-transparent">
          <MenubarMenu>
            <MenubarTrigger className="bg-transparent">
              <Avatar>
                <AvatarImage src={imageAlt} alt="Profile" />
                <AvatarFallback>{fallBack}</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <div className="flex">
                <div className="m-2 flex-grow-0">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={imageAlt} alt="Profile" />
                    <AvatarFallback>{fallBack}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-grow flex-col justify-center p-2">
                  <p>{session?.name}</p>
                  <p className="font-light">{session?.email}</p>
                </div>
              </div>
              <div className="p-2">
                <div className="flex justify-between">
                  <Button>Account Settings</Button>
                  <Button onClick={() => signOut()}>Logout</Button>
                </div>
              </div>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}
