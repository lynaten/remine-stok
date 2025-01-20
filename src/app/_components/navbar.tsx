"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { api } from "@/trpc/react";
import { AddCatForm } from "./addCatForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function Navbar() {
  const [addCategoryForm, setAddCategoryForm] = React.useState(false);
  const [categoryList] = api.category.get.useSuspenseQuery();
  const utils = api.useUtils();

  const handleAddCategoryForm = () => {
    setAddCategoryForm(!addCategoryForm);
  };
  return (
    <div className="fixed flex h-16 w-full bg-[#ee4492] text-[#ee4492]">
      <Link href="/">
        <Image
          src={"/remine.png"}
          height={51}
          width={170}
          alt={"remine logo"}
        ></Image>
      </Link>

      <div className="flex w-full justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-[#e8e620] hover:text-[#ee4492] focus:text-[#b0336d]">
                Notification
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-[#ee4492]">
                <ul className="w-max">
                  <ListItem title="Introduction" className="hover:bg-[#ff87bf]">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem title="Installation" className="hover:bg-[#ff87bf]">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem title="Typography" className="hover:bg-[#ff87bf]">
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-[#e8e620] hover:text-[#ee4492] focus:text-[#b0336d]">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-[#ee4492]">
                <Dialog>
                  <DialogTrigger className="ml-4 mt-4 rounded-md bg-[#e8e620] px-4 py-2 text-[#ee4492] hover:bg-[#c9c747]">
                    Add Category
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Create a New Category for Your Products
                      </DialogTitle>
                      <DialogDescription>
                        Organize your products better by adding a new category.
                        Make sure to choose a descriptive name that fits the
                        purpose of this category.
                      </DialogDescription>
                      <AddCatForm></AddCatForm>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categoryList.map((category) => (
                    <ListItem
                      key={category.id}
                      title={category.name}
                      href={`/${category.name.toLowerCase()}`}
                      className="hover:bg-[#ff87bf]"
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-[#e8e620] hover:text-[#ee4492] focus:text-[#b0336d]",
                  )}
                >
                  Sales Report
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/api/auth/signout" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-[#e8e620] hover:text-[#ee4492] focus:text-[#b0336d]",
                  )}
                >
                  Sign Out
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-[#e8e620]">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground text-white">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
