// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import { LogOut, ChevronDown, X } from "lucide-react";
// import { signOut } from "@/lib/actions/auth.actions";

// interface TopHeaderProps {
//   userEmail?: string;
//   userRole?: string;
// }

// export default function TopHeader({ userEmail, userRole }: TopHeaderProps) {
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const pathname = usePathname();

//   // Helper function to figure out the page name based on the URL
//   const getPageTitle = () => {
//     switch (pathname) {
//       case "/":
//         return "Dashboard";
//       case "/leads":
//         return "Lead Management";
//       case "/follow-ups":
//         return "Follow Ups";
//       case "/customers":
//         return "Customer Directory";
//       case "/cities":
//         return "City Management";
//       case "/users":
//         return "User Management";
//       default:
//         return "Shree Patel Travels";
//     }
//   };

//   return (
//     <>
//       <header className="h-20 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 sticky top-0 z-30">
//         {/* 1. Dynamic Page Title (Increased Size) */}
//         <div className="flex-1">
//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
//             {getPageTitle()}
//           </h1>
//         </div>

//         {/* 2. Profile Trigger Button */}
//         <div className="flex items-center">
//           <button
//             onClick={() => setIsProfileModalOpen(true)}
//             className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
//           >
//             <div className="w-10 h-10 rounded-full bg-[#3da9d4]/10 flex items-center justify-center text-[#3da9d4] font-bold border border-[#3da9d4]/20">
//               {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-semibold text-slate-800 leading-tight">
//                 {userRole === "Admin" ? "Administrator" : "Staff Member"}
//               </p>
//               <p className="text-xs text-slate-500 truncate max-w-[120px]">
//                 {userEmail || "user@shreepatel.com"}
//               </p>
//             </div>
//             <ChevronDown className="w-4 h-4 text-slate-400" />
//           </button>
//         </div>
//       </header>

//       {/* 3. True Centered Profile Modal */}
//       {isProfileModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Blurred Background Overlay */}
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
//             onClick={() => setIsProfileModalOpen(false)}
//           />

//           {/* Modal Content Box */}
//           <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
//               <h3 className="font-semibold text-slate-800">Account Profile</h3>
//               <button
//                 onClick={() => setIsProfileModalOpen(false)}
//                 className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-8 flex flex-col items-center text-center">
//               <div className="w-20 h-20 rounded-full bg-[#3da9d4]/10 flex items-center justify-center text-[#3da9d4] text-3xl font-bold border-4 border-white shadow-sm mb-4">
//                 {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
//               </div>
//               <p className="text-xl font-bold text-slate-800 mb-1">
//                 {userRole === "Admin" ? "Administrator" : "Staff Member"}
//               </p>
//               <p className="text-sm text-slate-500">
//                 {userEmail || "user@shreepatel.com"}
//               </p>
//             </div>

//             {/* Modal Footer (Logout Button only) */}
//             <div className="p-4 border-t border-slate-100 bg-slate-50">
//               <button
//                 onClick={() => signOut()}
//                 className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-medium text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 rounded-xl transition-all shadow-sm"
//               >
//                 <LogOut className="w-5 h-5" />
//                 Securely Log Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
