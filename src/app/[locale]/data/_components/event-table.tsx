import React from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useLocale, useTranslations, useMessages } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Event, SortField } from "@/lib/types";
import { getCategories } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface Props {
  events: Event[];
  category: string;
  setCategory: (category: string) => void;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  handleSort: (field: SortField) => void;
}

export function EventTable({
  events,
  category,
  setCategory,
  sortField,
  sortDirection,
  handleSort,
}: Props) {
  const locale = useLocale();
  const common = useTranslations("common");
  const messages = useMessages();
  const labels = (messages.common as { categories: Record<string, string> }).categories;
  const categories = getCategories(labels);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Select defaultValue="all" onValueChange={setCategory}>
              <SelectTrigger className="capitalize">
                <SelectValue>
                  {categories.find((c) => c.name === category)?.label || common("categories.all")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="capitalize">
                <SelectItem value="all">{common("categories.all")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableHead>
          <TableHead className="first-letter:uppercase">{common("device")}</TableHead>
          {["date", "consumption", "duration"].map((field) => (
            <TableHead
              key={field}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort(field as SortField)}
            >
              <div className="flex items-center">
                <div className="first-letter:uppercase">
                  {common(field === "date" ? "day-and-time" : field)}
                </div>
                {sortField === field &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={index}>
            <TableCell className="flex items-center truncate capitalize">
              <Image
                src={event.category.icon}
                alt={event.category.name}
                width={24}
                height={24}
                className="mr-2"
              />
              {event.category.label}
            </TableCell>
            <TableCell className="truncate">{event.device.name}</TableCell>
            <TableCell className="truncate">{formatDate(event.timestamp, locale)}</TableCell>
            <TableCell className="truncate">{event.consumption} L</TableCell>
            <TableCell className="truncate">
              {String(Math.floor(event.duration / 60)).padStart(2, "0")}:
              {String(event.duration % 60).padStart(2, "0")} {common("minutes").slice(0, 3)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
