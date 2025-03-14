"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  newHouseholdAdress: z.string(),
});

export function CreateHouseholdPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const t = useTranslations("create-household");
  const common = useTranslations("common");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newHouseholdName: "", newHouseholdAdress: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const name = values.newHouseholdName.trim();
    // const adress = values.newHouseholdAdress.trim();
    if (name) {
      form.reset();
    }
    setOpen(false);
  };

  return (
    <Panel open={open} onOpenChange={setOpen}>
      <PanelTrigger className={className}>{children}</PanelTrigger>
      <PanelContent>
        <PanelHeader>
          <PanelTitle>{t("title")}</PanelTitle>
          <PanelDescription>{t("description")}</PanelDescription>
        </PanelHeader>
        <Form {...form}>
          <form className="p-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
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
              <FormField
                control={form.control}
                name="newHouseholdAdress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{common("adress")}</FormLabel>
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
