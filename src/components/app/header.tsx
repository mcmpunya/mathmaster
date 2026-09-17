"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Languages, Calculator, LogIn, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./auth-provider";
import { toast } from "sonner";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const { user, demoMode, isSignedIn, signInWithGoogle, signOut, loading } = useAuth();

  async function handleSignIn() {
    try {
      await signInWithGoogle();
      toast.success(locale === "ms" ? "Berjaya log masuk" : "Signed in successfully");
    } catch {
      toast.error(locale === "ms" ? "Log masuk gagal" : "Sign in failed");
    }
  }

  async function handleSignOut() {
    await signOut();
    toast.success(locale === "ms" ? "Berjaya log keluar" : "Signed out");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 sm:h-16">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground shadow-sm sm:h-10 sm:w-10">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight sm:text-base">
              {t("app.title")}
            </div>
            <div className="hidden text-[0.65rem] text-muted-foreground sm:block">
              {locale === "ms" ? "Matematik SPM Interaktif" : "Interactive SPM Math"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 px-2 sm:gap-2 sm:px-3">
                <Languages className="h-4 w-4" />
                <span className="text-xs">{locale.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocale("en")}>🇬🇧 English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("ms")}>🇲🇾 Bahasa Malaysia</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="relative px-2 sm:px-3"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : isSignedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus-ring flex items-center rounded-full border border-border p-0.5 hover:bg-muted/50">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {(user.displayName ?? user.email ?? "S").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">
                  <div className="truncate font-medium">{user.displayName ?? "Student"}</div>
                  <div className="truncate text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
                  <LogOut className="h-3.5 w-3.5" />
                  {locale === "ms" ? "Log Keluar" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : demoMode ? (
            <Badge variant="outline" className="gap-1 border-amber-500/50 px-1.5 text-amber-700 dark:text-amber-400">
              <UserRound className="h-3 w-3" />
              <span className="hidden text-xs sm:inline">
                {locale === "ms" ? "Tetamu" : "Guest"}
              </span>
            </Badge>
          ) : (
            <Button size="sm" onClick={handleSignIn} className="gap-1.5 px-2 sm:gap-2 sm:px-3">
              <LogIn className="h-3.5 w-3.5" />
              <span className="text-xs">
                {locale === "ms" ? "Log Masuk" : "Sign in"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
