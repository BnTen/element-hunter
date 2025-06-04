"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Folder {
  id: string;
  name: string;
}

interface FolderFilterProps {
  folders: Folder[];
}

export function FolderFilter({ folders }: FolderFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolder = searchParams.get("folder");

  const handleFolderChange = (folderId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (folderId === "all") {
      params.delete("folder");
    } else {
      params.set("folder", folderId);
    }
    router.push(`/scans?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Filter by folder:</span>
      <Select value={currentFolder || "all"} onValueChange={handleFolderChange}>
        <SelectTrigger className="w-[200px] bg-white border-input hover:bg-accent hover:text-accent-foreground">
          <SelectValue placeholder="All scans" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All scans</SelectItem>
          {folders.map((folder) => (
            <SelectItem key={folder.id} value={folder.id}>
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
