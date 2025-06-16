"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
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
  SheetTrigger,
} from "@app/_components/ui/sheet";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { createHousehold } from "@domain/entities/household";

const formSchema = createHousehold;

export function EditHouseholdSheet({
  householdId,
  children,
  className,
}: {
  householdId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const t = useTranslations("edit-household");
  const tForm = useTranslations("create-household.form");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const { households } = useHouseholdStore();
  const household = households.find((h) => h.id === householdId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sensorId: undefined,
      name: undefined,
      residents: 1,
      street1: undefined,
      street2: undefined,
      city: undefined,
      zip: undefined,
      country: undefined,
    },
    values: household
      ? {
          sensorId: household.sensorId,
          name: household.name,
          residents: household.residents,
          street1: household.street1,
          street2: household.street2,
          city: household.city,
          zip: household.zip,
          country: household.country,
        }
      : undefined,
  });

  const utils = trpc.useUtils();
  const updateMutation = trpc.household.updateHousehold.useMutation({
    onSuccess: () => {
      utils.household.findAllHouseholds.invalidate();
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });
  const deleteMutation = trpc.household.deleteHousehold.useMutation({
    onSuccess: () => {
      utils.household.findAllHouseholds.invalidate();
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(
      {
        id: householdId,
        name: values.name.trim(),
        residents: values.residents,
        street1: values.street1.trim(),
        street2: (values.street2 ?? "").trim(),
        city: values.city.trim(),
        zip: values.zip.trim(),
        country: values.country.trim(),
        sensorId: values.sensorId.trim(),
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  const handleRemove = () => {
    deleteMutation.mutate(householdId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={className}>{children}</SheetTrigger>
      <SheetContent className="flex w-full max-w-md flex-col">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  name="sensorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("sensor-id")}</FormLabel>
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
                    <FormItem className="xl:col-span-2">
                      <FormLabel>{tForm("residents")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(event) => field.onChange(Number(event.target.value))}
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              </div>

              <SheetFooter className="mt-4 flex flex-row justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  type="button"
                  disabled={deleteMutation.isPending}
                >
                  {tCommon("remove")} {tCommon("household")} <Trash2 className="ml-2 h-4 w-4" />
                </Button>
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
