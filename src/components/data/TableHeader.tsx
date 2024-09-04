import React from "react";
import { ChevronUp, ChevronDown, Edit, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { SortField } from "@/types";
import { categories } from "@/constants";

interface Props {
  category: string;
  setCategory: (category: string) => void;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  handleSort: (field: SortField) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export default function TableHeader({
  category,
  setCategory,
  sortField,
  sortDirection,
  handleSort,
  isEditing,
  setIsEditing,
}: Props) {
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
        {children}
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
            <SelectTrigger className="w-full capitalize">
              <SelectValue>{category}</SelectValue>
            </SelectTrigger>
            <SelectContent className="capitalize">
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableHead>
        <TableHead className="flex items-center">
          {isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          Dispositiu
        </TableHead>
        <SortableHeader field="date">Dia i hora</SortableHeader>
        <SortableHeader field="consumption">Consum</SortableHeader>
        <SortableHeader field="duration">Duració</SortableHeader>
      </TableRow>
    </UITableHeader>
  );
}
