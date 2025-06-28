"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CircleCheck, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CreateTagDialog } from "@app/_components/create-new-tag-dialog";
import { Button } from "@app/_components/ui/button";
import { Form } from "@app/_components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@app/_components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@app/_components/ui/toggle-group";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";
import { categoryMap, Category, categories } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";

const eventFormSchema = z.object({
  startTimestamp: z.date().optional(),
  endTimestamp: z.date().optional(),
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

  const locale = useLocale();
  const tCategories = useTranslations("common.categories");
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");
  const tNewEventSheet = useTranslations("new-event-sheet");
  const tNewTagDialog = useTranslations("new-tag-dialog");

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      startTimestamp: undefined,
      endTimestamp: undefined,
      category: undefined,
      tag: undefined,
    },
  });

  const mutation = trpc.event.createEvent.useMutation({
    onSuccess: () => {
      toast.success(tNewEventSheet("event-created-successfully"));
      eventForm.reset();
      setIsOpen(false);
    },
    onError: () => {
      toast.error(tCommon("errors.INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmit = (data: EventFormValues) => {
    mutation.mutate({
      householdId: selectedHouseholdId,
      category: data.category!,
      startDate: data.startTimestamp,
      endDate: data.endTimestamp,
      tag: data.tag,
      notes: undefined,
    });
  };

  const watchedCategory = eventForm.watch("category");
  const watchedStartTimestamp = eventForm.watch("startTimestamp");
  const watchedEndTimestamp = eventForm.watch("endTimestamp");

  useEffect(() => {
    if (
      watchedStartTimestamp &&
      watchedEndTimestamp &&
      watchedEndTimestamp < watchedStartTimestamp
    ) {
      eventForm.setValue("endTimestamp", undefined, { shouldValidate: true });
      toast.info(tNewEventSheet("end-time-reset"));
    }
  }, [watchedStartTimestamp, watchedEndTimestamp, eventForm, tNewEventSheet]);

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
              onSubmit={eventForm.handleSubmit(onSubmit)}
              className="flex flex-col space-y-6 py-4"
            >
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
                <span className="text-xs"> TODO: exemple personalitzat per cada categoria </span>
              </div>

              <br />

              {/* Event Timing */}
              <div className="flex flex-col gap-4">
                <span className="font-medium">{tNewEventSheet("event-timing-title")}</span>
                <Controller
                  control={eventForm.control}
                  name="startTimestamp"
                  render={({ field }) => (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => field.onChange(new Date())}
                        >
                          {tNewEventSheet("set-start-time")}
                        </Button>
                        <span>
                          {watchedStartTimestamp
                            ? format(watchedStartTimestamp, "HH:mm:ss", {
                                locale: getDateFnsLocale(locale),
                              })
                            : "---:---:---"}
                        </span>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => field.onChange(null)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={eventForm.control}
                  name="endTimestamp"
                  render={({ field }) => (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => field.onChange(new Date())}
                        >
                          {tNewEventSheet("set-end-time")}
                        </Button>
                        <span>
                          {watchedEndTimestamp
                            ? format(watchedEndTimestamp, "HH:mm:ss", {
                                locale: getDateFnsLocale(locale),
                              })
                            : "---:---:---"}
                        </span>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => field.onChange(null)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    eventForm.reset();
                  }}
                  className="w-fit"
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                  disabled={
                    mutation.isPending ||
                    !watchedCategory ||
                    (!watchedStartTimestamp && !watchedEndTimestamp)
                  }
                  type="submit"
                  className="w-fit"
                >
                  {mutation.isPending && <LoaderCircle className="animate-spin" />}
                  {tCommon("save")}
                </Button>
              </div>
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
