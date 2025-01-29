"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface BreadcrumbSegment {
  label: string;
  path: string;
}

const transformPathSegment = (segment: string): string => {
  return segment.split("-").join(" ");
};

const getBreadcrumbs = (path: string): BreadcrumbSegment[] => {
  const segments = path.split("/").filter(Boolean);
  const locale = segments[0];

  if (segments.length === 1) {
    return [
      {
        label: "consumption",
        path: `/${locale}`,
      },
    ];
  }

  const breadcrumbs: BreadcrumbSegment[] = [];
  segments.slice(1).forEach((segment, index) => {
    breadcrumbs.push({
      label: transformPathSegment(segment),
      path: `/${segments.slice(0, index + 2).join("/")}`,
    });
  });

  return breadcrumbs;
};

export default function Header() {
  const pathname = usePathname();
  const common = useTranslations("common");
  const breadcrumbs = getBreadcrumbs(pathname ?? "");

  return (
    <header className="sticky top-0 z-20 bg-background flex h-16 shrink-0 items-center gap-2 border-b border-gray-200">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>
                      {common.raw(`nav-pages.${crumb.label}`) !=
                      `common.nav-pages.${crumb.label}`
                        ? common(`nav-pages.${crumb.label}`)
                        : common(`nav-settings.${crumb.label}`)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.path}>
                      {common.raw(`nav-pages.${crumb.label}`) !=
                      `common.nav-pages.${crumb.label}`
                        ? common(`nav-pages.${crumb.label}`)
                        : common(`nav-settings.${crumb.label}`)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
