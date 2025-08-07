"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/_components/ui/form";
import { Input } from "@app/_components/ui/input";
import { ScrollArea } from "@app/_components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@app/_components/ui/sheet";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { createHousehold } from "@domain/entities/household";

const formSchema = createHousehold;

export function EditHouseholdSheet({
  householdId,
  isOpen,
  setIsOpen,
}: {
  householdId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const t = useTranslations("editHousehold");
  const tForm = useTranslations("createHousehold.form");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const { households } = useHouseholdStore();
  const household = households.find((h) => h.id === householdId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sensorId: "",
      name: "",
      residents: 1,
      street1: "",
      street2: "",
      city: "",
      zip: "",
      country: "",
    },
    values: household
      ? {
          sensorId: household.sensorId || "",
          name: household.name || "",
          residents: household.residents,
          street1: household.street1 || "",
          street2: household.street2 || "",
          city: household.city || "",
          zip: household.zip || "",
          country: household.country || "",
        }
      : undefined,
  });

  useEffect(() => {
    if (isOpen && household) {
      form.reset({
        sensorId: household.sensorId || "",
        name: household.name || "",
        residents: household.residents,
        street1: household.street1 || "",
        street2: household.street2 || "",
        city: household.city || "",
        zip: household.zip || "",
        country: household.country || "",
      });
    } else if (!isOpen) {
      form.reset();
    }
  }, [isOpen, household, form]);

  const utils = trpc.useUtils();
  const updateMutation = trpc.household.update.useMutation({
    onSuccess: () => {
      utils.household.invalidate();
      toast.success(t("updateSuccess"));
      setIsOpen(false);
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(
      {
        id: householdId,
        sensorId: values.sensorId.trim(),
        name: values.name.trim(),
        residents: values.residents,
        street1: values.street1?.trim(),
        street2: values.street2?.trim(),
        city: values.city?.trim(),
        zip: values.zip?.trim(),
        country: values.country?.trim(),
      },
      {
        onSuccess: () => {
          form.reset(values);
        },
      }
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(newOpenState) => {
        setIsOpen(newOpenState);
        if (!newOpenState) {
          form.reset();
        }
      }}
    >
      <SheetContent overlay={false} className="flex w-full max-w-md flex-col">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-6 p-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="residents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("residents")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={1}
                          {...field}
                          onKeyDown={(event) => {
                            if (["e", "E", "+", "-", ".", ","].includes(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sensorId"
                  render={({ field }) => (
                    <FormItem className="xl:col-span-2">
                      <FormLabel>{tForm("sensorId.label")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          placeholder="A1:B2:C3:D4:E5:F6"
                          className="font-mono"
                          maxLength={17}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="street1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("address")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("address2")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("city")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("zip")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("country")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="mt-4 flex flex-row justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {tCommon("save")}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
