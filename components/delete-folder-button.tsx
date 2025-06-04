"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface DeleteFolderButtonProps {
  folderId: string;
}

export function DeleteFolderButton({ folderId }: DeleteFolderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/seo/folders/${folderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success("Dossier supprimé avec succès");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression du dossier");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
}
