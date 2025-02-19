"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

const formSchema = z.object({
  householdName: z.string().min(1, "Aquest camp és obligatori"),
});

export function EditHouseholdSheet({
  householdId,
  children,
  className,
}: {
  householdId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { updateName, deleteHousehold, households } = useHouseholdStore();
  const [open, setOpen] = useState(false);

  const t = useTranslations("edit-household");
  const common = useTranslations("common");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { householdName: households.find((h) => h.id === householdId)?.name },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const name = values.householdName.trim();
    if (name) {
      updateName(householdId, name);
      form.reset({ householdName: name });
      setOpen(false);
    }
  };

  const handleRemove = () => {
    deleteHousehold(householdId);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={className}>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>{t("title")}</SheetTitle>
              <SheetDescription>{t("description")}</SheetDescription>
            </SheetHeader>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="householdName"
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
              <Button variant="destructive" type="button" onClick={handleRemove}>
                {common("remove")} {common("household")} <Trash2 />
              </Button>
              <Button type="submit">{common("save")}</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
