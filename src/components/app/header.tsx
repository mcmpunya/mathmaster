"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Languages, BookOpenCheck, LogIn, LogOut, UserRound } from "lucide-react";
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
    } catch (e) {
      toast.error(locale === "ms" ? "Log masuk gagal" : "Sign in failed");
    }
  }

  async function handleSignOut() {
    await signOut();
    toast.success(locale === "ms" ? "Berjaya log keluar" : "Signed out");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-700 text-primary-foreground shadow-sm">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">
              {t("app.title")}
            </div>
            <div className="text-[0.7rem] text-muted-foreground hidden sm:block">
              {locale === "ms"
                ? "Pembelajaran Akaun Interaktif"
                : "Interactive Accounting Learning"}
            </div>
          </div>
          <Badge variant="secondary" className="ml-2 hidden md:inline-flex">
            v1.2
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === "ms" ? "Bahasa" : "Language"}
                </span>
                <span className="sm:hidden">{locale.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocale("en")}>
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("ms")}>
                🇲🇾 Bahasa Malaysia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme */}
          <Button
            variant="outline"
            size="sm"
            className="relative gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="hidden sm:inline">{t("common.theme")}</span>
          </Button>

          {/* Auth */}
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : isSignedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus-ring flex items-center gap-2 rounded-full border border-border pl-1 pr-2 py-1 hover:bg-muted/50">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {(user.displayName ?? user.email ?? "S")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-xs font-medium sm:inline max-w-[120px] truncate">
                    {user.displayName ?? user.email}
                  </span>
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
            <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-700 dark:text-amber-400">
              <UserRound className="h-3 w-3" />
              <span className="hidden sm:inline">
                {locale === "ms" ? "Tetamu Demo" : "Demo Guest"}
              </span>
            </Badge>
          ) : (
            <Button size="sm" onClick={handleSignIn} className="gap-2">
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {locale === "ms" ? "Log Masuk" : "Sign in"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
