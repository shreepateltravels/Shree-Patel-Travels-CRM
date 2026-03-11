"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import AddStaffModal from "./AddStaffModal"; // Import the modal we just built!

export default function AddUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-brand flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" /> Add Staff
      </button>

      {/* The Modal Component */}
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)} // The Server Action handles the page refresh!
      />
    </>
  );
}
