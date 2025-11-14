import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/_components/ui/form";
import { Input } from "@app/_components/ui/input";
import { trpc } from "@app/_lib/trpc";
import { createHouseholdInvitationForm } from "@domain/entities/household-invitation";

const formSchema = createHouseholdInvitationForm;

export function CreateInvitationDialog({
  isOpen,
  setIsOpen,
  householdId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  householdId: string;
}) {
  const t = useTranslations("createInvitation");
  const tErrors = useTranslations("common.errors");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: createInvitation, isPending } = trpc.household.createInvitation.useMutation({
    onError: (error) => {
      const errorCode = error.data?.code || "INTERNAL_SERVER_ERROR";
      // @ts-expect-error - Dynamic key for error translation
      toast.error(tErrors.has(errorCode) ? tErrors(errorCode) : tErrors("INTERNAL_SERVER_ERROR"));
    },
    onSuccess: () => {
      form.reset();
      setIsOpen(false);
      toast.success(t("success"));
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createInvitation({ 
      householdId, 
      invitedEmail: values.email 
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 animate-spin" />}
                {t("sendInvitation")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
