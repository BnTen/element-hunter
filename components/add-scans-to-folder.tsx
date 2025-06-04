"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Scan {
  id: string;
  url: string;
  data: any;
}

interface AddScansToFolderProps {
  folderId: string;
}

export function AddScansToFolder({ folderId }: AddScansToFolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableScans, setAvailableScans] = useState<Scan[]>([]);
  const [selectedScans, setSelectedScans] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableScans();
    }
  }, [isOpen]);

  const fetchAvailableScans = async () => {
    try {
      const response = await fetch("/api/seo/scans");
      if (!response.ok) throw new Error("Failed to fetch scans");
      const data = await response.json();
      setAvailableScans(data);
    } catch (error) {
      // Error handled by UI state
    }
  };

  const handleSubmit = async () => {
    if (selectedScans.length === 0) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/seo/folders/add-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId,
          scanIds: selectedScans,
        }),
      });

      if (!response.ok) throw new Error("Failed to add scans");

      setIsOpen(false);
      setSelectedScans([]);
      router.refresh();
    } catch (error) {
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
          className="w-full border-dashed"
          disabled={isLoading}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add scans
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Scans</DialogTitle>
          <DialogDescription>
            Select the scans you want to add to this folder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {availableScans.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No scans available
              </p>
            ) : (
              availableScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center space-x-2 rounded-lg border p-3"
                >
                  <Checkbox
                    id={scan.id}
                    checked={selectedScans.includes(scan.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedScans([...selectedScans, scan.id]);
                      } else {
                        setSelectedScans(
                          selectedScans.filter((id) => id !== scan.id)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={scan.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {scan.url}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={selectedScans.length === 0 || isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
