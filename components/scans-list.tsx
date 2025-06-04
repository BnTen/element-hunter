"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Scan {
  id: number;
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  createdAt: string | Date;
}

interface ScansListProps {
  scans: Scan[];
}

export function ScansList({ scans }: ScansListProps) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-2">SEO Scans</h2>
      <p className="text-gray-600 mb-4">
        Vos derniers scans envoyés par l'extension Chrome
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                URL
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Meta Description
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                H1
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scans.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  Aucun scan pour l'instant. Utilisez l'extension Chrome pour en
                  ajouter.
                </td>
              </tr>
            )}
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td className="px-4 py-2 font-mono text-blue-700 underline">
                  <a href={scan.url} target="_blank" rel="noopener noreferrer">
                    {scan.url}
                  </a>
                </td>
                <td className="px-4 py-2">{scan.title || "-"}</td>
                <td className="px-4 py-2">{scan.metaDescription || "-"}</td>
                <td className="px-4 py-2">{scan.h1 || "-"}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                  {formatDistanceToNow(new Date(scan.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
