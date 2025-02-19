"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@components/ui/drawer";

interface BaseProps {
  children: React.ReactNode;
}

interface RootPanelProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PanelProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const PanelContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: false,
});

const usePanelContext = () => {
  const context = React.useContext(PanelContext);
  if (!context) {
    throw new Error("Panel components cannot be rendered outside the Panel Context");
  }
  return context;
};

const Panel = ({ children, ...props }: RootPanelProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const Panel = isDesktop ? Dialog : Drawer;

  return (
    <PanelContext.Provider value={{ isDesktop }}>
      <Panel {...props} {...(!isDesktop && { autoFocus: true })}>
        {children}
      </Panel>
    </PanelContext.Provider>
  );
};

const PanelTrigger = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <PanelTrigger className={className} {...props}>
      {children}
    </PanelTrigger>
  );
};

const PanelClose = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <PanelClose className={className} {...props}>
      {children}
    </PanelClose>
  );
};

const PanelContent = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <PanelContent className={cn(className, !isDesktop && "w-full")} {...props}>
      {children}
    </PanelContent>
  );
};

const PanelDescription = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <PanelDescription className={className} {...props}>
      {children}
    </PanelDescription>
  );
};

const PanelHeader = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <PanelHeader className={className} {...props}>
      {children}
    </PanelHeader>
  );
};

const PanelTitle = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <PanelTitle className={className} {...props}>
      {children}
    </PanelTitle>
  );
};

const PanelBody = ({ className, children, ...props }: PanelProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const PanelFooter = ({ className, children, ...props }: PanelProps) => {
  const { isDesktop } = usePanelContext();
  const PanelFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <PanelFooter className={className} {...props}>
      {children}
    </PanelFooter>
  );
};

export {
  Panel,
  PanelTrigger,
  PanelClose,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelBody,
  PanelFooter,
};
