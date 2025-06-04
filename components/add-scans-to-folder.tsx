"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Folder {
  id: string;
  name: string;
}

interface AddScansToFolderProps {
  scanIds: string[];
}

export function AddScansToFolder({ scanIds }: AddScansToFolderProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/seo/folders");
        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }
        const data = await response.json();
        setFolders(data);
      } catch {
        toast.error("Erreur lors du chargement des dossiers");
      }
    };

    fetchFolders();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFolderId) {
      toast.error("Veuillez sélectionner un dossier");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/seo/folders/add-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId: selectedFolderId,
          scanIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success("Scans ajoutés au dossier avec succès");
      setSelectedFolderId("");
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'ajout des scans au dossier");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedFolderId}
        onValueChange={setSelectedFolderId}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sélectionner un dossier" />
        </SelectTrigger>
        <SelectContent>
          {folders.map((folder) => (
            <SelectItem key={folder.id} value={folder.id}>
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} disabled={isLoading || !selectedFolderId}>
        {isLoading ? "Ajout..." : "Ajouter"}
      </Button>
    </div>
  );
}
