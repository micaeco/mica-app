"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Pencil, Check, Loader2, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@app/_components/ui/alert-dialog";
import { Button } from "@app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@app/_components/ui/dialog";
import { Input } from "@app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/_components/ui/select";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";
import { KeysOfType } from "@app/_types/utils";
import { categories, Category, categoryMap } from "@domain/entities/category";
import { Tag } from "@domain/entities/tag";

const filteredCategories: Category[] = categories.filter(
  (category) => category !== "rest" && category !== "unknown"
);

interface EditTagsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

export function EditTagsDialog({ isOpen, onOpenChange, category }: EditTagsDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("shower");
  const [name, setName] = useState("");
  const [savingTagId, setSavingTagId] = useState<number | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedCategory(category && filteredCategories.includes(category) ? category : "shower");
  }, [category]);

  const tErrors = useTranslations("common.errors");
  const tCategories = useTranslations("common.categories");
  const tEditTagsDialog = useTranslations("editTagsDialog");

  const { selectedHouseholdId } = useHouseholdStore();
  const utils = trpc.useUtils();

  const { data: tags, isLoading: isLoadingTags } = trpc.tag.getTagsByCategory.useQuery(
    {
      householdId: selectedHouseholdId,
      category: selectedCategory,
    },
    {
      enabled: !!selectedHouseholdId && !!selectedCategory,
    }
  );

  const { mutate: createTag, isPending: isCreatingTag } = trpc.tag.create.useMutation({
    onSuccess: () => {
      toast.success(tEditTagsDialog("tagCreatedSuccessfully"));
      utils.tag.getTagsByCategory.invalidate({
        householdId: selectedHouseholdId,
        category: selectedCategory,
      });
      setName("");
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const { mutate: updateTag } = trpc.tag.update.useMutation({
    onMutate: (variables) => {
      setSavingTagId(variables.tagId);
    },
    onSuccess: () => {
      toast.success(tEditTagsDialog("tagUpdatedSuccessfully"));
      utils.tag.getTagsByCategory.invalidate({
        householdId: selectedHouseholdId,
        category: selectedCategory,
      });
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
    onSettled: () => {
      setSavingTagId(null);
    },
  });

  const { mutate: deleteTag } = trpc.tag.delete.useMutation({
    onMutate: (variables) => {
      setDeletingTagId(variables.id);
    },
    onSuccess: () => {
      toast.success(tEditTagsDialog("tagDeletedSuccessfully"));
      utils.tag.getTagsByCategory.invalidate({
        householdId: selectedHouseholdId,
        category: selectedCategory,
      });
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
    onSettled: () => {
      setDeletingTagId(null);
    },
  });

  const handleCreate = () => {
    createTag({
      householdId: selectedHouseholdId,
      category: selectedCategory,
      name: name.trim(),
    });
  };

  const handleUpdate = (tag: Tag, newName: string) => {
    updateTag({
      tagId: tag.id,
      newName: newName.trim(),
    });
    utils.event.invalidate();
  };

  const handleDelete = (tagId: number) => {
    deleteTag({
      id: tagId,
    });
    utils.event.invalidate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>{tEditTagsDialog("title")}</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>

        <Select
          value={selectedCategory}
          onValueChange={(category) => setSelectedCategory(category as Category)}
        >
          <SelectTrigger className="bg-brand-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  <Image
                    src={categoryMap[category].icon!}
                    alt={tCategories(category)}
                    width={20}
                    height={20}
                    className="mr-2 inline-block"
                  />
                  {tCategories(category)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isLoadingTags ? (
          <Loader2 className="animate-spin" />
        ) : tags && tags.length > 0 ? (
          <div className="max-h-52 overflow-y-auto">
            {tags.map((tag, index) => {
              const isTagSaving = savingTagId === tag.id;
              const isTagDeleting = deletingTagId === tag.id;
              return (
                <EditableField
                  key={tag.id}
                  value={tag.name}
                  onChange={(newValue) => handleUpdate(tag, newValue)}
                  onDelete={() => handleDelete(tag.id)}
                  isSaving={isTagSaving}
                  isDeleting={isTagDeleting}
                  className={
                    tags.length == 1
                      ? ""
                      : index == 0
                        ? "rounded-b-none"
                        : index == tags.length - 1
                          ? "rounded-t-none"
                          : "rounded-none"
                  }
                />
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">
            {tEditTagsDialog.has(
              ("no-tags-for-" + selectedCategory) as KeysOfType<IntlMessages, "editTagsDialog">
            )
              ? tEditTagsDialog(
                  ("no-tags-for-" + selectedCategory) as KeysOfType<IntlMessages, "editTagsDialog">
                )
              : tEditTagsDialog("noTagsForCategory")}
          </span>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Input
            placeholder={tEditTagsDialog("newTagPlaceholder")}
            className="flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          <Button variant="secondary" size="icon" onClick={handleCreate} disabled={!name.trim()}>
            {isCreatingTag ? <Loader2 className="mr-2 animate-spin" /> : <Check />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EditableFieldProps {
  value: string;
  onChange: (newValue: string) => void;
  onDelete: () => void;
  className?: string;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function EditableField({
  value,
  onChange,
  onDelete,
  className,
  isSaving = false,
  isDeleting = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const tEditTagsDialog = useTranslations("editTagsDialog");

  const handleSave = () => {
    if (!isSaving && draft.trim() && draft !== value) {
      onChange(draft.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft(value);
  };

  return (
    <div className="flex h-10 items-center justify-between gap-1 rounded-b-none">
      <Input
        className={cn("mr-2 h-10 flex-1 text-sm disabled:cursor-auto", className)}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={!isEditing || isSaving || isDeleting}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isSaving && !isDeleting) handleSave();
          if (e.key === "Escape" && !isSaving && !isDeleting) handleCancelEdit();
        }}
      />
      {isEditing || isSaving ? (
        <>
          <Button
            variant="ghost"
            disabled={!draft.trim() || draft === value || isSaving || isDeleting}
            size="icon"
            onClick={handleSave}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Check />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelEdit}
            disabled={isSaving || isDeleting}
          >
            <X />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDraft(value);
              setIsEditing(true);
            }}
            disabled={isSaving || isDeleting}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowAlertDialog(true)}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
          <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tEditTagsDialog("deleteTagTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tEditTagsDialog("deleteTagDescription", { tagName: value })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {tEditTagsDialog("deleteTagCancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    tEditTagsDialog("deleteTagConfirm")
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
