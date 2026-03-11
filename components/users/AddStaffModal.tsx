"use client";

import { useState } from "react";
import { X, Loader2, User, Mail, Lock, Phone, Shield } from "lucide-react";
// We will create this action in the next step!
import { createStaffUser } from "@/lib/actions/auth.actions";

export default function AddStaffModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
      mobile_number: `+91 ${formData.get("mobile_number") as string}`,
    };

    try {
      const result = await createStaffUser(data);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess(); // Triggers a refresh on the main page
        onClose();
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Add New Staff</h3>
            <p className="text-xs text-slate-500">
              Create credentials for a new employee
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="text"
                name="full_name"
                className="input-primary pl-9 w-full"
                placeholder="e.g. Rahul Patel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="email"
                name="email"
                className="input-primary pl-9 w-full"
                placeholder="rahul@sptravels.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Temporary Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="text"
                name="password"
                minLength={6}
                className="input-primary pl-9 w-full"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              System Role *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                required
                name="role"
                className="input-primary pl-9 w-full appearance-none"
              >
                <option value="Staff">Staff (Can manage leads only)</option>
                <option value="Admin">Admin (Full system access)</option>
              </select>
            </div>
          </div>

          {/* THE +91 MOBILE NUMBER FIELD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number *
            </label>
            <div className="relative">
              {/* This absolute div holds the icon and the +91 */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 text-sm font-bold border-r border-slate-200 pr-2">
                  +91
                </span>
              </div>

              <input
                required
                type="tel"
                name="mobile_number"
                maxLength={10}
                pattern="[0-9]{10}"
                // We add pl-[76px] to push the typing area past the +91 box
                className="input-primary pl-[76px] w-full font-medium tracking-wide"
                placeholder="12345 67890"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
              />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand px-6 py-2.5 flex items-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
