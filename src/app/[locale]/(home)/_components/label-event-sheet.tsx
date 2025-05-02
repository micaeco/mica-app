"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CircleCheck, Plus } from "lucide-react";
import { toast } from "sonner";

import { Tag } from "@domain/entities/tag";
import { categoryMap, Category, categories } from "@domain/entities/category";
import { Button } from "@presentation/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@presentation/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@presentation/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@presentation/components/ui/sheet";
import { useHouseholdStore } from "@presentation/stores/household";
import { cn } from "@presentation/lib/utils";
import { EventStopwatch } from "@app/[locale]/(home)/_components/event-stopwatch";
import { getHouseholdTags, createHouseholdTag } from "@app/[locale]/(home)/actions";

export function LabelEventSheet({ children }: { children: React.ReactNode }) {
  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

  const [, setStartTime] = useState<Date | null>(null);
  const [, setEndTime] = useState<Date | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category>(filteredCategories[0]);

  const [selectedTag, setSelectedTag] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);

  const { selectedHouseholdId } = useHouseholdStore();

  const tCategories = useTranslations("common.categories");
  const tErrors = useTranslations("errors");
  const tCommon = useTranslations("common");
  const tNewEventSheet = useTranslations("new-event-sheet");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getHouseholdTags(selectedHouseholdId);

      if (!response.success) {
        toast.error(tErrors(response.error));
        return;
      }

      setTags(response.data);
    };

    fetchData();
  }, [selectedHouseholdId, selectedCategory, selectedTag, tErrors]);

  const filteredTags = tags.filter((tag) => tag.category === selectedCategory);

  const handleCreateLabel = async () => {
    const response = await createHouseholdTag({
      householdId: selectedHouseholdId,
      category: selectedCategory,
      name: "new",
    });

    if (!response.success) {
      toast.error(tErrors(response.error));
      return;
    }

    const labelsResponse = await getHouseholdTags(selectedHouseholdId);
    if (labelsResponse.success) {
      setTags(labelsResponse.data);
      const newLabel = labelsResponse.data.find(
        (tag) =>
          tag.category === selectedCategory && tag.name === `New ${tCategories(selectedCategory)}`
      );
      if (newLabel) {
        setSelectedTag(newLabel.name);
      }
    }

    toast.success("Tag created successfully");
  };

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {tCommon("new")} <span className="lowercase">{tCommon("event")}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-8 py-4">
          <div className="flex flex-col gap-2">
            <span className="font-medium">{tCommon("consumption-point")}</span>
            <ToggleGroup
              type="single"
              value={selectedCategory}
              onValueChange={(value) => {
                if (value) {
                  setSelectedCategory(value as Category);
                  setSelectedTag("");
                }
              }}
              className="flex flex-wrap gap-2"
            >
              {filteredCategories.map((category: Category) => (
                <ToggleGroupItem
                  className={cn(
                    "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                    category === selectedCategory ? "!bg-brand-secondary" : "bg-gray-100"
                  )}
                  value={category}
                  key={category}
                >
                  <Image
                    className="object-contain"
                    src={categoryMap[category].icon}
                    alt={category}
                    width={24}
                    height={24}
                  />
                  <span className="ml-1 text-sm">{tCategories(category)}</span>
                  {selectedCategory === category && <CircleCheck className="h-4 w-4" />}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2">
            <span className="mt-2 font-medium">{tCommon("tag")}</span>
            {filteredTags.length > 0 ? (
              <ToggleGroup
                type="single"
                value={selectedTag}
                onValueChange={(value) => {
                  if (value === selectedTag) {
                    setSelectedTag("");
                  } else {
                    setSelectedTag(value);
                  }
                }}
                className="flex flex-wrap gap-2"
              >
                {filteredTags.map((tag: Tag) => (
                  <ToggleGroupItem
                    className={cn(
                      "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                      tag.name === selectedTag ? "!bg-brand-secondary" : "bg-gray-100"
                    )}
                    value={tag.name}
                    key={tag.name}
                  >
                    <span className="text-sm">{tag.name}</span>
                    {selectedTag === tag.name && <CircleCheck className="h-4 w-4" />}
                  </ToggleGroupItem>
                ))}
                <Button
                  onClick={handleCreateLabel}
                  size="sm"
                  variant="secondary"
                  className="flex items-center gap-1"
                  disabled={!selectedCategory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </ToggleGroup>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-sm">
                  {tNewEventSheet("no-tags-for-category")}
                </span>
              </div>
            )}
          </div>

          <Tabs defaultValue="default" className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="default" className="flex w-full flex-row gap-2">
              <ToggleGroup
                type="single"
                className="flex flex-wrap gap-2"
                onValueChange={(value) => {
                  if (value === "start") {
                    setStartTime(new Date());
                  } else if (value === "end") {
                    setEndTime(new Date());
                  }
                }}
              >
                <ToggleGroupItem
                  value="start"
                  className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary group rounded-lg bg-gray-100 transition-colors"
                >
                  Ara comença
                  <CircleCheck className="hidden h-4 w-4 group-data-[state=on]:block" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="end"
                  className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary group rounded-lg bg-gray-100 transition-colors"
                >
                  Ara acaba
                  <CircleCheck className="hidden h-4 w-4 group-data-[state=on]:block" />
                </ToggleGroupItem>
              </ToggleGroup>
            </TabsContent>
            <TabsContent value="timer">
              <EventStopwatch setStartTime={setStartTime} setEndTime={setEndTime} />
            </TabsContent>
          </Tabs>

          <Button className="ml-auto w-fit">{tCommon("save")}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
