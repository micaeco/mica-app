"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useHouseholdStore } from "@stores/household.store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
} from "@components/ui/panel";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

const formSchema = z.object({
  newHouseholdName: z.string().min(1, "Aquest camp és obligatori"),
});

export function CreateHouseholdPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { addHousehold } = useHouseholdStore();
  const [open, setOpen] = useState(false);

  const t = useTranslations("create-household");
  const common = useTranslations("common");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newHouseholdName: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const name = values.newHouseholdName.trim();
    if (name) {
      addHousehold({ id: Date.now().toString(), name, sensorId: "" });
      form.reset();
    }
    setOpen(false);
  };

  return (
    <Panel open={open} onOpenChange={setOpen}>
      <PanelTrigger className={className}>{children}</PanelTrigger>
      <PanelContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <PanelHeader>
              <PanelTitle>{t("title")}</PanelTitle>
              <PanelDescription>{t("description")}</PanelDescription>
            </PanelHeader>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="newHouseholdName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common("name")}</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full rounded border border-gray-300 p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="submit">{common("create")}</Button>
            </div>
          </form>
        </Form>
      </PanelContent>
    </Panel>
  );
}
