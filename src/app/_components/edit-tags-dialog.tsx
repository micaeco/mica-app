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

  useEffect(() => {
    setSelectedCategory(category ?? "shower");
  }, [category]);

  const tErrors = useTranslations("common.errors");
  const tCategories = useTranslations("common.categories");
  const tEditTagsDialog = useTranslations("edit-tags-dialog");

  const { selectedHouseholdId } = useHouseholdStore();
  const utils = trpc.useUtils();

  const { data: tags, isLoading: isLoadingTags } = trpc.tag.getTagsByCategory.useQuery({
    householdId: selectedHouseholdId,
    category: selectedCategory,
  });

  const { mutate: createTag, isPending: isCreatingTag } = trpc.tag.create.useMutation({
    onSuccess: () => {
      toast.success(tEditTagsDialog("tag-created-successfully"));
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

  const { mutate: updateTag, isPending: isUpdatingTag } = trpc.tag.update.useMutation({
    onSuccess: () => {
      toast.success(tEditTagsDialog("tag-updated-successfully"));
      utils.tag.getTagsByCategory.invalidate({
        householdId: selectedHouseholdId,
        category: selectedCategory,
      });
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const { mutate: deleteTag, isPending: isDeletingTag } = trpc.tag.delete.useMutation({
    onSuccess: () => {
      toast.success(tEditTagsDialog("tag-deleted-successfully"));
      utils.tag.getTagsByCategory.invalidate({
        householdId: selectedHouseholdId,
        category: selectedCategory,
      });
    },
    onError: () => {
      toast.error(tErrors("INTERNAL_SERVER_ERROR"));
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
              return (
                <EditableField
                  key={tag.id}
                  value={tag.name}
                  onChange={(newValue) => handleUpdate(tag, newValue)}
                  onDelete={() => handleDelete(tag.id)}
                  isSaving={isUpdatingTag}
                  isDeleting={isDeletingTag}
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
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              tEditTagsDialog.has(("no-tags-for-" + selectedCategory) as any)
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  tEditTagsDialog(("no-tags-for-" + selectedCategory) as any)
                : tEditTagsDialog("no-tags-for-category")
            }
          </span>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Input
            placeholder={tEditTagsDialog("new-tag-placeholder")}
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

  const tEditTagsDialog = useTranslations("edit-tags-dialog");

  const handleSave = () => {
    if (!isSaving && draft.trim() && draft !== value) {
      setIsEditing(false);
      onChange(draft.trim());
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
        autoFocus
        disabled={!isEditing || isSaving || isDeleting}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isSaving && !isDeleting) handleSave();
          if (e.key === "Escape" && !isSaving && !isDeleting) handleCancelEdit();
        }}
      />
      {isEditing ? (
        <>
          <Button
            variant="ghost"
            disabled={!draft.trim() || draft === value || isSaving}
            size="icon"
            onClick={handleSave}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isSaving}>
            <X />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
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
            className="text-destructive hover:text-destructive h-8 w-8"
            onClick={() => setShowAlertDialog(true)}
            disabled={isSaving || isDeleting}
          >
            <Trash2 />
          </Button>
          <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tEditTagsDialog("delete-tag-title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tEditTagsDialog("delete-tag-description", { tagName: value })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {tEditTagsDialog("delete-tag-cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    tEditTagsDialog("delete-tag-confirm")
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
