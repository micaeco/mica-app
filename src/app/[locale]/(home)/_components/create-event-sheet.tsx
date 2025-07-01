"use client";

import { useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isToday, isYesterday, isTomorrow, addMinutes, addSeconds } from "date-fns";
import { CircleCheck, Clock, Edit, LoaderCircle, Undo2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Control, FieldValues, Path, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DateTimePicker } from "@app/[locale]/(home)/_components/date-time-picker";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@app/_components/ui/sheet";
import { Textarea } from "@app/_components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@app/_components/ui/toggle-group";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";
import { Category, categories, categoryMap } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";

const eventFormSchema = z.object({
  startDateTime: z.date().nullable(),
  endDateTime: z.date().nullable(),
  category: z.custom<Category>().nullable(),
  tag: z.string().nullable(),
  notes: z.string().nullable(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const filteredCategories = categories.filter(
  (category) => category !== "rest" && category !== "unknown"
);

export function CreateEventSheet({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(null);
  const [isEditTagsDialogOpen, setIsEditTagsDialogOpen] = useState(false);

  const { selectedHouseholdId } = useHouseholdStore();

  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");
  const tCategories = useTranslations("common.categories");
  const tNewEventSheet = useTranslations("new-event-sheet");
  const tEditTagsDialog = useTranslations("edit-tags-dialog");

  const now = new Date();
  const defaultFormValues: EventFormValues = {
    startDateTime: now,
    endDateTime: null,
    category: null,
    tag: null,
    notes: null,
  };

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultFormValues,
  });

  const mutation = trpc.event.create.useMutation({
    onSuccess: () => {
      toast.success(tNewEventSheet("event-created-successfully"));
      eventForm.reset(defaultFormValues);
      setIsOpen(false);
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmit = (data: EventFormValues) => {
    if (data.startDateTime && data.endDateTime && data.startDateTime > data.endDateTime) {
      toast.error(tNewEventSheet("end-cannot-be-before-start"));
      return;
    }

    if (!data.startDateTime && !data.endDateTime) {
      toast.error(tNewEventSheet("either-start-or-end-required"));
      return;
    }

    if (!data.category) {
      toast.error(tNewEventSheet("category-required"));
      return;
    }

    mutation.mutate({
      householdId: selectedHouseholdId,
      category: data.category,
      startDate: data.startDateTime ?? undefined,
      endDate: data.endDateTime ?? undefined,
      tag: data.tag ?? undefined,
      notes: data.notes ?? undefined,
    });
  };

  const watchedCategory = eventForm.watch("category");

  const { data: tags, isLoading: isLoadingTags } = trpc.tag.getTagsByCategory.useQuery(
    {
      householdId: selectedHouseholdId,
      category: watchedCategory!,
    },
    {
      enabled: !!watchedCategory,
    }
  );

  const getDisplayDateTime = (date: Date | null) => {
    if (!date) return tNewEventSheet("select-date");

    const time = format(date, "HH:mm:ss", { locale: getDateFnsLocale(locale) });

    let dateString;
    if (isToday(date)) {
      dateString = tCommon("today");
    } else if (isYesterday(date)) {
      dateString = tCommon("yesterday");
    } else if (isTomorrow(date)) {
      dateString = tCommon("tomorrow");
    } else {
      dateString = format(date, "EEE, d MMM yy", { locale: getDateFnsLocale(locale) });
    }
    return dateString + " - " + time;
  };

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            eventForm.reset(defaultFormValues);
            setActivePicker(null);
          }
        }}
      >
        <SheetTrigger asChild>{children}</SheetTrigger>
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
              <FormField
                control={eventForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="font-medium">{tCommon("consumption-point")}</span>
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
                            {field.value === category && <CircleCheck />}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            {tNewEventSheet("no-tags-for-category")}
                          </FormDescription>
                        ) : (
                          <ToggleGroup
                            type="single"
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value || null)}
                            className="flex flex-wrap gap-2"
                          >
                            {tags.map((tag: Tag) => (
                              <ToggleGroupItem
                                className={cn(
                                  "hover:text-primary hover:bg-brand-tertiary rounded-lg transition-colors",
                                  tag.name === field.value ? "!bg-brand-secondary" : "bg-gray-100"
                                )}
                                value={tag.name}
                                key={tag.name}
                                aria-label={tag.name}
                              >
                                <span className="text-sm">{tag.name}</span>
                                {field.value === tag.name && <CircleCheck />}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        )}
                      </FormControl>
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

              <DateTimeField
                control={eventForm.control}
                name="startDateTime"
                label={tNewEventSheet("start-time")}
                getDisplayDateTime={getDisplayDateTime}
                isActive={activePicker === "start"}
                onToggle={() => {
                  setActivePicker((prev) => (prev === "start" ? null : "start"));
                }}
              />

              <DateTimeField
                control={eventForm.control}
                name="endDateTime"
                label={tNewEventSheet("end-time")}
                getDisplayDateTime={getDisplayDateTime}
                isActive={activePicker === "end"}
                onToggle={() => {
                  setActivePicker((prev) => (prev === "end" ? null : "end"));
                }}
              />

              {/* Notes */}
              <FormField
                control={eventForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tNewEventSheet("notes-label")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={tNewEventSheet("notes-placeholder")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-fit"
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                  disabled={mutation.isPending || !watchedCategory}
                  type="submit"
                  className="w-fit"
                >
                  {mutation.isPending && <LoaderCircle className="mr-2 animate-spin" />}
                  {tCommon("save")}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <EditTagsDialog isOpen={isEditTagsDialogOpen} onOpenChange={setIsEditTagsDialogOpen} />
    </>
  );
}

interface DateTimeFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  getDisplayDateTime: (date: Date | null) => string;
  isActive: boolean;
  onToggle: () => void;
}

export function DateTimeField<T extends FieldValues>({
  name,
  label,
  control,
  getDisplayDateTime,
  isActive,
  onToggle,
}: DateTimeFieldProps<T>) {
  const tCommon = useTranslations("common");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={onToggle}
              className={isActive ? "bg-secondary" : ""}
            >
              <Clock />
              {getDisplayDateTime(field.value)}
            </Button>
            <Button onClick={() => field.onChange(null)} variant="outline" type="button">
              <Undo2 /> {tCommon("clear")}
            </Button>
          </div>

          {isActive && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 overflow-x-auto">
                <Button onClick={() => field.onChange(new Date())} variant="outline" type="button">
                  {tCommon("now")}
                </Button>
                <Button
                  onClick={() => field.onChange(addSeconds(new Date(), 15))}
                  variant="outline"
                  type="button"
                >
                  15 sec
                </Button>
                <Button
                  onClick={() => field.onChange(addMinutes(new Date(), 1))}
                  variant="outline"
                  type="button"
                >
                  1 min
                </Button>
                <Button
                  onClick={() => field.onChange(addMinutes(new Date(), 5))}
                  variant="outline"
                  type="button"
                >
                  5 min
                </Button>
              </div>
              <DateTimePicker value={field.value} onChange={field.onChange} />
            </div>
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
