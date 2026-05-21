"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import {
  FileText,
  PenSquare,
  Mail,
  Briefcase,
  BarChart3,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  LayoutTemplate,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { toggleDarkMode } from "@/store/uiSlice";
import type { RootState, AppDispatch } from "@/store";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";

const ALL_NAV_ITEMS = [
  { href: "/resumes",      icon: FileText,       label: "My Resumes",  flag: null },
  { href: "/templates",    icon: LayoutTemplate, label: "Templates",   flag: "templates" },
  { href: "/editor",       icon: PenSquare,      label: "Editor",      flag: null },
  { href: "/cover-letter", icon: Mail,           label: "Cover Letter",flag: "coverLetter" },
  { href: "/job-tracker",  icon: Briefcase,      label: "Job Tracker", flag: "jobTracker" },
  { href: "/analytics",    icon: BarChart3,      label: "Analytics",   flag: "analytics" },
  { href: "/jobs",         icon: Globe,          label: "Find Jobs",   flag: "findJobs" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { data: session } = useSession();

  const flags = useFeatureFlags();
  const navItems = ALL_NAV_ITEMS.filter(({ flag }) => !flag || flags[flag as keyof typeof flags]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    setUserMenuOpen(false);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  const user = session?.user;

  return (
    <>
      <header className="sticky top-0 z-60 h-16 shrink-0 bg-[#0f2044] shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center gap-2">
          {/* Wordmark */}
          <Link
            href="/"
            className="shrink-0 flex flex-col leading-none gap-0.5"
          >
            <span className="text-[10px] font-medium tracking-[0.18em] text-sky-300 uppercase">
              Maria
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white leading-none">
              {"Resume"}
              <span className="text-sky-300">Builder</span>
            </span>
          </Link>

          {/* Desktop nav — icons only at lg, icons+labels at xl */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-4">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className={clsx(
                  "flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap",
                  isActive(href)
                    ? "bg-white/15 text-white ring-1 ring-white/25"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                )}
              >
                <Icon size={15} />
                <span className="hidden xl:inline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            {/* Dark mode toggle */}
            {flags.darkMode && (
              <button
                onClick={() => dispatch(toggleDarkMode())}
                title={darkMode ? "Light mode" : "Dark mode"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:text-yellow-300 hover:bg-white/10 transition-colors"
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            )}

            {/* Auth section */}
            {user ? (
              /* Signed-in: avatar + dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/80 hover:bg-white/10 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20">
                      {(user.fullName || user.name || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-white max-w-32 truncate">
                    {user.fullName || user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={clsx(
                      "transition-transform",
                      userMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-[#0d1424] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.fullName || user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <UserCircle size={14} />
                      Profile Settings
                    </Link>
                    {user.role === 'admin' || user.role === 'super_admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      >
                        <ShieldCheck size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: sign in button */
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg text-sm font-bold px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 whitespace-nowrap shrink-0"
              >
                <LogIn size={14} />
                Sign In
              </Link>
            )}

            {/* Build Resume CTA */}
            <Link
              href="/editor"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg text-sm font-bold px-4 py-2 bg-white text-[#0f2044] hover:bg-sky-50 transition-colors shadow-md whitespace-nowrap shrink-0"
            >
              <PenSquare size={14} />
              Build Resume
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-[#0f2044] border-b border-white/10 shadow-2xl">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-white/15 text-white ring-1 ring-white/25"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}

            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                        {(user.fullName || user.name || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.fullName || user.name}
                      </p>
                      <p className="text-xs text-white/50">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <UserCircle size={14} /> Profile Settings
                  </Link>
                  {user.role === 'admin' || user.role === 'super_admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ShieldCheck size={14} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <LogIn size={14} /> Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sky-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <User size={14} /> Create Account
                  </Link>
                </>
              )}

              <Link
                href="/editor"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-white text-[#0f2044] text-sm font-bold px-4 py-2.5 hover:bg-sky-50 transition-colors"
              >
                <PenSquare size={14} />
                Build Resume
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Click-outside for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
