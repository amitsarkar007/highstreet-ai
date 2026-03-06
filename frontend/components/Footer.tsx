import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/60 mt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
            <Zap className="h-4 w-4 text-brand-500" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Highstreet AI
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Unlocking the power of AI for every business
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span>Powered by Z.AI GLM-4-Plus</span>
            <span>·</span>
            <span>UK AI Agent Hack EP4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
