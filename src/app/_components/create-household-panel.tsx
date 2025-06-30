"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, type FieldName } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
type FormValues = z.infer<typeof formSchema>;

const isFieldRequired = (fieldName: keyof FormValues) => {
  const field = formSchema.shape[fieldName];
  return !(field instanceof z.ZodOptional || field instanceof z.ZodNullable);
};

const stepFields: FieldName<FormValues>[][] = [
  ["name", "residents", "sensorId"], // Step 1: Basic Info
  ["street1", "street2", "city", "zip", "country"], // Step 2: Address
];

export function CreateHouseholdPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const t = useTranslations("create-household");
  const tForm = useTranslations("create-household.form");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const form = useForm<FormValues>({
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
    mode: "onTouched",
  });

  const utils = trpc.useUtils();
  const mutation = trpc.household.create.useMutation({
    onSuccess: () => {
      form.reset();
      setCurrentStep(0);
      setOpen(false);
      utils.household.getAll.invalidate();
      toast.success(t("success"));
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      name: values.name.trim(),
      sensorId: values.sensorId.replace(/[^0-9a-fA-F]/g, ""),
      residents: values.residents,
      street1: values.street1?.trim(),
      street2: values.street2?.trim(),
      city: values.city?.trim(),
      zip: values.zip?.trim(),
      country: values.country?.trim(),
    });
  };

  const handleNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const panelTitles = [t("step1.title"), t("step2.title")];
  const panelDescriptions = [t("step1.description"), t("step2.description")];

  return (
    <Panel open={open} onOpenChange={setOpen}>
      <PanelTrigger className={className}>{children}</PanelTrigger>
      <PanelContent className="flex max-h-[90dvh] flex-col">
        <PanelHeader>
          <PanelTitle>{panelTitles[currentStep]}</PanelTitle>
          <PanelDescription>{panelDescriptions[currentStep]}</PanelDescription>
        </PanelHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* 3. Conditional Rendering for Step 1 */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={isFieldRequired("name")}>{tForm("name")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Familia Costa" {...field} />
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

                  <FormField
                    control={form.control}
                    name="sensorId"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel required={isFieldRequired("sensorId")}>
                          {tForm("sensor-id.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="A1:B2:C3:D4:E5:F6"
                            className="font-mono"
                            maxLength={17}
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
                        <FormDescription>{tForm("sensor-id.description")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* 3. Conditional Rendering for Step 2 */}
              {currentStep === 1 && (
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
              )}

              {/* 4. Dynamic Button Navigation */}
              <div className="mt-4 flex justify-end gap-2">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={handlePreviousStep}>
                    {tCommon("back")}
                  </Button>
                )}

                {currentStep < stepFields.length - 1 && (
                  <Button type="button" onClick={handleNextStep}>
                    {tCommon("next")}
                  </Button>
                )}

                {currentStep === stepFields.length - 1 && (
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <LoaderCircle className="animate-spin" />}
                    {tCommon("create")}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </ScrollArea>
      </PanelContent>
    </Panel>
  );
}
