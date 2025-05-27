"use client";

import { useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { categoryMap, Category, categories } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";
import { CreateTagDialog } from "@presentation/components/create-new-tag-dialog";
import { Button } from "@presentation/components/ui/button";
import { Form, FormControl } from "@presentation/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@presentation/components/ui/sheet";
import { Switch } from "@presentation/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@presentation/components/ui/toggle-group";
import { trpc } from "@presentation/lib/trpc";
import { cn } from "@presentation/lib/utils";
import { useHouseholdStore } from "@presentation/stores/household";

const eventFormSchema = z.object({});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function LabelEventSheet({ children }: { children: React.ReactNode }) {
  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [startTimeSelected, setStartTimeSelected] = useState(false);
  const [endTimeSelected, setEndTimeSelected] = useState(false);

  const { selectedHouseholdId } = useHouseholdStore();

  const tCategories = useTranslations("common.categories");
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");
  const tNewEventSheet = useTranslations("new-event-sheet");
  const tNewTagDialog = useTranslations("new-tag-dialog");

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {},
  });

  const {
    data: tags,
    isLoading,
    error,
  } = trpc.home.getHouseholdCategoryTags.useQuery(
    {
      householdId: selectedHouseholdId,
      category: selectedCategory!,
    },
    {
      enabled: !!selectedCategory,
    }
  );

  if (error) {
    toast.error(tErrors("INTERNAL_SERVER_ERROR"));
  }

  const onSubmitEvent = () => {
    if (!startTimeSelected && !endTimeSelected) {
      toast.error(tErrors("VALIDATION_ERROR"));
      return;
    }

    toast.success("Event created successfully", {
      description:
        `${startTimeSelected ? "Start time: " + new Date() + "\n" : ""}` +
        `${endTimeSelected ? "End time: " + new Date() + "\n" : ""}` +
        `Category: ${selectedCategory}\n` +
        `Tag: ${selectedTag}\n`,
    });
  };

  const handleTagCreated = (tagName: string) => {
    setSelectedTag(tagName);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent className="w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {tCommon("new")} <span className="lowercase">{tCommon("event")}</span>
            </SheetTitle>
          </SheetHeader>

          <Form {...eventForm}>
            <form
              onSubmit={eventForm.handleSubmit(onSubmitEvent)}
              className="flex flex-col space-y-6 py-4"
            >
              <div className="flex flex-col gap-4">
                <span className="font-medium">{tNewEventSheet("event-timing-title")}</span>
                <div className="flex flex-col gap-2">
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      className="flex flex-wrap gap-2"
                      value={startTimeSelected ? "start" : endTimeSelected ? "end" : undefined}
                      onValueChange={(value) => {
                        if (value === "start") {
                          console.log("Start time selected");
                          setStartTimeSelected(!startTimeSelected);
                          if (!startTimeSelected) setEndTimeSelected(false);
                        } else if (value === "end") {
                          setEndTimeSelected(!endTimeSelected);
                          if (!endTimeSelected) setStartTimeSelected(false);
                        }
                      }}
                    >
                      <ToggleGroupItem
                        value="start"
                        className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary group rounded-lg bg-gray-100 transition-colors"
                      >
                        {tNewEventSheet("set-start-time")}
                        {startTimeSelected && <CircleCheck className="ml-1 h-4 w-4" />}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="end"
                        className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary group rounded-lg bg-gray-100 transition-colors"
                      >
                        {tNewEventSheet("set-end-time")}
                        {endTimeSelected && <CircleCheck className="ml-1 h-4 w-4" />}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <div className="flex flex-row items-center gap-2">
                    <Switch />
                    <p className="text-muted-foreground text-xs"> Timer</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-medium">{tCommon("consumption-point")}</span>
                <ToggleGroup
                  type="single"
                  value={selectedCategory}
                  onValueChange={(value) => {
                    if (value === selectedCategory) {
                      setSelectedCategory(undefined);
                    } else {
                      setSelectedCategory(value as Category);
                    }
                    setSelectedTag(undefined);
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
                      aria-label={tCategories(category)}
                    >
                      <Image
                        className="object-contain"
                        src={categoryMap[category].icon!}
                        alt={tCategories(category)}
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
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : !tags || tags.length == 0 ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-sm">
                      {tNewEventSheet("no-tags-for-category")}
                    </span>
                  </div>
                ) : (
                  <ToggleGroup
                    type="single"
                    value={selectedTag}
                    onValueChange={(value) => {
                      if (value === selectedTag) {
                        setSelectedTag(undefined);
                      } else {
                        setSelectedTag(value);
                      }
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    {tags.map((tag: Tag) => (
                      <ToggleGroupItem
                        className={cn(
                          "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                          tag.name === selectedTag ? "!bg-brand-secondary" : "bg-gray-100"
                        )}
                        value={tag.name}
                        key={tag.name + tag.category + tag.householdId}
                        aria-label={tag.name}
                      >
                        <span className="text-sm">{tag.name}</span>
                        {selectedTag === tag.name && <CircleCheck className="h-4 w-4" />}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                  disabled={!selectedCategory}
                  onClick={() => {
                    setIsCreateTagDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {tNewTagDialog("title")}
                </Button>
              </div>

              <Button
                disabled={
                  eventForm.formState.isSubmitting ||
                  !selectedCategory ||
                  (!startTimeSelected && !endTimeSelected)
                }
                type="submit"
                className="ml-auto w-fit"
              >
                {tCommon("save")}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {selectedCategory && (
        <CreateTagDialog
          isOpen={isCreateTagDialogOpen}
          onOpenChange={setIsCreateTagDialogOpen}
          selectedCategory={selectedCategory}
          onTagCreated={handleTagCreated}
        />
      )}
    </>
  );
}
