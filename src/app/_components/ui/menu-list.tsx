import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@app/_lib/utils";

const menuListVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "rounded-md border border-neutral-200/70 bg-white shadow-sm overflow-hidden",
      simple: "gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MenuListProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof menuListVariants> {}

const MenuList = React.forwardRef<HTMLDivElement, MenuListProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div ref={ref} className={cn(menuListVariants({ variant, className }))} {...props}>
      {children}
    </div>
  )
);
MenuList.displayName = "MenuList";

type MenuItemProps = React.ComponentPropsWithoutRef<"button">;

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center px-4 py-3.5 text-left text-sm text-neutral-700 transition-colors duration-150 ease-in-out hover:bg-neutral-100/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none",
        "border-b border-neutral-200/70 last:border-b-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
MenuItem.displayName = "MenuItem";

type MenuLabelProps = React.ComponentPropsWithoutRef<"div">;

const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-4 py-2 text-xs font-semibold text-neutral-500 uppercase",
        "border-b border-neutral-200/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
MenuLabel.displayName = "MenuLabel";

export { MenuList, MenuItem, MenuLabel };
