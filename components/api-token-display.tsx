"use client";

import { useState } from "react";

interface ApiTokenDisplayProps {
  apiToken: string;
}

export function ApiTokenDisplay({ apiToken }: ApiTokenDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiToken);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md">
      <p className="text-sm text-gray-500 mb-4">
        Your API token is used to authenticate requests to our API.
      </p>

      <div className="flex gap-2 items-center">
        <input
          value={apiToken}
          readOnly
          className="font-mono px-2 py-1 border rounded w-full bg-gray-100 text-gray-800"
        />
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded text-white ${
            isCopied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isCopied ? "Copié !" : "Copier"}
        </button>
      </div>
      {isCopied && (
        <div className="text-green-600 text-sm mt-2">
          Token copié dans le presse-papier !
        </div>
      )}
    </div>
  );
}
