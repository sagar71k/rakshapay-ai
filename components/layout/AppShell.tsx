"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  History,
  LayoutDashboard,
  Link2,
  Menu,
  MessageSquareWarning,
  Phone,
  Settings,
  Shield,
  Wallet,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Scam Analyzer", icon: MessageSquareWarning },
  { href: "/analyze/url", label: "URL Analyzer", icon: Link2 },
  { href: "/analyze/transcript", label: "Call Transcript", icon: Phone },
  { href: "/payment", label: "Simulated UPI", icon: Wallet },
  { href: "/history", label: "Threat History", icon: History },
  { href: "/scenarios", label: "Demo Scenarios", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cyan-400 focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#070b14]/90 lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-4 py-5">
            <Brand />
            <Nav pathname={pathname} onNavigate={() => setOpen(false)} />
            <p className="mt-auto px-2 text-[11px] leading-4 text-slate-500">
              GRAVITON 2026 · Simulated protection layer. No real UPI.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#05070b]/80 px-4 py-3 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-white/10 p-2 lg:hidden"
                aria-label="Open navigation"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="lg:hidden">
                <Brand compact />
              </div>
              <div className="hidden items-center gap-2 lg:flex">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-xs tracking-[0.18em] text-slate-400">PROTECTION STATUS</span>
                <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">ACTIVE</Badge>
              </div>
            </div>
            <Badge>DEMO MODE</Badge>
          </header>

          <main id="main" className="flex-1 px-4 py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-[#070b14] p-4">
            <div className="mb-4 flex items-center justify-between">
              <Brand />
              <button type="button" className="p-2" aria-label="Close" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <Nav pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="mb-6 flex items-center gap-2 px-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
        <Shield className="h-4 w-4 text-cyan-300" />
      </span>
      {!compact ? (
        <span>
          <span className="block text-sm font-semibold tracking-wide">RakshaPay AI</span>
          <span className="block text-[11px] text-slate-500">Detect the scam before the payment.</span>
        </span>
      ) : (
        <span className="text-sm font-semibold">RakshaPay AI</span>
      )}
    </Link>
  );
}

function Nav({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Primary">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5",
              active && "bg-cyan-400/10 text-cyan-100",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
