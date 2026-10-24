 
```jsx
import { useState } from "react";
import { Users, LockKeyhole, Mail, ArrowRight } from "lucide-react";

export default function App() {
  const [role, setRole] = useState("Admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] p-4 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1729] shadow-2xl md:grid-cols-2">

        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-600 to-blue-900 p-10 md:flex">
          <div className="flex items-center gap-3">
            <Users size={32} />
            <h1 className="text-2xl font-bold">HCM Lite</h1>
          </div>

          <div>
            <h2 className="mb-4 text-4xl font-bold leading-tight">
              Manage People.<br />Build Better Teams.
            </h2>
            <p className="text-blue-100">
              Your complete human resource management workspace.
            </p>
          </div>

          <p className="text-sm text-blue-200">
            AI-powered HR Management System
          </p>
        </div>

        <div className="p-7 sm:p-12">
          <div className="mb-8 md:hidden">
            <h1 className="text-2xl font-bold text-cyan-400">HCM Lite</h1>
          </div>

          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your dashboard
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`${role} login UI ready!`);
            }}
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Login As
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#020617] p-3.5 outline-none focus:border-cyan-400"
              >
                <option>Admin</option>
                <option>HR</option>
                <option>Employee</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#020617] px-4 focus-within:border-cyan-400">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="w-full bg-transparent py-3.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#020617] px-4 focus-within:border-cyan-400">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent py-3.5 outline-none"
                />
              </div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            HCM Lite · AI-assisted HR Management
          </p>
        </div>
      </div>
    </div>
  );
}
```
