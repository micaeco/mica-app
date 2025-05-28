"use client";

import { useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { categoryMap, Category, categories } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";
import { CreateTagDialog } from "@presentation/components/create-new-tag-dialog";
import { Button } from "@presentation/components/ui/button";
import { Form } from "@presentation/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@presentation/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@presentation/components/ui/toggle-group";
import { trpc } from "@presentation/lib/trpc";
import { cn } from "@presentation/lib/utils";
import { useHouseholdStore } from "@presentation/stores/household";

const eventFormSchema = z.object({
  timingType: z.enum(["start", "end"]).optional(),
  category: z.custom<Category>().optional(),
  tag: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function LabelEventSheet({ children }: { children: React.ReactNode }) {
  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);

  const { selectedHouseholdId } = useHouseholdStore();

  const tCategories = useTranslations("common.categories");
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");
  const tNewEventSheet = useTranslations("new-event-sheet");
  const tNewTagDialog = useTranslations("new-tag-dialog");

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      timingType: undefined,
      category: undefined,
      tag: undefined,
    },
  });

  const watchedCategory = eventForm.watch("category");
  const watchedTimingType = eventForm.watch("timingType");

  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagsError,
  } = trpc.tag.getHouseholdCategoryTags.useQuery(
    {
      householdId: selectedHouseholdId,
      category: watchedCategory!,
    },
    {
      enabled: !!watchedCategory,
    }
  );

  if (tagsError) {
    toast.error(tErrors("INTERNAL_SERVER_ERROR"));
  }

  const onSubmitEvent = (data: EventFormValues) => {
    if (!data.timingType) {
      toast.error(tErrors("VALIDATION_ERROR"));
      return;
    }

    toast.success("Event created successfully", {
      description:
        `${data.timingType === "start" ? "Start time: " + new Date().toLocaleTimeString() + "\n" : ""}` +
        `${data.timingType === "end" ? "End time: " + new Date().toLocaleTimeString() + "\n" : ""}` +
        `Category: ${data.category}\n` +
        `${data.tag ? "Tag: " + data.tag + "\n" : ""}`,
    });

    eventForm.reset();
    setIsOpen(false);
  };

  const handleTagCreated = (tagName: string) => {
    eventForm.setValue("tag", tagName, { shouldValidate: true });
  };

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            eventForm.reset();
          }
        }}
      >
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
              {/* Event Timing */}
              <div className="flex flex-col gap-4">
                <span className="font-medium">{tNewEventSheet("event-timing-title")}</span>
                <Controller
                  control={eventForm.control}
                  name="timingType"
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      value={field.value || ""}
                      onValueChange={(valueFromGroup) => {
                        field.onChange(
                          valueFromGroup === "" ? undefined : (valueFromGroup as "start" | "end")
                        );
                      }}
                      className="flex flex-wrap gap-2"
                    >
                      <ToggleGroupItem
                        value="start"
                        className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary group rounded-lg bg-gray-100 transition-colors"
                        aria-label={tNewEventSheet("set-start-time")}
                      >
                        {tNewEventSheet("set-start-time")}
                        {field.value === "start" && <CircleCheck className="ml-1 h-4 w-4" />}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="end"
                        className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary group rounded-lg bg-gray-100 transition-colors"
                        aria-label={tNewEventSheet("set-end-time")}
                      >
                        {tNewEventSheet("set-end-time")}
                        {field.value === "end" && <CircleCheck className="ml-1 h-4 w-4" />}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                />
                {eventForm.formState.errors.timingType && (
                  <p className="text-sm text-red-500">
                    {eventForm.formState.errors.timingType.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <span className="font-medium">{tCommon("consumption-point")}</span>
                <Controller
                  control={eventForm.control}
                  name="category"
                  render={({ field }) => {
                    const currentCategoryValue = field.value;
                    return (
                      <ToggleGroup
                        type="single"
                        value={field.value || ""}
                        onValueChange={(valueFromGroup: string) => {
                          const newCategory =
                            valueFromGroup === "" ? undefined : (valueFromGroup as Category);
                          field.onChange(newCategory);
                          if (currentCategoryValue !== newCategory) {
                            eventForm.setValue("tag", undefined, { shouldValidate: false });
                          }
                        }}
                        className="flex flex-wrap gap-2"
                      >
                        {filteredCategories.map((category: Category) => (
                          <ToggleGroupItem
                            className={cn(
                              "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                              category === field.value ? "!bg-brand-secondary" : "bg-gray-100"
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
                            {field.value === category && <CircleCheck className="h-4 w-4" />}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    );
                  }}
                />
                {eventForm.formState.errors.category && (
                  <p className="text-sm text-red-500">
                    {eventForm.formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* Tag */}
              <div className="flex flex-col gap-2">
                <span className="mt-2 font-medium">{tCommon("tag")}</span>
                {isLoadingTags ? (
                  <LoaderCircle className="animate-spin" />
                ) : !tags || tags.length === 0 ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-sm">
                      {tNewEventSheet("no-tags-for-category")}
                    </span>
                  </div>
                ) : (
                  <Controller
                    control={eventForm.control}
                    name="tag"
                    render={({ field }) => (
                      <ToggleGroup
                        type="single"
                        value={field.value || ""}
                        onValueChange={(valueFromGroup: string) => {
                          field.onChange(valueFromGroup === "" ? undefined : valueFromGroup);
                        }}
                        className="flex flex-wrap gap-2"
                      >
                        {tags.map((tag: Tag) => (
                          <ToggleGroupItem
                            className={cn(
                              "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                              tag.name === field.value ? "!bg-brand-secondary" : "bg-gray-100"
                            )}
                            value={tag.name}
                            key={tag.name + tag.category + tag.householdId}
                            aria-label={tag.name}
                          >
                            <span className="text-sm">{tag.name}</span>
                            {field.value === tag.name && <CircleCheck className="h-4 w-4" />}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    )}
                  />
                )}
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  className="flex w-fit items-center gap-1"
                  disabled={!watchedCategory}
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
                  eventForm.formState.isSubmitting || !watchedCategory || !watchedTimingType
                }
                type="submit"
                className="ml-auto w-fit"
              >
                {eventForm.formState.isSubmitting && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tCommon("save")}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {watchedCategory && (
        <CreateTagDialog
          isOpen={isCreateTagDialogOpen}
          onOpenChange={setIsCreateTagDialogOpen}
          selectedCategory={watchedCategory}
          onTagCreated={handleTagCreated}
        />
      )}
    </>
  );
}
