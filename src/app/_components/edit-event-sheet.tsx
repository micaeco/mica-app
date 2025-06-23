"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CircleCheck, LoaderCircle, Plus } from "lucide-react";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@app/_components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@app/_components/ui/toggle-group";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";
import { categoryMap, Category, categories } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { Tag } from "@domain/entities/tag";

const editEventFormSchema = z.object({
  category: z.custom<Category>().optional(),
  tag: z.string().optional(),
});

type EditEventFormValues = z.infer<typeof editEventFormSchema>;

export function EditEventSheet({
  event,
  open,
  onOpenChange,
}: {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);

  const { selectedHouseholdId } = useHouseholdStore();

  const tCategories = useTranslations("common.categories");
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");
  const tEditEventSheet = useTranslations("edit-event-sheet");
  const tNewTagDialog = useTranslations("new-tag-dialog");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

  const eventForm = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventFormSchema),
  });

  useEffect(() => {
    if (open && event) {
      eventForm.reset({
        category: event.category,
        tag: event.tag,
      });
    }
  }, [event, open, eventForm]);

  const watchedCategory = eventForm.watch("category");

  const { data: tags, isLoading: isLoadingTags } = trpc.tag.getHouseholdCategoryTags.useQuery(
    {
      householdId: selectedHouseholdId,
      category: watchedCategory!,
    },
    {
      enabled: !!watchedCategory,
    }
  );

  const { mutate: updateEvent } = trpc.event.updateEvent.useMutation({
    onSuccess: () => {
      eventForm.reset();
      onOpenChange(false);
      toast.success(tEditEventSheet("event-edited-successfully"));
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmitEvent = (data: EditEventFormValues) => {
    updateEvent({
      eventId: event.id,
      startDate: event.startTimestamp,
      endDate: event.endTimestamp,
      category: data.category,
      tag: data.tag,
    });
  };

  const handleTagCreated = (tagName: string) => {
    eventForm.setValue("tag", tagName, { shouldValidate: true });
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      eventForm.reset();
    }
    onOpenChange(isOpen);
  };

  console.log("This is the watched category:", watchedCategory);
  console.log("This is the event:", event.category);

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {tCommon("edit")} <span className="lowercase">{tCommon("event")}</span>
            </SheetTitle>
            {event && (
              <SheetDescription>
                {format(event.startTimestamp, "cccc PPP", { locale: dateFnsLocale })}
                <br />
                {format(event.startTimestamp, "HH:mm:ss", { locale: dateFnsLocale })} -{" "}
                {event.endTimestamp
                  ? format(event.endTimestamp, "HH:mm:ss", { locale: dateFnsLocale })
                  : tCommon("in-progress")}
                <br />
                <br />
                <p className="text-brand-secondary font-bold">
                  {event.consumptionInLiters.toFixed(1)} L
                </p>
              </SheetDescription>
            )}
          </SheetHeader>

          <Form {...eventForm}>
            <form
              onSubmit={eventForm.handleSubmit(onSubmitEvent)}
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
                      {tEditEventSheet("no-tags-for-category")}
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
                  eventForm.formState.isSubmitting ||
                  !watchedCategory ||
                  watchedCategory === event.category
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
