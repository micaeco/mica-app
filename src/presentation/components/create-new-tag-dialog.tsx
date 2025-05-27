"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Category } from "@domain/entities/category";
import { Button } from "@presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@presentation/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@presentation/components/ui/form";
import { Input } from "@presentation/components/ui/input";
import { trpc } from "@presentation/lib/trpc";
import { useHouseholdStore } from "@presentation/stores/household";

const newTagSchema = z.object({
  tagName: z.string().nonempty("Tag name cannot be empty."),
});

type NewTagFormValues = z.infer<typeof newTagSchema>;

interface CreateTagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: Category | undefined;
  onTagCreated: (tagName: string) => void;
}

export function CreateTagDialog({
  isOpen,
  onOpenChange,
  selectedCategory,
  onTagCreated,
}: CreateTagDialogProps) {
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  const tNewTagDialog = useTranslations("new-tag-dialog");

  const { selectedHouseholdId } = useHouseholdStore();

  const newTagForm = useForm<NewTagFormValues>({
    resolver: zodResolver(newTagSchema),
    defaultValues: {
      tagName: "",
    },
  });

  const utils = trpc.useUtils();
  const { mutate: createTag } = trpc.home.createHouseholdTag.useMutation({
    onSuccess: async (data, variables) => {
      await utils.home.getHouseholdCategoryTags.invalidate({
        householdId: selectedHouseholdId,
        category: selectedCategory,
      });

      toast.success(tNewTagDialog("tag-created-successfully"));

      onTagCreated(variables.name);

      onOpenChange(false);
      newTagForm.reset();
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const onSubmitNewTag = (data: NewTagFormValues) => {
    if (!selectedCategory) {
      toast.error(tErrors("VALIDATION_ERROR"));
      return;
    }
    createTag({
      householdId: selectedHouseholdId,
      category: selectedCategory,
      name: data.tagName.trim(),
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          newTagForm.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tNewTagDialog("title")}</DialogTitle>
          <DialogDescription>
            {tNewTagDialog("description", {
              category: selectedCategory ? tCategories(selectedCategory) : "",
            })}
          </DialogDescription>
        </DialogHeader>
        <Form {...newTagForm}>
          <form onSubmit={newTagForm.handleSubmit(onSubmitNewTag)} className="grid gap-4 py-4">
            <FormField
              control={newTagForm.control}
              name="tagName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="tagName" className="text-right">
                    {tCommon("name")}
                  </FormLabel>
                  <FormControl>
                    <Input id="tagName" {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={newTagForm.formState.isSubmitting}>
                {tCommon("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
