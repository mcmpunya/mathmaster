"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { useMounted } from "@/hooks/use-mounted";

export type Locale = "en" | "ms";

type Dict = Record<string, { en: string; ms: string }>;

const dict: Dict = {
  // App brand
  "app.title": { en: "LedgerLearn", ms: "LedgerLearn" },
  "app.subtitle": {
    en: "Interactive Double-Entry Accounting for University Students",
    ms: "Pembelajaran Akaun Sistem Catatan Berganda untuk Pelajar Universiti",
  },
  "app.tagline": {
    en: "Master debits, credits, journals and financial statements — in Bahasa Malaysia and English.",
    ms: "Kuasai debit, kredit, jurnal dan penyata kewangan — dalam Bahasa Malaysia dan Inggeris.",
  },

  // Nav
  "nav.dashboard": { en: "Dashboard", ms: "Papan Pemuka" },
  "nav.lessons": { en: "Lessons", ms: "Pelajaran" },
  "nav.practice": { en: "Practice Lab", ms: "Makmal Latihan" },
  "nav.quiz": { en: "Quiz", ms: "Kuiz" },
  "nav.progress": { en: "Progress", ms: "Kemajuan" },

  // Hero / dashboard
  "hero.welcome": { en: "Welcome to", ms: "Selamat Datang ke" },
  "hero.continue": { en: "Continue Learning", ms: "Teruskan Pembelajaran" },
  "hero.start": { en: "Start Learning", ms: "Mula Belajar" },
  "hero.stat.lessons": { en: "Lessons", ms: "Pelajaran" },
  "hero.stat.quizzes": { en: "Quiz Questions", ms: "Soalan Kuiz" },
  "hero.stat.avg": { en: "Average Score", ms: "Skor Purata" },
  "hero.stat.streak": { en: "Day Streak", ms: "Hari Berturut" },

  // Dashboard cards
  "dash.yourProgress": { en: "Your Learning Progress", ms: "Kemajuan Pembelajaran Anda" },
  "dash.overall": { en: "Overall Completion", ms: "Penyiapan Keseluruhan" },
  "dash.recentActivity": { en: "Recent Activity", ms: "Aktiviti Terkini" },
  "dash.recommendedNext": { en: "Recommended Next", ms: "Cadangan Seterusnya" },
  "dash.skillMastery": { en: "Skill Mastery", ms: "Penguasaan Kemahiran" },
  "dash.noActivity": { en: "No activity yet. Start a lesson!", ms: "Tiada aktiviti lagi. Mulakan pelajaran!" },
  "dash.lessonsCompleted": { en: "lessons completed", ms: "pelajaran diselesaikan" },
  "dash.quizzesTaken": { en: "quizzes taken", ms: "kuiz dijawab" },

  // Lessons page
  "lessons.title": { en: "Learning Modules", ms: "Modul Pembelajaran" },
  "lessons.subtitle": {
    en: "Six structured modules take you from the accounting equation to financial statements.",
    ms: "En modul berstruktur membawa anda dari persamaan perakaunan ke penyata kewangan.",
  },
  "lessons.start": { en: "Start", ms: "Mula" },
  "lessons.continue": { en: "Continue", ms: "Teruskan" },
  "lessons.review": { en: "Review", ms: "Ulangkaji" },
  "lessons.completed": { en: "Completed", ms: "Selesai" },
  "lessons.min": { en: "min", ms: "min" },
  "lessons.beginner": { en: "Beginner", ms: "Pemula" },
  "lessons.intermediate": { en: "Intermediate", ms: "Pertengahan" },
  "lessons.advanced": { en: "Advanced", ms: "Lanjutan" },

  // Lesson view
  "lesson.sections": { en: "Sections", ms: "Bahagian" },
  "lesson.next": { en: "Next", ms: "Seterusnya" },
  "lesson.prev": { en: "Previous", ms: "Sebelumnya" },
  "lesson.markComplete": { en: "Mark as Complete", ms: "Tanda Selesai" },
  "lesson.takeQuiz": { en: "Take Lesson Quiz", ms: "Ambil Kuiz Pelajaran" },
  "lesson.complete": { en: "Lesson Complete!", ms: "Pelajaran Selesai!" },
  "lesson.tryInteractivity": { en: "Try it yourself", ms: "Cuba sendiri" },
  "lesson.example": { en: "Worked Example", ms: "Contoh Penyelesaian" },
  "lesson.tip": { en: "Pro Tip", ms: "Petua Pro" },
  "lesson.keyIdea": { en: "Key Idea", ms: "Idea Utama" },

  // Practice lab
  "practice.title": { en: "Journal Entry Practice Lab", ms: "Makmal Latihan Entri Jurnal" },
  "practice.subtitle": {
    en: "Build journal entries and see live T-account updates. The system checks if your entries balance.",
    ms: "Bina entri jurnal dan lihat kemas kini akaun-T secara langsung. Sistem menyemak sama ada entri anda seimbang.",
  },
  "practice.scenario": { en: "Scenario", ms: "Senario" },
  "practice.scenarios": { en: "Scenarios", ms: "Senario" },
  "practice.addEntry": { en: "Add Entry", ms: "Tambah Entri" },
  "practice.account": { en: "Account", ms: "Akaun" },
  "practice.debit": { en: "Debit (RM)", ms: "Debit (RM)" },
  "practice.credit": { en: "Credit (RM)", ms: "Kredit (RM)" },
  "practice.description": { en: "Description", ms: "Penerangan" },
  "practice.tAccounts": { en: "Live T-Accounts", ms: "Akaun-T Langsung" },
  "practice.balance": { en: "Balance Check", ms: "Semakan Imbangan" },
  "practice.balanced": { en: "Balanced — Total debits equal total credits.", ms: "Seimbang — Jumlah debit sama dengan jumlah kredit." },
  "practice.unbalanced": { en: "Not balanced — debits and credits differ.", ms: "Tidak seimbang — debit dan kredit berbeza." },
  "practice.totalDebits": { en: "Total Debits", ms: "Jumlah Debit" },
  "practice.totalCredits": { en: "Total Credits", ms: "Jumlah Kredit" },
  "practice.reset": { en: "Reset", ms: "Set Semula" },
  "practice.showSolution": { en: "Show Solution", ms: "Tunjuk Penyelesaian" },
  "practice.hideSolution": { en: "Hide Solution", ms: "Sembunyi Penyelesaian" },
  "practice.saveAttempt": { en: "Save Attempt", ms: "Simpan Percubaan" },
  "practice.saved": { en: "Attempt saved!", ms: "Percubaan disimpan!" },
  "practice.emptyTAccounts": { en: "Add journal entries to see T-accounts here.", ms: "Tambah entri jurnal untuk melihat akaun-T di sini." },

  // Quiz
  "quiz.title": { en: "Test Your Knowledge", ms: "Uji Pengetahuan Anda" },
  "quiz.subtitle": {
    en: "Mixed quiz drawn from all modules. Get instant feedback with explanations.",
    ms: "Kuiz campuran daripada semua modul. Dapatkan maklum balas serta-merta dengan penjelasan.",
  },
  "quiz.start": { en: "Start Quiz", ms: "Mula Kuiz" },
  "quiz.question": { en: "Question", ms: "Soalan" },
  "quiz.of": { en: "of", ms: "daripada" },
  "quiz.submit": { en: "Submit Answer", ms: "Hantar Jawapan" },
  "quiz.next": { en: "Next Question", ms: "Soalan Seterusnya" },
  "quiz.finish": { en: "Finish Quiz", ms: "Tamat Kuiz" },
  "quiz.result": { en: "Quiz Results", ms: "Keputusan Kuiz" },
  "quiz.score": { en: "Your Score", ms: "Skor Anda" },
  "quiz.correct": { en: "Correct!", ms: "Betul!" },
  "quiz.incorrect": { en: "Not quite.", ms: "Tidak tepat." },
  "quiz.explanation": { en: "Explanation", ms: "Penjelasan" },
  "quiz.correctAnswer": { en: "Correct answer", ms: "Jawapan betul" },
  "quiz.yourAnswer": { en: "Your answer", ms: "Jawapan anda" },
  "quiz.tryAgain": { en: "Try Again", ms: "Cuba Semula" },
  "quiz.excellent": { en: "Excellent work!", ms: "Kerja cemerlang!" },
  "quiz.good": { en: "Good job — keep practicing!", ms: "Kerja baik — teruskan berlatih!" },
  "quiz.keepGoing": { en: "Keep going — review the lessons and try again.", ms: "Teruskan usaha — ulangkaji pelajaran dan cuba lagi." },
  "quiz.reviewLesson": { en: "Review Lesson", ms: "Ulangkaji Pelajaran" },
  "quiz.duration": { en: "Time", ms: "Masa" },
  "quiz.points": { en: "points", ms: "mata" },

  // Progress page
  "progress.title": { en: "Your Learning Journey", ms: "Perjalanan Pembelajaran Anda" },
  "progress.subtitle": {
    en: "Track your mastery across all six modules and quiz performance over time.",
    ms: "Jejak penguasaan anda merentas enam modul dan prestasi kuiz dari semasa ke semasa.",
  },
  "progress.byModule": { en: "Progress by Module", ms: "Kemajuan mengikut Modul" },
  "progress.scoreTrend": { en: "Quiz Score Trend", ms: "Trend Skor Kuiz" },
  "progress.attemptsByDifficulty": { en: "Attempts by Difficulty", ms: "Percubaan mengikut Tahap" },
  "progress.noData": { en: "Take some quizzes to see your analytics.", ms: "Jawab beberapa kuiz untuk melihat analitik anda." },
  "progress.totalPoints": { en: "Total Points", ms: "Jumlah Mata" },
  "progress.accuracy": { en: "Accuracy", ms: "Ketepatan" },

  // Common
  "common.language": { en: "Language", ms: "Bahasa" },
  "common.english": { en: "English", ms: "Inggeris" },
  "common.malay": { en: "Bahasa Malaysia", ms: "Bahasa Malaysia" },
  "common.theme": { en: "Theme", ms: "Tema" },
  "common.light": { en: "Light", ms: "Cerah" },
  "common.dark": { en: "Dark", ms: "Gelap" },
  "common.loading": { en: "Loading...", ms: "Memuatkan..." },
  "common.error": { en: "Something went wrong.", ms: "Sesuatu tidak kena." },
  "common.retry": { en: "Retry", ms: "Cuba Semula" },
  "common.viewAll": { en: "View All", ms: "Lihat Semua" },
  "common.you": { en: "You", ms: "Anda" },
  "common.guest": { en: "Guest Student", ms: "Pelajar Tetamu" },

  // Categories
  "cat.asset": { en: "Asset", ms: "Aset" },
  "cat.liability": { en: "Liability", ms: "Liabiliti" },
  "cat.equity": { en: "Equity", ms: "Ekuiti" },
  "cat.revenue": { en: "Revenue", ms: "Hasil" },
  "cat.expense": { en: "Expense", ms: "Perbelanjaan" },
  "cat.assets": { en: "Assets", ms: "Aset" },
  "cat.liabilities": { en: "Liabilities", ms: "Liabiliti" },
  "cat.equities": { en: "Equity", ms: "Ekuiti" },
  "cat.revenues": { en: "Revenue", ms: "Hasil" },
  "cat.expenses": { en: "Expenses", ms: "Perbelanjaan" },

  // Footer
  "footer.tagline": {
    en: "Built for accounting students in Malaysian universities.",
    ms: "Dibina untuk pelajar perakaunan di universiti Malaysia.",
  },
  "footer.disclaimer": {
    en: "Educational use only. Always follow your lecturer's syllabus.",
    ms: "Untuk kegunaan pendidikan sahaja. Sentiasa ikut silibus pensyarah anda.",
  },
};

