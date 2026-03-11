"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Refresh the router to trigger the middleware and go to dashboard
      router.refresh();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* ONE SINGLE WHITE BOX FOR EVERYTHING */}
        <div className="bg-white py-10 px-4 shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] sm:rounded-2xl sm:px-10 border border-[#e2e8f0] flex flex-col items-center">
          {/* Shree Patel Travels Logo */}
          <Image
            src="/logo.png"
            alt="Shree Patel Travels"
            width={90}
            height={90}
            className="object-contain mb-4"
          />

          <h2 className="text-center text-2xl font-bold tracking-tight text-[#1e293b] mb-2">
            Shree Patel Travels
          </h2>
          <p className="text-center text-sm text-[#64748b] mb-8">
            Sign in to your account
          </p>

          <form className="space-y-6 w-full" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-[#1e293b]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-[#e2e8f0] px-3 py-2 placeholder-[#64748b] shadow-sm focus:border-[#3da9d4] focus:outline-none focus:ring-1 focus:ring-[#3da9d4] sm:text-sm"
                  placeholder="admin@shreepatel.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1e293b]">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-[#e2e8f0] px-3 py-2 pr-10 placeholder-[#64748b] shadow-sm focus:border-[#3da9d4] focus:outline-none focus:ring-1 focus:ring-[#3da9d4] sm:text-sm"
                  placeholder="••••••••"
                />

                {/* The Eye Icon Button */}
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748b] hover:text-[#3da9d4] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center rounded-lg border border-transparent bg-[#3da9d4] py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#2882a8] focus:outline-none focus:ring-2 focus:ring-[#3da9d4] focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
