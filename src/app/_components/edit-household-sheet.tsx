"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/_components/ui/alert-dialog";
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const t = useTranslations("edit-household");
  const tForm = useTranslations("create-household.form");
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

  const utils = trpc.useUtils();
  const updateMutation = trpc.household.updateHousehold.useMutation({
    onSuccess: () => {
      utils.household.findAllHouseholds.invalidate();
      toast.success(t("update-success"));
      setOpen(false);
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });
  const deleteMutation = trpc.household.deleteHousehold.useMutation({
    onSuccess: () => {
      utils.household.findAllHouseholds.invalidate();
      toast.success(t("delete-success"));
      setOpen(false);
      setShowConfirmDelete(false);
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

  const handleDeleteHousehold = () => {
    deleteMutation.mutate(householdId);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        if (open) {
          form.reset();
          setOpen(false);
        } else setOpen(true);
      }}
    >
      <SheetTrigger className={className}>{children}</SheetTrigger>
      <SheetContent className="flex w-full max-w-md flex-col">
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
                          {...field}
                          onChange={(event) => field.onChange(Number(event.target.value))}
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
                      <FormLabel>{tForm("sensor-id.label")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="A1:B2:C3:D4:E5:F6"
                          className="font-mono"
                          maxLength={17}
                          value={(() => {
                            const sanitizedValue = field.value
                              .toUpperCase()
                              .replace(/[^A-F0-9]/g, "");
                            return (sanitizedValue.slice(0, 12).match(/.{1,2}/g) || []).join(":");
                          })()}
                          onChange={(e) => {
                            const sanitizedValue = e.target.value
                              .toUpperCase()
                              .replace(/[^A-F0-9]/g, "");

                            const formattedValue = (
                              sanitizedValue.slice(0, 12).match(/.{1,2}/g) || []
                            ).join(":");

                            field.onChange(formattedValue);
                          }}
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

              <SheetFooter className="mt-4 flex flex-row justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {tCommon("save")}
                </Button>
              </SheetFooter>
            </form>
          </Form>

          <div className="p-4 pt-0">
            <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
              <div className="font-semibold">{t("delete-section.title")}</div>
              <div>{t("delete-section.description")}</div>
              <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    disabled={deleteMutation.isPending}
                  >
                    {t("delete-section.button-text", { householdName: household?.name })}{" "}
                    <Trash2 className="ml-2 h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("alert-dialog.confirm-title")}</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <div>
                        {t("alert-dialog.confirm-description-bold", {
                          householdName: household?.name,
                        })}
                      </div>
                      <div className="bg-destructive/10 text-destructive mt-6 rounded p-3 text-xs">
                        {t("alert-dialog.confirm-description-text")}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteHousehold}
                      disabled={deleteMutation.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
                    >
                      {tCommon("delete-confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