interface I18nState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

// Internal store — persists to localStorage. We use `skipHydration` so
// the store does NOT auto-rehydrate on the client before React hydrates.
// Rehydration is triggered manually after mount (see `useI18n` below).
const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (l) => set({ locale: l }),
      t: (key) => {
        const entry = dict[key];
        const locale = get().locale;
        if (!entry) return key;
        return entry[locale] ?? entry.en ?? key;
      },
    }),
    {
      name: "ledgerlearn-locale",
      skipHydration: true, // Critical: don't read localStorage during SSR/initial render
    }
  )
);

/**
 * Hydration-safe wrapper around the i18n store.
 *
 * - On the server: returns `locale: "en"` (the default)
 * - On the first client render: also returns `locale: "en"` (matches server → no hydration mismatch)
 * - After mount: triggers rehydration from localStorage and returns the persisted locale
 *
 * This means users who previously selected Malay will see English for one
 * frame, then it flips to Malay. This is the standard trade-off for
 * hydration safety with persisted state.
 */
export function useI18n(): I18nState {
  const mounted = useMounted();
  const store = useI18nStore();

  // Rehydrate from localStorage after mount
  useEffect(() => {
    useI18nStore.persist.rehydrate();
  }, []);

  if (!mounted) {
    // Pre-hydration: return default locale to match server render
    return {
      locale: "en",
      setLocale: store.setLocale,
      t: (key: string) => {
        const entry = dict[key];
        if (!entry) return key;
        return entry.en ?? key;
      },
    };
  }

  return store;
}

// Server-safe dictionary accessor (for non-component use)
export function translate(key: string, locale: Locale): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en ?? key;
}

export function pickLocale<T>(locale: Locale, en: T, ms: T): T {
  return locale === "ms" ? ms : en;
}
