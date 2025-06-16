"use client";

import { useState } from "react";

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
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
} from "@app/_components/ui/panel";
import { ScrollArea } from "@app/_components/ui/scroll-area";
import { trpc } from "@app/_lib/trpc";
import { createHousehold } from "@domain/entities/household";

const formSchema = createHousehold;

const isFieldRequired = (fieldName: keyof z.infer<typeof formSchema>) => {
  const field = formSchema.shape[fieldName];
  return !(field instanceof z.ZodOptional || field instanceof z.ZodNullable);
};

export function CreateHouseholdPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const t = useTranslations("create-household");
  const tForm = useTranslations("create-household.form");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

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
  });

  const utils = trpc.useUtils();
  const mutation = trpc.household.createHousehold.useMutation({
    onSuccess: () => {
      utils.household.findAllHouseholds.invalidate();
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate({
      name: values.name.trim(),
      sensorId: values.sensorId.trim(),
      residents: values.residents,
      street1: (values.street1 ?? "").trim(),
      street2: (values.street2 ?? "").trim(),
      city: (values.city ?? "").trim(),
      zip: (values.zip ?? "").trim(),
      country: (values.country ?? "").trim(),
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Panel open={open} onOpenChange={setOpen}>
      <PanelTrigger className={className}>{children}</PanelTrigger>
      <PanelContent className="flex max-h-[90dvh] flex-col">
        <PanelHeader>
          <PanelTitle>{t("title")}</PanelTitle>
          <PanelDescription>{t("description")}</PanelDescription>
        </PanelHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required={isFieldRequired("name")}>{tForm("name")}</FormLabel>
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
                      <FormLabel required={isFieldRequired("sensorId")}>
                        {tForm("sensor-id")}
                      </FormLabel>
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
                      <FormLabel required={isFieldRequired("residents")}>
                        {tForm("residents")}
                      </FormLabel>
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
                      <FormLabel required={isFieldRequired("street1")}>
                        {tForm("address")}
                      </FormLabel>
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
                      <FormLabel required={isFieldRequired("street2")}>
                        {tForm("address2")}
                      </FormLabel>
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
                        <FormLabel required={isFieldRequired("city")}>{tForm("city")}</FormLabel>
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
                        <FormLabel required={isFieldRequired("zip")}>{tForm("zip")}</FormLabel>
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
                        <FormLabel required={isFieldRequired("country")}>
                          {tForm("country")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {tCommon("create")}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </PanelContent>
    </Panel>
  );
}
