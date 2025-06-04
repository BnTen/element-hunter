"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateFolderButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [folderName, setFolderName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/seo/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: folderName.trim() }),
      });

      if (!response.ok) throw new Error("Failed to create folder");

      setIsOpen(false);
      setFolderName("");
      router.refresh();
    } catch {
      // Error handled by UI state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 border-dashed"
          disabled={isLoading}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un dossier</DialogTitle>
          <DialogDescription>
            Donnez un nom à votre nouveau dossier de scans.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du dossier</Label>
            <Input
              id="name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Mon dossier"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!folderName.trim() || isLoading}
          >
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
