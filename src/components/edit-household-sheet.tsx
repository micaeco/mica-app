"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

import { useHouseholdStore } from "@stores/household";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

const formSchema = z.object({
  householdName: z.string().min(1, "Aquest camp és obligatori"),
  householdAdress: z.string().min(1, "Aquest camp és obligatori"),
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
  const [open, setOpen] = useState(false);

  const households = useHouseholdStore((state) => state.households);
  const updateName = useHouseholdStore((state) => state.updateName);
  const deleteHousehold = useHouseholdStore((state) => state.deleteHousehold);
  const updateSelectedHousehold = useHouseholdStore((state) => state.updateSelectedHousehold);

  const t = useTranslations("edit-household");
  const common = useTranslations("common");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      householdName: households.find((h) => h.id === householdId)?.name,
      householdAdress: households.find((h) => h.id === householdId)?.adress,
    },
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
    updateSelectedHousehold(households[0].id);
    deleteHousehold(householdId);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={className}>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="space-y-2 py-4" onSubmit={form.handleSubmit(onSubmit)}>
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

            <FormField
              control={form.control}
              name="householdAdress"
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

            <SheetFooter className="mt-4 flex flex-row justify-end gap-2">
              <Button variant="destructive" onClick={handleRemove}>
                {common("remove")} {common("household")} <Trash2 />
              </Button>
              <Button type="submit">{common("save")}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
