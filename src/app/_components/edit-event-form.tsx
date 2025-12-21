"use client";

import { useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Check, Edit, LoaderCircle, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { EditTagsDialog } from "@app/_components/edit-tags-dialog";
import { Button } from "@app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/_components/ui/form";
import { Textarea } from "@app/_components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@app/_components/ui/toggle-group";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";
import { categories, categoryMap, Category } from "@domain/entities/category";
import { Event, updateEventForm } from "@domain/entities/event";
import { Tag } from "@domain/entities/tag";

const editEventFormSchema = updateEventForm;

type EditEventFormValues = z.infer<typeof editEventFormSchema>;

export function EditEventForm({
  event,
  onFormSubmitSuccess,
}: {
  event: Event;
  onFormSubmitSuccess: () => void;
}) {
  const filteredCategories = categories.filter((category) => category !== "rest");

  const [isEditTagsDialogOpen, setIsEditTagsDialogOpen] = useState(false);

  const { selectedHouseholdId } = useHouseholdStore();

  const locale = useLocale();
  const tCategories = useTranslations("common.categories");
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");
  const tEditEventSheet = useTranslations("editEventSheet");
  const tEditTagsDialog = useTranslations("editTagsDialog");

  const formatDuration = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    if (minutes === 0) {
      return `${seconds}s`;
    }

    if (seconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${seconds}s`;
  };

  const calculateFlowRate = (consumptionInLiters: number, durationInSeconds: number) => {
    if (durationInSeconds === 0) return 0;
    return (consumptionInLiters / (durationInSeconds / 60)).toFixed(1);
  };

  const eventForm = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventFormSchema),
    defaultValues: {
      category: event?.userCategory ?? null,
      tag: event?.tag ?? null,
      notes: event?.notes ?? null,
    },
  });

  const watchedCategory = eventForm.watch("category");

  const { data: tags, isLoading: isLoadingTags } = trpc.tag.getTagsByCategory.useQuery(
    {
      householdId: selectedHouseholdId,
      category: watchedCategory!,
    },
    {
      enabled: !!watchedCategory && !!selectedHouseholdId,
    }
  );

  const utils = trpc.useUtils();

  const { mutate: updateEvent } = trpc.event.update.useMutation({
    onSuccess: () => {
      utils.event.invalidate();
      eventForm.reset();
      onFormSubmitSuccess();
      toast.success(tEditEventSheet("eventEditedSuccessfully"));
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
      category: data.category ?? undefined,
      tagId: data.tag?.id ?? undefined,
      notes: data.notes ?? undefined,
    });
  };

  return (
    <>
      <Form {...eventForm}>
        <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="flex flex-col space-y-6">
          {event && (
            <>
              <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  {format(event.startTimestamp, "cccc PPP", { locale: getDateFnsLocale(locale) })}
                </p>

                <div className="flex items-baseline justify-between">
                  <span className="text-brand-secondary text-3xl font-bold">
                    {event.consumptionInLiters.toFixed(1)} L
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {calculateFlowRate(event.consumptionInLiters, event.durationInSeconds)} L/min
                  </span>
                </div>

                <div className="text-muted-foreground flex justify-between text-sm">
                  <span>
                    {format(event.startTimestamp, "HH:mm", {
                      locale: getDateFnsLocale(locale),
                    })}
                    {" - "}
                    {event.endTimestamp
                      ? format(event.endTimestamp, "HH:mm", { locale: getDateFnsLocale(locale) })
                      : tCommon("inProgress")}
                  </span>
                  <span>{formatDuration(event.durationInSeconds)}</span>
                </div>
              </div>
            </>
          )}

          {/* Category */}
          <FormField
            control={eventForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="font-medium">{tCommon("consumptionPoint")}</span>
                </FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    value={field.value ?? ""}
                    onValueChange={(value: Category | "") => {
                      const newValue = value || null;
                      if (field.value !== newValue) {
                        eventForm.setValue("tag", null);
                      }
                      field.onChange(newValue);
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    {filteredCategories.map((category) => (
                      <ToggleGroupItem
                        className={cn(
                          "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                          category === field.value ? "bg-brand-secondary!" : "bg-gray-100",
                          category === event.algorithmCategory &&
                            event.algorithmCategory !== "unknown" &&
                            "border-brand-primary border-2"
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
                        {category === event.algorithmCategory &&
                          event.algorithmCategory !== "unknown" && (
                            <Sparkles className="fill-brand-primary size-3" />
                          )}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tag */}
          <div className="flex flex-col gap-2">
            <FormField
              control={eventForm.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("tag")}</FormLabel>
                  <FormControl>
                    {isLoadingTags ? (
                      <LoaderCircle className="animate-spin" />
                    ) : !tags || tags.length === 0 ? (
                      <FormDescription className="text-muted-foreground text-sm">
                        {tEditEventSheet("noTagsForCategory")}
                      </FormDescription>
                    ) : (
                      <ToggleGroup
                        type="single"
                        value={field.value?.name ?? ""}
                        onValueChange={(name: string) => {
                          const selectedTag = tags.find((tag) => tag.name === name);
                          field.onChange(selectedTag || null);
                        }}
                        className="flex flex-wrap gap-2"
                      >
                        {tags.map((tag: Tag) => (
                          <ToggleGroupItem
                            className={cn(
                              "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                              tag.id === field.value?.id ? "bg-brand-secondary!" : "bg-gray-100"
                            )}
                            value={tag.name}
                            key={tag.id}
                            aria-label={tag.name}
                          >
                            <span className="text-sm">{tag.name}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="sm"
              type="button"
              variant="secondary"
              className="w-fit"
              onClick={() => setIsEditTagsDialogOpen(true)}
            >
              <Edit />
              {tEditTagsDialog("title")}
            </Button>
          </div>

          {/* Notes */}
          <FormField
            control={eventForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tEditEventSheet("notesLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tEditEventSheet("notesPlaceholder")}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(value) => field.onChange(value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={eventForm.formState.isSubmitting || !watchedCategory}
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

      <EditTagsDialog
        isOpen={isEditTagsDialogOpen}
        onOpenChange={setIsEditTagsDialogOpen}
        category={watchedCategory ?? undefined}
      />
    </>
  );
}
