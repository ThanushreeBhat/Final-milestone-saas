"use client";

import { useState } from "react";

export default function ShareModal({ isOpen, onClose, onShare }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">Share Page</h2>

        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 mb-4"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border">
            Cancel
          </button>
          <button
            onClick={() => {
              onShare(email, role);
              setEmail("");
              onClose();
            }}
            className="px-3 py-1 bg-black text-white"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
