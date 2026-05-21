"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Trash2,
  Sparkles,
  Check,
  Loader2,
  Undo2,
  Redo2,
  Moon,
  Sun,
  Zap,
  FolderOpen,
  Save,
  Keyboard,
  Mail,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { useSelector } from "react-redux";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ThemeCustomizer } from "@/components/editor/ThemeCustomizer";
import { ATSChecker } from "@/components/features/ATSChecker";
import { ResumeManager } from "@/components/features/ResumeManager";
import { AuthToSaveModal } from "@/components/shared/AuthToSaveModal";
import { KeyboardShortcutsModal } from "@/components/shared/KeyboardShortcutsModal";
import { QuickCoverLetterModal } from "@/components/features/QuickCoverLetterModal";
import { useResumeActions } from "@/hooks/useResumeActions";
import { usePDFExport } from "@/hooks/usePDFExport";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { usePersonal } from "@/hooks/useResumeData";
import type { RootState } from "@/store";

interface AppHeaderProps {
  saveToCloud: () => Promise<string | null>;
  saveStatus: "idle" | "saved";
  onNewResumeId?: (id: string) => void;
}

export function AppHeader({
  saveToCloud,
  saveStatus,
  onNewResumeId,
}: Readonly<AppHeaderProps>) {
  const router = useRouter();
  const { loadSampleData, clearResume, toggleDarkEditor } = useResumeActions();
  const { exportPDF, exporting } = usePDFExport();
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const personal = usePersonal();
  const darkEditor = useSelector((state: RootState) => state.ui.darkEditor);
  const { data: session } = useSession();

  const [confirmClear, setConfirmClear] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [saving, setSaving] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreMenu]);

  function handleClear() {
    if (confirmClear) {
      clearResume();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }

  async function handleSave() {
    if (!session) {
      setShowSignInModal(true);
      return;
    }
    setSaving(true);
    const newId = await saveToCloud();
    setSaving(false);
    if (newId) onNewResumeId?.(newId);
  }

  const filename = personal.fullName
    ? `${personal.fullName.replaceAll(/\s+/g, "_")}_Resume.pdf`
    : "resume.pdf";

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 dark:border-white/[0.07] bg-white dark:bg-[#0d1424] px-3 shadow-sm gap-2">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <div className="hidden md:flex flex-col leading-none gap-0.5">
            <span className="text-[9px] font-medium tracking-[0.18em] text-sky-500 dark:text-sky-400 uppercase">
              Maria
            </span>
            <span className="text-sm font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
              Resume
              <span className="text-sky-500 dark:text-sky-400">Builder</span>
            </span>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f2044] text-white md:hidden">
            <FileText size={14} />
          </span>
        </div>

        {/* Left controls */}
        <div className="flex items-center gap-1">
          <IconButton tooltip="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo} size="sm">
            <Undo2 size={15} />
          </IconButton>
          <IconButton tooltip="Redo (Ctrl+Y)" onClick={redo} disabled={!canRedo} size="sm">
            <Redo2 size={15} />
          </IconButton>
          {saveStatus === "saved" && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 ml-1">
              <Check size={11} /> Saved
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          <ThemeCustomizer />

          <IconButton
            tooltip={darkEditor ? "Light editor" : "Dark editor"}
            onClick={toggleDarkEditor}
            size="sm"
            className={clsx(darkEditor && "text-blue-500 bg-blue-50")}
          >
            {darkEditor ? <Sun size={15} /> : <Moon size={15} />}
          </IconButton>

          <IconButton
            tooltip="ATS Keyword Checker"
            onClick={() => setShowATS(true)}
            size="sm"
            className="hidden sm:flex"
          >
            <Zap size={15} />
          </IconButton>

          <IconButton
            tooltip="My Resumes"
            onClick={() => setShowManager(true)}
            size="sm"
            className="hidden sm:flex"
          >
            <FolderOpen size={15} />
          </IconButton>

          {/* Cover Letter — always visible on lg */}
          <IconButton
            tooltip="Cover Letter"
            onClick={() => setShowCoverLetter(true)}
            size="sm"
            className="hidden lg:flex"
          >
            <Mail size={15} />
          </IconButton>

          {/* Interview Prep — always visible on lg */}
          <IconButton
            tooltip="Interview Prep"
            onClick={() => router.push("/interview-prep")}
            size="sm"
            className="hidden lg:flex"
          >
            <MessageSquare size={15} />
          </IconButton>

          {/* Keyboard Shortcuts — always visible on lg */}
          <IconButton
            tooltip="Keyboard Shortcuts"
            onClick={() => setShowShortcuts(true)}
            size="sm"
            className="hidden lg:flex"
          >
            <Keyboard size={15} />
          </IconButton>

          {/* More tools dropdown — only on sm/md, hidden on lg */}
          <div ref={moreMenuRef} className="relative hidden sm:block lg:hidden">
            <IconButton
              tooltip="More tools"
              onClick={() => setShowMoreMenu((v) => !v)}
              size="sm"
              className={clsx(showMoreMenu && "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200")}
            >
              <MoreHorizontal size={15} />
            </IconButton>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1.5 z-50">
                <button
                  onClick={() => { setShowCoverLetter(true); setShowMoreMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Mail size={14} className="text-sky-500 shrink-0" />
                  Cover Letter
                </button>
                <button
                  onClick={() => { router.push("/interview-prep"); setShowMoreMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <MessageSquare size={14} className="text-purple-500 shrink-0" />
                  Interview Prep
                </button>
                <button
                  onClick={() => { setShowShortcuts(true); setShowMoreMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Keyboard size={14} className="text-gray-400 shrink-0" />
                  Keyboard Shortcuts
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={loadSampleData}
            className="hidden md:inline-flex"
          >
            <Sparkles size={13} /> Sample
          </Button>

          <Button
            variant={confirmClear ? "danger" : "ghost"}
            size="sm"
            onClick={handleClear}
            className="hidden md:inline-flex"
          >
            <Trash2 size={13} />
            <span>{confirmClear ? "Confirm?" : "Clear"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            title={session ? "Save to cloud" : "Sign in to save"}
            className="hidden sm:inline-flex"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span className="hidden md:block">
              {saving ? "Saving…" : "Save"}
            </span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => exportPDF(filename)}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            <span className="hidden sm:block">
              {exporting ? "Exporting…" : "Download PDF"}
            </span>
          </Button>
        </div>
      </header>

      {showATS && <ATSChecker onClose={() => setShowATS(false)} />}
      {showManager && <ResumeManager onClose={() => setShowManager(false)} />}
      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
      {showCoverLetter && (
        <QuickCoverLetterModal onClose={() => setShowCoverLetter(false)} />
      )}
      {showSignInModal && (
        <AuthToSaveModal
          onClose={() => setShowSignInModal(false)}
          onSuccess={async () => {
            const newId = await saveToCloud();
            if (newId) onNewResumeId?.(newId);
            setShowSignInModal(false);
          }}
        />
      )}
    </>
  );
}
