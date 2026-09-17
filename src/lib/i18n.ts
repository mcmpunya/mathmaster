"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { useMounted } from "@/hooks/use-mounted";

export type Locale = "en" | "ms";

type Dict = Record<string, { en: string; ms: string }>;

const dict: Dict = {
  "app.title": { en: "SPM Math Master", ms: "Matematik SPM Interaktif" },
  "app.subtitle": {
    en: "Interactive SPM Mathematics for Form 4 & 5 students",
    ms: "Matematik SPM Interaktif untuk pelajar Tingkatan 4 & 5",
  },
  "app.tagline": {
    en: "Master Matematik and Matematik Tambahan — bilingual, interactive, exam-ready.",
    ms: "Kuasai Matematik dan Matematik Tambahan — dwibahasa, interaktif, sedia exam.",
  },

  "nav.home": { en: "Home", ms: "Laman Utama" },
  "nav.subjects": { en: "Topics", ms: "Topik" },
  "nav.solver": { en: "Solver", ms: "Penyelesai" },
  "nav.graph": { en: "Graph", ms: "Graf" },
  "nav.formulas": { en: "Formulas", ms: "Formula" },
  "nav.spm": { en: "SPM Papers", ms: "Kertas SPM" },
  "nav.quiz": { en: "Quiz", ms: "Kuiz" },
  "nav.progress": { en: "Progress", ms: "Kemajuan" },

  "home.welcome": { en: "Welcome to", ms: "Selamat Datang ke" },
  "home.start": { en: "Start Learning", ms: "Mula Belajar" },
  "home.continue": { en: "Continue Learning", ms: "Teruskan Pembelajaran" },
  "home.stat.subjects": { en: "Subjects", ms: "Mata Pelajaran" },
  "home.stat.topics": { en: "Topics", ms: "Topik" },
  "home.stat.quizzes": { en: "Quiz Questions", ms: "Soalan Kuiz" },
  "home.stat.formulas": { en: "Formulas", ms: "Formula" },
  "home.stat.accuracy": { en: "Your Accuracy", ms: "Ketepatan Anda" },
  "home.stat.attempts": { en: "Quiz Attempts", ms: "Percubaan Kuiz" },
  "home.pickSubject": { en: "Pick a Subject", ms: "Pilih Mata Pelajaran" },
  "home.recentActivity": { en: "Recent Activity", ms: "Aktiviti Terkini" },
  "home.noActivity": { en: "No activity yet. Start a topic!", ms: "Tiada aktiviti lagi. Mulakan topik!" },

  "subject.topics": { en: "Topics", ms: "Topik" },
  "subject.lessons": { en: "lessons", ms: "pelajaran" },
  "subject.quizzes": { en: "quizzes", ms: "kuiz" },
  "subject.formulas": { en: "formulas", ms: "formula" },
  "subject.spm": { en: "SPM questions", ms: "Soalan SPM" },
  "subject.start": { en: "Start", ms: "Mula" },
  "subject.continue": { en: "Continue", ms: "Teruskan" },
  "subject.review": { en: "Review", ms: "Ulangkaji" },
  "subject.completed": { en: "Completed", ms: "Selesai" },
  "subject.min": { en: "min", ms: "min" },
  "subject.form": { en: "Form", ms: "Tingkatan" },
  "subject.beginner": { en: "Beginner", ms: "Pemula" },
  "subject.intermediate": { en: "Intermediate", ms: "Pertengahan" },
  "subject.advanced": { en: "Advanced", ms: "Lanjutan" },
  "subject.allTopics": { en: "All Topics", ms: "Semua Topik" },

  "lesson.next": { en: "Next", ms: "Seterusnya" },
  "lesson.prev": { en: "Previous", ms: "Sebelumnya" },
  "lesson.markComplete": { en: "Mark as Complete", ms: "Tanda Selesai" },
  "lesson.takeQuiz": { en: "Take Quiz", ms: "Ambil Kuiz" },
  "lesson.complete": { en: "Lesson Complete!", ms: "Pelajaran Selesai!" },
  "lesson.back": { en: "Back to Topics", ms: "Kembali ke Topik" },
  "lesson.intro": { en: "Introduction", ms: "Pengenalan" },
  "lesson.concept": { en: "Concept", ms: "Konsep" },
  "lesson.example": { en: "Worked Example", ms: "Contoh Penyelesaian" },
  "lesson.tip": { en: "Pro Tip", ms: "Petua Pro" },

  "solver.title": { en: "Equation Solver", ms: "Penyelesai Persamaan" },
  "solver.subtitle": {
    en: "Enter a quadratic equation and get step-by-step working in SPM format.",
    ms: "Masukkan persamaan kuadratik dan dapatkan jalan kerja langkah demi langkah dalam format SPM.",
  },
  "solver.coefficientA": { en: "Coefficient a", ms: "Pekali a" },
  "solver.coefficientB": { en: "Coefficient b", ms: "Pekali b" },
  "solver.coefficientC": { en: "Coefficient c", ms: "Pekali c" },
  "solver.solve": { en: "Solve", ms: "Selesaikan" },
  "solver.solution": { en: "Solution", ms: "Penyelesaian" },
  "solver.steps": { en: "Working", ms: "Jalan Kerja" },
  "solver.equation": { en: "Equation", ms: "Persamaan" },
  "solver.discriminant": { en: "Discriminant", ms: "Diskriminan" },
  "solver.nature": { en: "Nature of Roots", ms: "Sifat Punca" },
  "solver.twoReal": { en: "Two distinct real roots", ms: "Dua punca nyata berbeza" },
  "solver.oneReal": { en: "One repeated root", ms: "Satu punca berulang" },
  "solver.noReal": { en: "No real roots", ms: "Tiada punca nyata" },
  "solver.root1": { en: "Root 1 (x₁)", ms: "Punca 1 (x₁)" },
  "solver.root2": { en: "Root 2 (x₂)", ms: "Punca 2 (x₂)" },
  "solver.tryExample": { en: "Try an example", ms: "Cuba contoh" },

  "graph.title": { en: "Graph Plotter", ms: "Pelan Graf" },
  "graph.subtitle": {
    en: "Visualize lines and parabolas. Adjust coefficients and see the curve update live.",
    ms: "Visualisasikan garis dan parabola. Laraskan pekali dan lihat lengkung dikemas kini secara langsung.",
  },
  "graph.type": { en: "Function type", ms: "Jenis fungsi" },
  "graph.linear": { en: "Linear: y = mx + c", ms: "Linear: y = mx + c" },
  "graph.quadratic": { en: "Quadratic: y = ax² + bx + c", ms: "Kuadratik: y = ax² + bx + c" },
  "graph.gradient": { en: "Gradient (m)", ms: "Kecerunan (m)" },
  "graph.intercept": { en: "y-intercept (c)", ms: "Pintasan-y (c)" },
  "graph.coefficientA": { en: "Coefficient a", ms: "Pekali a" },
  "graph.coefficientB": { en: "Coefficient b", ms: "Pekali b" },
  "graph.coefficientC": { en: "Coefficient c", ms: "Pekali c" },
  "graph.xIntercepts": { en: "x-intercepts", ms: "Pintasan-x" },
  "graph.vertex": { en: "Vertex", ms: "Puncak" },
  "graph.yIntercept": { en: "y-intercept", ms: "Pintasan-y" },
  "graph.none": { en: "None (no real roots)", ms: "Tiada (tiada punca nyata)" },

  "formulas.title": { en: "Formula Sheet", ms: "Helaian Formula" },
  "formulas.subtitle": {
    en: "Searchable bilingual reference with examples.",
    ms: "Rujukan dwibahasa boleh cari dengan contoh.",
  },
  "formulas.search": { en: "Search formulas...", ms: "Cari formula..." },
  "formulas.all": { en: "All", ms: "Semua" },
  "formulas.example": { en: "Example", ms: "Contoh" },
  "formulas.noResults": { en: "No formulas found.", ms: "Tiada formula dijumpai." },
  "formulas.form": { en: "Form", ms: "Tingkatan" },

  "spm.title": { en: "SPM Past Year Questions", ms: "Soalan SPM Tahun Lepas" },
  "spm.subtitle": {
    en: "Real SPM questions with marking schemes and step-by-step working.",
    ms: "Soalan SPM sebenar dengan skema pemarkahan dan jalan kerja langkah demi langkah.",
  },
  "spm.year": { en: "Year", ms: "Tahun" },
  "spm.paper": { en: "Paper", ms: "Kertas" },
  "spm.question": { en: "Question", ms: "Soalan" },
  "spm.marks": { en: "Marks", ms: "Markah" },
  "spm.answer": { en: "Answer", ms: "Jawapan" },
  "spm.working": { en: "Working", ms: "Jalan Kerja" },
  "spm.showWorking": { en: "Show Working", ms: "Tunjuk Jalan Kerja" },
  "spm.hideWorking": { en: "Hide Working", ms: "Sembunyi Jalan Kerja" },
  "spm.selectTopic": { en: "Select a topic to view SPM questions", ms: "Pilih topik untuk lihat soalan SPM" },

  "quiz.title": { en: "Test Yourself", ms: "Uji Diri Anda" },
  "quiz.subtitle": {
    en: "Mixed quiz from all topics. Instant feedback with explanations.",
    ms: "Kuiz campuran dari semua topik. Maklum balas serta-merta dengan penjelasan.",
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
  "quiz.tryAgain": { en: "Try Again", ms: "Cuba Semula" },
  "quiz.excellent": { en: "Excellent work!", ms: "Kerja cemerlang!" },
  "quiz.good": { en: "Good job — keep practicing!", ms: "Kerja baik — teruskan berlatih!" },
  "quiz.keepGoing": { en: "Keep going — review the lessons and try again.", ms: "Teruskan usaha — ulangkaji pelajaran dan cuba lagi." },
  "quiz.points": { en: "points", ms: "mata" },
  "quiz.enterAnswer": { en: "Enter your answer", ms: "Masukkan jawapan anda" },

  "progress.title": { en: "Your Learning Journey", ms: "Perjalanan Pembelajaran Anda" },
  "progress.subtitle": {
    en: "Track your mastery across topics, subjects, and difficulty levels.",
    ms: "Jejak penguasaan anda merentas topik, mata pelajaran, dan tahap kesukaran.",
  },
  "progress.byTopic": { en: "Progress by Topic", ms: "Kemajuan mengikut Topik" },
  "progress.bySubject": { en: "Accuracy by Subject", ms: "Ketepatan mengikut Mata Pelajaran" },
  "progress.scoreTrend": { en: "Score Trend", ms: "Trend Skor" },
  "progress.byDifficulty": { en: "Attempts by Difficulty", ms: "Percubaan mengikut Tahap" },
  "progress.noData": { en: "Take some quizzes to see your analytics.", ms: "Jawab beberapa kuiz untuk lihat analitik." },
  "progress.totalPoints": { en: "Total Points", ms: "Jumlah Mata" },
  "progress.accuracy": { en: "Accuracy", ms: "Ketepatan" },
  "progress.attempts": { en: "attempts", ms: "percubaan" },

  "common.language": { en: "Language", ms: "Bahasa" },
  "common.theme": { en: "Theme", ms: "Tema" },
  "common.loading": { en: "Loading...", ms: "Memuatkan..." },
  "common.error": { en: "Something went wrong.", ms: "Sesuatu tidak kena." },
  "common.guest": { en: "Guest Student", ms: "Pelajar Tetamu" },
  "common.form4": { en: "Form 4", ms: "Tingkatan 4" },
  "common.form5": { en: "Form 5", ms: "Tingkatan 5" },

  "footer.tagline": {
    en: "Built for SPM students in Malaysian schools.",
    ms: "Dibina untuk pelajar SPM di sekolah Malaysia.",
  },
  "footer.disclaimer": {
    en: "Educational use only. Always follow your teacher's syllabus.",
    ms: "Untuk kegunaan pendidikan sahaja. Sentiasa ikut silibus guru anda.",
  },
};

interface I18nState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

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
    { name: "spm-math-locale", skipHydration: true }
  )
);

export function useI18n(): I18nState {
  const mounted = useMounted();
  const store = useI18nStore();

  useEffect(() => {
    useI18nStore.persist.rehydrate();
  }, []);

  if (!mounted) {
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

export function translate(key: string, locale: Locale): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en ?? key;
}
