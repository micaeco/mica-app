import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

import {
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortField } from "@/lib/types";
import { getCategories } from "@/lib/constants";
import { useMessages, useTranslations } from "next-intl";

interface Props {
  category: string;
  setCategory: (category: string) => void;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  handleSort: (field: SortField) => void;
}

export default function TableHeader({
  category,
  setCategory,
  sortField,
  sortDirection,
  handleSort,
}: Props) {
  const common = useTranslations("common");
  const messages = useMessages();
  const labels = (messages.common as { categories: Record<string, string> })
    .categories;
  const categories = getCategories(labels);

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        <div className="first-letter:uppercase">{children}</div>
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );

  return (
    <UITableHeader>
      <TableRow>
        <TableHead>
          <Select
            defaultValue="all"
            onValueChange={(selectedCategory) => setCategory(selectedCategory)}
          >
            <SelectTrigger className="capitalize">
              <SelectValue>
                {categories.find((c) => c.name === category)
                  ? categories.find((c) => c.name === category)!.label
                  : common("categories.all")}
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
        <TableHead className="first-letter:uppercase">
          {common("device")}
        </TableHead>
        <SortableHeader field="date">{common("day-and-time")}</SortableHeader>
        <SortableHeader field="consumption">
          {common("consumption")}
        </SortableHeader>
        <SortableHeader field="duration">{common("duration")}</SortableHeader>
      </TableRow>
    </UITableHeader>
  );
}
