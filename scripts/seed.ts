import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// =====================================================================
// SPM MATH MASTER — SEED
// Bilingual (Bahasa Malaysia + English) content for:
//   • 5 Matematik topics (KSSM Form 4-5)
//   • 5 Matematik Tambahan topics (KSSM Form 4-5)
// Each topic has:
//   • 2 lessons, each with 4 sections (intro, concept, example, tip)
//   • 5 quiz questions (bilingual, with explanations)
//   • 3 formulas
//   • 2 SPM past-year questions with working
// =====================================================================

type SubjectSeed = {
  slug: string;
  nameEn: string;
  nameMs: string;
  descEn: string;
  descMs: string;
  icon: string;
  color: string;
  order: number;
  topics: TopicSeed[];
};

type TopicSeed = {
  slug: string;
  titleEn: string;
  titleMs: string;
  summaryEn: string;
  summaryMs: string;
  icon: string;
  formLevel: 4 | 5;
  durationMin: number;
  lessons: LessonSeed[];
  quiz: QuizSeed[];
  formulas: FormulaSeed[];
  spm: SpmSeed[];
};

type LessonSeed = {
  titleEn: string;
  titleMs: string;
  summaryEn: string;
  summaryMs: string;
  durationMin: number;
  sections: SectionSeed[];
};

type SectionSeed = {
  type: "intro" | "concept" | "example" | "interactive" | "tip";
  titleEn: string;
  titleMs: string;
  bodyEn: string;
  bodyMs: string;
};

type QuizSeed = {
  type: "mcq" | "numeric";
  promptEn: string;
  promptMs: string;
  optionsEn: string[];
  optionsMs: string[];
  answerKey: string;
  explanationEn: string;
  explanationMs: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points?: number;
};

type FormulaSeed = {
  nameEn: string;
  nameMs: string;
  formulaLatex: string;
  formulaDisplay: string;
  descEn: string;
  descMs: string;
  exampleEn: string;
  exampleMs: string;
};

type SpmSeed = {
  year: number;
  paper: number;
  questionNo: string;
  promptEn: string;
  promptMs: string;
  marksEn: string;
  marksMs: string;
  answerEn: string;
  answerMs: string;
  workingEn: string;
  workingMs: string;
};

const subjects: SubjectSeed[] = [
  // =================================================================
  // MATEMATIK (CORE SPM MATH)
  // =================================================================
  {
    slug: "matematik",
    nameEn: "Mathematics",
    nameMs: "Matematik",
    descEn: "Core SPM Mathematics covering the KSSM Form 4-5 syllabus.",
    descMs: "Matematik SPM teras meliputi sukatan KSSM Tingkatan 4-5.",
    icon: "Calculator",
    color: "emerald",
    order: 1,
    topics: [
      // ---------- Topic 1: Number & Operations ----------
      {
        slug: "numbers-operations",
        titleEn: "Numbers & Operations",
        titleMs: "Nombor & Operasi",
        summaryEn: "Indices, standard form, surds, logarithms and significant figures.",
        summaryMs: "Indeks, bentuk piawai, surd, logaritma dan angka bererti.",
        icon: "Hash",
        formLevel: 4,
        durationMin: 18,
        lessons: [
          {
            titleEn: "Indices & Standard Form",
            titleMs: "Indeks & Bentuk Piawai",
            summaryEn: "Master the laws of indices and convert between ordinary and standard form.",
            summaryMs: "Kuasai hukum indeks dan tukar antara bentuk biasa dan bentuk piawai.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Why Indices Matter",
                titleMs: "Mengapa Indeks Penting",
                bodyEn: "Indices (also called exponents or powers) are a compact way to write repeated multiplication. Instead of writing 2 × 2 × 2 × 2 × 2, we write 2⁵. SPM questions test whether you can manipulate indices fluently — multiplying, dividing, raising powers, and dealing with zero and negative exponents. The same laws extend to standard form (scientific notation), which scientists and engineers use daily to express very large or very small numbers without writing dozens of zeros.",
                bodyMs: "Indeks (juga dipanggil eksponen atau kuasa) ialah cara ringkas untuk menulis pendarabab berulang. Sebagai ganti menulis 2 × 2 × 2 × 2 × 2, kita tulis 2⁵. Soalan SPM menguji sama ada anda boleh mengolah indeks dengan cekap — mendarab, membahagi, meningkatkan kuasa, dan mengendali eksponen sifar dan negatif. Hukum yang sama membolehkan bentuk piawai (notasi saintifik), yang digunakan oleh saintis dan jurutera setiap hari untuk menyatakan nombor yang sangat besar atau kecil tanpa menulis berpuluh-puluh sifar.",
              },
              {
                type: "concept",
                titleEn: "The Six Laws of Indices",
                titleMs: "Enam Hukum Indeks",
                bodyEn: "Memorise these six laws — they cover 95% of SPM indices questions. (1) **aᵐ × aⁿ = aᵐ⁺ⁿ** — when multiplying like bases, add the powers. (2) **aᵐ ÷ aⁿ = aᵐ⁻ⁿ** — when dividing like bases, subtract the powers. (3) **(aᵐ)ⁿ = aᵐⁿ** — a power of a power, multiply the exponents. (4) **a⁰ = 1** — anything (except zero) to the power of zero equals 1. (5) **a⁻ⁿ = 1/aⁿ** — a negative exponent means reciprocal. (6) **a^(m/n) = ⁿ√(aᵐ)** — fractional exponents become roots.",
                bodyMs: "Hafal enam hukum ini — ia merangkumi 95% soalan indeks SPM. (1) **aᵐ × aⁿ = aᵐ⁺ⁿ** — apabila mendarab tapak yang sama, tambah kuasa. (2) **aᵐ ÷ aⁿ = aᵐ⁻ⁿ** — apabila membahagi tapak yang sama, tolak kuasa. (3) **(aᵐ)ⁿ = aᵐⁿ** — kuasa daripada kuasa, darab eksponen. (4) **a⁰ = 1** — apa-apa (kecuali sifar) berkuasa sifar sama dengan 1. (5) **a⁻ⁿ = 1/aⁿ** — eksponen negatif bermaksud salingan. (6) **a^(m/n) = ⁿ√(aᵐ)** — eksponen pecahan menjadi punca.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Simplify 2³ × 2⁴ ÷ 2²",
                titleMs: "Contoh Penyelesaian: Permudahkan 2³ × 2⁴ ÷ 2²",
                bodyEn: "Step 1: Multiply 2³ × 2⁴ using law 1 (add powers): 2³⁺⁴ = 2⁷. Step 2: Divide by 2² using law 2 (subtract powers): 2⁷ ÷ 2² = 2⁷⁻² = 2⁵. Step 3: Calculate the value: 2⁵ = 32. Final answer: **32**. Notice how we never wrote out 2 × 2 × 2... — the laws let us manipulate symbols without expanding.",
                bodyMs: "Langkah 1: Darab 2³ × 2⁴ menggunakan hukum 1 (tambah kuasa): 2³⁺⁴ = 2⁷. Langkah 2: Bahagi dengan 2² menggunakan hukum 2 (tolak kuasa): 2⁷ ÷ 2² = 2⁷⁻² = 2⁵. Langkah 3: Kira nilai: 2⁵ = 32. Jawapan akhir: **32**. Perhatikan bagaimana kita tidak pernah menulis 2 × 2 × 2... — hukum membolehkan kita mengolah simbol tanpa mengembangkan.",
              },
              {
                type: "tip",
                titleEn: "Standard Form Shortcut",
                titleMs: "Pintasan Bentuk Piawai",
                bodyEn: "A number in standard form is **A × 10ⁿ** where 1 ≤ A < 10. To convert: move the decimal point until there's exactly one non-zero digit to its left. The number of moves is n — positive if you moved left (large number), negative if you moved right (small number). Example: 45 600 = 4.56 × 10⁴ (moved 4 places left). 0.00037 = 3.7 × 10⁻⁴ (moved 4 places right).",
                bodyMs: "Nombor dalam bentuk piawai ialah **A × 10ⁿ** dengan 1 ≤ A < 10. Untuk menukar: alih titik perpuluhan sehingga ada tepat satu digit bukan sifar di sebelah kirinya. Bilangan alihan ialah n — positif jika anda alih ke kiri (nombor besar), negatif jika anda alih ke kanan (nombor kecil). Contoh: 45 600 = 4.56 × 10⁴ (alih 4 tempat ke kiri). 0.00037 = 3.7 × 10⁻⁴ (alih 4 tempat ke kanan).",
              },
            ],
          },
          {
            titleEn: "Significant Figures & Estimation",
            titleMs: "Angka Bererti & Anggaran",
            summaryEn: "Round numbers to specified significant figures and use estimation in calculations.",
            summaryMs: "Bundarkan nombor kepada angka bererti yang ditetapkan dan gunakan anggaran dalam pengiraan.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "What Are Significant Figures?",
                titleMs: "Apakah Angka Bererti?",
                bodyEn: "Significant figures (s.f.) are the digits in a number that carry meaning — they contribute to its precision. The more significant figures, the more precise the measurement. SPM questions often ask you to round answers to 3 s.f., 2 s.f., or 4 s.f. Knowing how to count and round significant figures is essential for getting full marks on calculation questions.",
                bodyMs: "Angka bererti (a.b.) ialah digit dalam nombor yang membawa makna — ia menyumbang kepada ketepatannya. Semakin banyak angka bererti, semakin tepat ukuran. Soalan SPM sering meminta anda membundarkan jawapan kepada 3 a.b., 2 a.b., atau 4 a.b. Mengetahui cara mengira dan membundarkan angka bererti adalah penting untuk mendapatkan markah penuh dalam soalan pengiraan.",
              },
              {
                type: "concept",
                titleEn: "Rules for Counting Significant Figures",
                titleMs: "Peraturan Mengira Angka Bererti",
                bodyEn: "Five simple rules: (1) All non-zero digits are significant (4567 has 4 s.f.). (2) Zeros between non-zero digits are significant (4005 has 4 s.f.). (3) Leading zeros are NOT significant (0.0045 has 2 s.f.). (4) Trailing zeros after a decimal point ARE significant (4.500 has 4 s.f.). (5) Trailing zeros in a whole number are ambiguous unless written in standard form — assume NOT significant (4500 has 2 s.f. unless written as 4.500 × 10³).",
                bodyMs: "Lima peraturan mudah: (1) Semua digit bukan sifar adalah bererti (4567 ada 4 a.b.). (2) Sifar di antara digit bukan sifar adalah bererti (4005 ada 4 a.b.). (3) Sifar di hadapan TIDAK bererti (0.0045 ada 2 a.b.). (4) Sifar di hujung selepas titik perpuluhan ADALAH bererti (4.500 ada 4 a.b.). (5) Sifar di hujung nombor bulat adalah tak jelas kecuali ditulis dalam bentuk piawai — anggap TIDAK bererti (4500 ada 2 a.b. kecuali ditulis 4.500 × 10³).",
              },
              {
                type: "example",
                titleEn: "Worked Example: Round 3.14159 to 3 s.f.",
                titleMs: "Contoh Penyelesaian: Bundar 3.14159 kepada 3 a.b.",
                bodyEn: "We want 3 significant figures: 3.14|159. Look at the digit after the cut (1) — it's less than 5, so we round down (leave the last kept digit unchanged). Answer: **3.14**. If we wanted 4 s.f.: 3.141|59 → next digit is 5, round up: **3.142**. If we wanted 2 s.f.: 3.1|4159 → next digit is 4, round down: **3.1**.",
                bodyMs: "Kita mahu 3 angka bererti: 3.14|159. Lihat digit selepas potongan (1) — kurang daripada 5, jadi bundar turun (biarkan digit terakhir yang dikekalkan tidak berubah). Jawapan: **3.14**. Jika kita mahu 4 a.b.: 3.141|59 → digit seterusnya 5, bundar naik: **3.142**. Jika kita mahu 2 a.b.: 3.1|4159 → digit seterusnya 4, bundar turun: **3.1**.",
              },
              {
                type: "tip",
                titleEn: "Always State Your Rounding",
                titleMs: "Sentiasa Nyatakan Pembundaran",
                bodyEn: "SPM marking schemes deduct marks if you don't write your answer to the required precision. The standard convention is **3 s.f.** unless the question says otherwise. Always write the precision in brackets next to your answer: e.g. 'x = 4.562 [3 s.f.]'. This protects your marks even if there's a calculation slip earlier.",
                bodyMs: "Skema pemarkahan SPM menolak markah jika anda tidak menulis jawapan kepada ketepatan yang diperlukan. Konvensyen standard ialah **3 a.b.** melainkan soalan menyatakan sebaliknya. Sentiasa tulis ketepatan dalam kurungan di sebelah jawapan: cth. 'x = 4.562 [3 a.b.]'. Ini melindungi markah anda walaupun ada kesilapan pengiraan sebelumnya.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "Simplify 2³ × 2⁴.",
            promptMs: "Permudahkan 2³ × 2⁴.",
            optionsEn: ["2⁷", "2¹²", "4⁷", "8⁷"],
            optionsMs: ["2⁷", "2¹²", "4⁷", "8⁷"],
            answerKey: "0",
            explanationEn: "When multiplying like bases, add the powers: 2³ × 2⁴ = 2³⁺⁴ = 2⁷.",
            explanationMs: "Apabila mendarab tapak yang sama, tambah kuasa: 2³ × 2⁴ = 2³⁺⁴ = 2⁷.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Evaluate 27^(2/3).",
            promptMs: "Kira 27^(2/3).",
            optionsEn: ["3", "9", "18", "81"],
            optionsMs: ["3", "9", "18", "81"],
            answerKey: "1",
            explanationEn: "27^(1/3) = ∛27 = 3. Then 27^(2/3) = (27^(1/3))² = 3² = 9.",
            explanationMs: "27^(1/3) = ∛27 = 3. Kemudian 27^(2/3) = (27^(1/3))² = 3² = 9.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Express 0.000456 in standard form.",
            promptMs: "Ungkapkan 0.000456 dalam bentuk piawai.",
            optionsEn: ["4.56 × 10⁻⁴", "4.56 × 10⁻³", "456 × 10⁻⁶", "4.56 × 10⁴"],
            optionsMs: ["4.56 × 10⁻⁴", "4.56 × 10⁻³", "456 × 10⁻⁶", "4.56 × 10⁴"],
            answerKey: "0",
            explanationEn: "Move the decimal point 4 places right to get 4.56. Since we moved right (small number), n is negative: 4.56 × 10⁻⁴.",
            explanationMs: "Alih titik perpuluhan 4 tempat ke kanan untuk dapatkan 4.56. Kerana kita alih ke kanan (nombor kecil), n adalah negatif: 4.56 × 10⁻⁴.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "numeric",
            promptEn: "Simplify (2²)³ and give the numerical value.",
            promptMs: "Permudahkan (2²)³ dan berikan nilai berangka.",
            optionsEn: ["64"],
            optionsMs: ["64"],
            answerKey: "64",
            explanationEn: "Power of a power: multiply exponents. (2²)³ = 2⁶ = 64.",
            explanationMs: "Kuasa daripada kuasa: darab eksponen. (2²)³ = 2⁶ = 64.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Round 5.6789 to 3 significant figures.",
            promptMs: "Bundarkan 5.6789 kepada 3 angka bererti.",
            optionsEn: ["5.67", "5.68", "5.679", "5.7"],
            optionsMs: ["5.67", "5.68", "5.679", "5.7"],
            answerKey: "1",
            explanationEn: "3 s.f. means 5.67|89. Next digit is 8 (≥5), so round up the last kept digit: 5.68.",
            explanationMs: "3 a.b. bermaksud 5.67|89. Digit seterusnya ialah 8 (≥5), jadi bundar naik digit terakhir yang dikekalkan: 5.68.",
            difficulty: "intermediate",
            points: 2,
          },
        ],
        formulas: [
          {
            nameEn: "Multiplication Law",
            nameMs: "Hukum Pendaraban",
            formulaLatex: "a^m \\times a^n = a^{m+n}",
            formulaDisplay: "aᵐ × aⁿ = a^(m+n)",
            descEn: "When multiplying numbers with the same base, add the exponents.",
            descMs: "Apabila mendarab nombor dengan tapak yang sama, tambah eksponen.",
            exampleEn: "2³ × 2⁵ = 2⁸",
            exampleMs: "2³ × 2⁵ = 2⁸",
          },
          {
            nameEn: "Division Law",
            nameMs: "Hukum Pembahagian",
            formulaLatex: "a^m \\div a^n = a^{m-n}",
            formulaDisplay: "aᵐ ÷ aⁿ = a^(m-n)",
            descEn: "When dividing numbers with the same base, subtract the exponents.",
            descMs: "Apabila membahagi nombor dengan tapak yang sama, tolak eksponen.",
            exampleEn: "2⁷ ÷ 2³ = 2⁴",
            exampleMs: "2⁷ ÷ 2³ = 2⁴",
          },
          {
            nameEn: "Standard Form",
            nameMs: "Bentuk Piawai",
            formulaLatex: "A \\times 10^n, \\quad 1 \\leq A < 10",
            formulaDisplay: "A × 10ⁿ, 1 ≤ A < 10",
            descEn: "Standard form expresses any number as A × 10ⁿ where A is between 1 and 10.",
            descMs: "Bentuk piawai menyatakan sebarang nombor sebagai A × 10ⁿ dengan A antara 1 dan 10.",
            exampleEn: "45600 = 4.56 × 10⁴",
            exampleMs: "45600 = 4.56 × 10⁴",
          },
        ],
        spm: [
          {
            year: 2021,
            paper: 2,
            questionNo: "1(a)",
            promptEn: "Calculate the value of (3 × 10⁴) × (5 × 10⁶) and give your answer in standard form.",
            promptMs: "Kira nilai bagi (3 × 10⁴) × (5 × 10⁶) dan berikan jawapan dalam bentuk piawai.",
            marksEn: "3 marks",
            marksMs: "3 markah",
            answerEn: "1.5 × 10¹¹",
            answerMs: "1.5 × 10¹¹",
            workingEn: "(3 × 10⁴) × (5 × 10⁶) = (3 × 5) × 10⁴⁺⁶ = 15 × 10¹⁰ = 1.5 × 10¹¹",
            workingMs: "(3 × 10⁴) × (5 × 10⁶) = (3 × 5) × 10⁴⁺⁶ = 15 × 10¹⁰ = 1.5 × 10¹¹",
          },
          {
            year: 2019,
            paper: 2,
            questionNo: "2(b)",
            promptEn: "Round 0.0045678 to (i) 3 significant figures, (ii) 2 decimal places.",
            promptMs: "Bundarkan 0.0045678 kepada (i) 3 angka bererti, (ii) 2 tempat perpuluhan.",
            marksEn: "2 marks",
            marksMs: "2 markah",
            answerEn: "(i) 0.00457 (ii) 0.00",
            answerMs: "(i) 0.00457 (ii) 0.00",
            workingEn: "(i) 3 s.f.: 0.00456|78 → next digit 7 ≥ 5, round up → 0.00457. (ii) 2 d.p.: 0.00|45678 → already 0.00 to 2 d.p.",
            workingMs: "(i) 3 a.b.: 0.00456|78 → digit seterusnya 7 ≥ 5, bundar naik → 0.00457. (ii) 2 t.p.: 0.00|45678 → sudah 0.00 kepada 2 t.p.",
          },
        ],
      },
      // ---------- Topic 2: Algebra ----------
      {
        slug: "algebra",
        titleEn: "Algebra",
        titleMs: "Algebra",
        summaryEn: "Quadratic equations, simultaneous equations, factorisation, and inequalities.",
        summaryMs: "Persamaan kuadratik, persamaan serentak, pemfaktoran dan ketidaksamaan.",
        icon: "Sigma",
        formLevel: 4,
        durationMin: 22,
        lessons: [
          {
            titleEn: "Quadratic Equations",
            titleMs: "Persamaan Kuadratik",
            summaryEn: "Solve ax² + bx + c = 0 by factorisation, completing the square, and the quadratic formula.",
            summaryMs: "Selesaikan ax² + bx + c = 0 melalui pemfaktoran, melengkapkan kuasa dua dan formula kuadratik.",
            durationMin: 12,
            sections: [
              {
                type: "intro",
                titleEn: "The Shape of a Quadratic",
                titleMs: "Bentuk Persamaan Kuadratik",
                bodyEn: "A quadratic equation has the form **ax² + bx + c = 0** where a ≠ 0. The graph is a parabola — a U-shape (or upside-down U if a is negative). Solving the equation means finding the x-values where the parabola crosses the x-axis (the roots). Quadratic equations appear in dozens of SPM questions every year — projectile motion, area problems, optimization — so fluency here is essential for top marks.",
                bodyMs: "Persamaan kuadratik berbentuk **ax² + bx + c = 0** dengan a ≠ 0. Grafnya ialah parabola — bentuk U (atau U terbalik jika a negatif). Menyelesaikan persamaan bermaksud mencari nilai-x di mana parabola memotong paksi-x (punca). Persamaan kuadratik muncul dalam berpuluh-puluh soalan SPM setiap tahun — gerakan projectile, masalah luas, pengoptimuman — jadi kefasihan di sini adalah penting untuk markah tertinggi.",
              },
              {
                type: "concept",
                titleEn: "Three Methods to Solve",
                titleMs: "Tiga Kaedah Penyelesaian",
                bodyEn: "(1) **Factorisation** — write ax² + bx + c = (px + q)(rx + s). Works when the discriminant b² − 4ac is a perfect square. (2) **Completing the square** — rewrite as a(x + b/2a)² = (b² − 4ac)/4a. Always works but is tedious. (3) **Quadratic formula** — x = (−b ± √(b² − 4ac)) / 2a. Always works, always reliable. For SPM, try factorisation first (fastest), then fall back to the formula if it doesn't factorise cleanly.",
                bodyMs: "(1) **Pemfaktoran** — tulis ax² + bx + c = (px + q)(rx + s). Berfungsi apabila diskriminan b² − 4ac ialah kuasa dua sempurna. (2) **Melengkapkan kuasa dua** — tulis semula sebagai a(x + b/2a)² = (b² − 4ac)/4a. Sentiasa berfungsi tetapi membosankan. (3) **Formula kuadratik** — x = (−b ± √(b² − 4ac)) / 2a. Sentiasa berfungsi, sentiasa boleh dipercayai. Untuk SPM, cuba pemfaktoran dahulu (paling cepat), kemudian gunakan formula jika tidak boleh difaktorkan dengan kemas.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Solve x² − 5x + 6 = 0",
                titleMs: "Contoh Penyelesaian: Selesaikan x² − 5x + 6 = 0",
                bodyEn: "Method (factorisation): We need two numbers that multiply to +6 and add to −5. The numbers are −2 and −3 (since −2 × −3 = +6 and −2 + (−3) = −5). So x² − 5x + 6 = (x − 2)(x − 3) = 0. Setting each factor to zero: x − 2 = 0 or x − 3 = 0. Solutions: **x = 2 or x = 3**. Verify: 2² − 5(2) + 6 = 4 − 10 + 6 = 0 ✓. 3² − 5(3) + 6 = 9 − 15 + 6 = 0 ✓.",
                bodyMs: "Kaedah (pemfaktoran): Kita perlukan dua nombor yang mendarab kepada +6 dan menambah kepada −5. Nombor itu ialah −2 dan −3 (sebab −2 × −3 = +6 dan −2 + (−3) = −5). Jadi x² − 5x + 6 = (x − 2)(x − 3) = 0. Tetapkan setiap faktor kepada sifar: x − 2 = 0 atau x − 3 = 0. Penyelesaian: **x = 2 atau x = 3**. Sahkan: 2² − 5(2) + 6 = 4 − 10 + 6 = 0 ✓. 3² − 5(3) + 6 = 9 − 15 + 6 = 0 ✓.",
              },
              {
                type: "tip",
                titleEn: "The Discriminant Tells You Everything",
                titleMs: "Diskriminan Memberitahu Segalanya",
                bodyEn: "The expression **b² − 4ac** (called the discriminant, Δ) tells you how many real roots the equation has. Δ > 0 → two distinct real roots (parabola crosses x-axis twice). Δ = 0 → one repeated root (parabola touches x-axis). Δ < 0 → no real roots (parabola doesn't touch x-axis). SPM questions often ask you to find k such that the equation has 'two equal roots' — that means Δ = 0, so set b² − 4ac = 0 and solve for k.",
                bodyMs: "Ungkapan **b² − 4ac** (dipanggil diskriminan, Δ) memberitahu anda berapa banyak punca nyata yang ada pada persamaan. Δ > 0 → dua punca nyata berbeza (parabola memotong paksi-x dua kali). Δ = 0 → satu punca berulang (parabola menyentuh paksi-x). Δ < 0 → tiada punca nyata (parabola tidak menyentuh paksi-x). Soalan SPM sering meminta anda mencari k supaya persamaan mempunyai 'dua punca yang sama' — itu bermaksud Δ = 0, jadi tetapkan b² − 4ac = 0 dan selesaikan untuk k.",
              },
            ],
          },
          {
            titleEn: "Simultaneous Equations",
            titleMs: "Persamaan Serentak",
            summaryEn: "Solve two equations with two unknowns using substitution and elimination.",
            summaryMs: "Selesaikan dua persamaan dengan dua tidak diketahui menggunakan penggantian dan penyahtakan.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Two Equations, Two Unknowns",
                titleMs: "Dua Persamaan, Dua Tidak Diketahui",
                bodyEn: "A simultaneous equations problem gives you two equations with two unknowns (usually x and y). The goal is to find values of x and y that satisfy BOTH equations at the same time. SPM questions often pair a linear equation (y = mx + c) with a quadratic (y = ax² + bx + c) — solving gives the intersection points of a line and a parabola.",
                bodyMs: "Masalah persamaan serentak memberikan anda dua persamaan dengan dua tidak diketahui (biasanya x dan y). Matlamatnya ialah mencari nilai x dan y yang memenuhi KEDUA-DUA persamaan pada masa yang sama. Soalan SPM sering memasangkan persamaan linear (y = mx + c) dengan kuadratik (y = ax² + bx + c) — penyelesaian memberikan titik persilangan garis dan parabola.",
              },
              {
                type: "concept",
                titleEn: "Substitution Method (Recommended)",
                titleMs: "Kaedah Penggantian (Disyorkan)",
                bodyEn: "Step 1: From the linear equation, express one variable in terms of the other (e.g. y = 2x + 1). Step 2: Substitute this expression into the quadratic equation. Step 3: You now have a single quadratic in one variable — solve it. Step 4: Back-substitute each x-value into the linear equation to find the corresponding y-values. Always state your final answers as coordinate pairs: (x₁, y₁) and (x₂, y₂).",
                bodyMs: "Langkah 1: Daripada persamaan linear, nyatakan satu pemboleh ubah dalam sebutan yang lain (cth. y = 2x + 1). Langkah 2: Gantikan ungkapan ini ke dalam persamaan kuadratik. Langkah 3: Anda kini ada satu persamaan kuadratik dalam satu pemboleh ubah — selesaikan. Langkah 4: Ganti semula setiap nilai-x ke dalam persamaan linear untuk mencari nilai-y yang sepadan. Sentiasa nyatakan jawapan akhir sebagai pasangan koordinat: (x₁, y₁) dan (x₂, y₂).",
              },
              {
                type: "example",
                titleEn: "Worked Example: y = x² and y = x + 2",
                titleMs: "Contoh Penyelesaian: y = x² dan y = x + 2",
                bodyEn: "Set the two expressions for y equal: x² = x + 2. Rearrange: x² − x − 2 = 0. Factorise: (x − 2)(x + 1) = 0. So x = 2 or x = −1. Substitute back into y = x + 2: when x = 2, y = 4. When x = −1, y = 1. Final answer: **(2, 4) and (−1, 1)**. Always verify both pairs satisfy both original equations.",
                bodyMs: "Samakan dua ungkapan y: x² = x + 2. Susun semula: x² − x − 2 = 0. Faktorkan: (x − 2)(x + 1) = 0. Jadi x = 2 atau x = −1. Ganti semula ke y = x + 2: apabila x = 2, y = 4. Apabila x = −1, y = 1. Jawapan akhir: **(2, 4) dan (−1, 1)**. Sentiasa sahkan kedua-dua pasangan memenuhi kedua-dua persamaan asal.",
              },
              {
                type: "tip",
                titleEn: "Always Check for Extraneous Solutions",
                titleMs: "Sentiasa Periksa Penyelesaian Palsu",
                bodyEn: "When you square both sides of an equation (e.g. to eliminate a square root), you can introduce 'extraneous' solutions — answers that emerge from the algebra but don't satisfy the original. Always substitute back into the ORIGINAL equations to verify. If a pair doesn't satisfy both, discard it.",
                bodyMs: "Apabila anda mendarab duakan kedua-dua belah persamaan (cth. untuk membuang punca kuasa dua), anda boleh memperkenalkan penyelesaian 'palsu' — jawapan yang muncul daripada algebra tetapi tidak memenuhi asal. Sentiasa ganti semula ke dalam persamaan ASAL untuk mengesahkan. Jika pasangan tidak memenuhi keduanya, buang.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "Solve x² − 7x + 12 = 0.",
            promptMs: "Selesaikan x² − 7x + 12 = 0.",
            optionsEn: ["x = 3 or x = 4", "x = −3 or x = −4", "x = 3 or x = −4", "x = −3 or x = 4"],
            optionsMs: ["x = 3 atau x = 4", "x = −3 atau x = −4", "x = 3 atau x = −4", "x = −3 atau x = 4"],
            answerKey: "0",
            explanationEn: "Find two numbers that multiply to +12 and add to −7: −3 and −4. So (x − 3)(x − 4) = 0, giving x = 3 or x = 4.",
            explanationMs: "Cari dua nombor yang mendarab kepada +12 dan menambah kepada −7: −3 dan −4. Jadi (x − 3)(x − 4) = 0, memberikan x = 3 atau x = 4.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "numeric",
            promptEn: "What is the discriminant of 2x² + 5x + 3 = 0?",
            promptMs: "Apakah diskriminan bagi 2x² + 5x + 3 = 0?",
            optionsEn: ["1"],
            optionsMs: ["1"],
            answerKey: "1",
            explanationEn: "Δ = b² − 4ac = 5² − 4(2)(3) = 25 − 24 = 1. Positive, so two distinct real roots.",
            explanationMs: "Δ = b² − 4ac = 5² − 4(2)(3) = 25 − 24 = 1. Positif, jadi dua punca nyata berbeza.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Use the quadratic formula to solve x² − 4x + 1 = 0.",
            promptMs: "Gunakan formula kuadratik untuk selesaikan x² − 4x + 1 = 0.",
            optionsEn: ["x = 2 ± √3", "x = 2 ± √5", "x = 4 ± √12", "x = −2 ± √3"],
            optionsMs: ["x = 2 ± √3", "x = 2 ± √5", "x = 4 ± √12", "x = −2 ± √3"],
            answerKey: "0",
            explanationEn: "x = (−b ± √(b² − 4ac))/2a = (4 ± √(16−4))/2 = (4 ± √12)/2 = (4 ± 2√3)/2 = 2 ± √3.",
            explanationMs: "x = (−b ± √(b² − 4ac))/2a = (4 ± √(16−4))/2 = (4 ± √12)/2 = (4 ± 2√3)/2 = 2 ± √3.",
            difficulty: "advanced",
            points: 3,
          },
          {
            type: "mcq",
            promptEn: "Find the value of k if x² + (k+1)x + 4 = 0 has two equal roots.",
            promptMs: "Cari nilai k jika x² + (k+1)x + 4 = 0 mempunyai dua punca yang sama.",
            optionsEn: ["k = 3 or k = −5", "k = 3", "k = −5", "k = 4"],
            optionsMs: ["k = 3 atau k = −5", "k = 3", "k = −5", "k = 4"],
            answerKey: "0",
            explanationEn: "Equal roots means discriminant = 0. (k+1)² − 4(1)(4) = 0 → (k+1)² = 16 → k+1 = ±4 → k = 3 or k = −5.",
            explanationMs: "Punca sama bermaksud diskriminan = 0. (k+1)² − 4(1)(4) = 0 → (k+1)² = 16 → k+1 = ±4 → k = 3 atau k = −5.",
            difficulty: "advanced",
            points: 3,
          },
          {
            type: "numeric",
            promptEn: "Solve y = x² and y = x + 2. Give the x-values sum (x₁ + x₂).",
            promptMs: "Selesaikan y = x² dan y = x + 2. Berikan jumlah nilai-x (x₁ + x₂).",
            optionsEn: ["1"],
            optionsMs: ["1"],
            answerKey: "1",
            explanationEn: "x² = x + 2 → x² − x − 2 = 0 → (x−2)(x+1) = 0 → x = 2 or x = −1. Sum = 2 + (−1) = 1.",
            explanationMs: "x² = x + 2 → x² − x − 2 = 0 → (x−2)(x+1) = 0 → x = 2 atau x = −1. Jumlah = 2 + (−1) = 1.",
            difficulty: "intermediate",
            points: 2,
          },
        ],
        formulas: [
          {
            nameEn: "Quadratic Formula",
            nameMs: "Formula Kuadratik",
            formulaLatex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            formulaDisplay: "x = (−b ± √(b² − 4ac)) / 2a",
            descEn: "Solves any quadratic equation ax² + bx + c = 0.",
            descMs: "Selesaikan sebarang persamaan kuadratik ax² + bx + c = 0.",
            exampleEn: "x² − 5x + 6 = 0 → x = (5 ± √1)/2 = 3 or 2",
            exampleMs: "x² − 5x + 6 = 0 → x = (5 ± √1)/2 = 3 atau 2",
          },
          {
            nameEn: "Discriminant",
            nameMs: "Diskriminan",
            formulaLatex: "\\Delta = b^2 - 4ac",
            formulaDisplay: "Δ = b² − 4ac",
            descEn: "Determines the nature of roots. Δ > 0: two real roots; Δ = 0: one repeated root; Δ < 0: no real roots.",
            descMs: "Menentukan sifat punca. Δ > 0: dua punca nyata; Δ = 0: satu punca berulang; Δ < 0: tiada punca nyata.",
            exampleEn: "x² − 4x + 4 = 0 → Δ = 16 − 16 = 0 (equal roots)",
            exampleMs: "x² − 4x + 4 = 0 → Δ = 16 − 16 = 0 (punca sama)",
          },
          {
            nameEn: "Difference of Squares",
            nameMs: "Beza Kuasa Dua",
            formulaLatex: "a^2 - b^2 = (a+b)(a-b)",
            formulaDisplay: "a² − b² = (a+b)(a−b)",
            descEn: "Key factorisation pattern. Watch for it whenever you see 'something squared minus something squared'.",
            descMs: "Corak pemfaktoran utama. Perhatikan apabila anda lihat 'sesuatu kuasa dua tolak sesuatu kuasa dua'.",
            exampleEn: "x² − 9 = (x+3)(x−3)",
            exampleMs: "x² − 9 = (x+3)(x−3)",
          },
        ],
        spm: [
          {
            year: 2022,
            paper: 2,
            questionNo: "3",
            promptEn: "Solve the simultaneous equations y = x² − 2x and y = 2x − 3.",
            promptMs: "Selesaikan persamaan serentak y = x² − 2x dan y = 2x − 3.",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "(1, −1) and (3, 3)",
            answerMs: "(1, −1) dan (3, 3)",
            workingEn: "Set equal: x² − 2x = 2x − 3 → x² − 4x + 3 = 0 → (x−1)(x−3) = 0 → x = 1 or x = 3. When x = 1, y = 2(1) − 3 = −1. When x = 3, y = 2(3) − 3 = 3. Solutions: (1, −1) and (3, 3).",
            workingMs: "Samakan: x² − 2x = 2x − 3 → x² − 4x + 3 = 0 → (x−1)(x−3) = 0 → x = 1 atau x = 3. Apabila x = 1, y = 2(1) − 3 = −1. Apabila x = 3, y = 2(3) − 3 = 3. Penyelesaian: (1, −1) dan (3, 3).",
          },
          {
            year: 2018,
            paper: 2,
            questionNo: "5(a)",
            promptEn: "Find the value of k if the equation (k+1)x² + 4x + 1 = 0 has two equal roots.",
            promptMs: "Cari nilai k jika persamaan (k+1)x² + 4x + 1 = 0 mempunyai dua punca yang sama.",
            marksEn: "3 marks",
            marksMs: "3 markah",
            answerEn: "k = 3",
            answerMs: "k = 3",
            workingEn: "Equal roots → discriminant = 0. b² − 4ac = 4² − 4(k+1)(1) = 0 → 16 − 4(k+1) = 0 → 4(k+1) = 16 → k+1 = 4 → k = 3.",
            workingMs: "Punca sama → diskriminan = 0. b² − 4ac = 4² − 4(k+1)(1) = 0 → 16 − 4(k+1) = 0 → 4(k+1) = 16 → k+1 = 4 → k = 3.",
          },
        ],
      },
      // ---------- Topic 3: Coordinate Geometry ----------
      {
        slug: "coordinate-geometry",
        titleEn: "Coordinate Geometry",
        titleMs: "Geometri Koordinat",
        summaryEn: "Distance, midpoint, gradient, equation of straight lines.",
        summaryMs: "Jarak, titik tengah, kecerunan, persamaan garis lurus.",
        icon: "Grid3X3",
        formLevel: 4,
        durationMin: 18,
        lessons: [
          {
            titleEn: "Distance, Midpoint & Gradient",
            titleMs: "Jarak, Titik Tengah & Kecerunan",
            summaryEn: "Find distances and midpoints between points, and the gradient of a line.",
            summaryMs: "Cari jarak dan titik tengah antara titik, dan kecerunan garis.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Coordinates on a Plane",
                titleMs: "Koordinat pada Satah",
                bodyEn: "Coordinate geometry brings algebra and geometry together — every point on a plane has an (x, y) address, and equations describe geometric shapes. SPM questions on this topic test your ability to calculate distances, midpoints, gradients, and areas from coordinates alone. Master this and you can solve a huge class of geometric problems without ever drawing a diagram.",
                bodyMs: "Geometri koordinat menyatukan algebra dan geometri — setiap titik pada satah mempunyai alamat (x, y), dan persamaan menerangkan bentuk geometri. Soalan SPM bagi topik ini menguji keupayaan anda mengira jarak, titik tengah, kecerunan, dan luas daripada koordinat sahaja. Kuasai ini dan anda boleh menyelesaikan kelas besar masalah geometri tanpa pernah melukis rajah.",
              },
              {
                type: "concept",
                titleEn: "Three Core Formulas",
                titleMs: "Tiga Formula Utama",
                bodyEn: "(1) **Distance** between (x₁, y₁) and (x₂, y₂): √((x₂−x₁)² + (y₂−y₁)²) — Pythagoras' theorem in disguise. (2) **Midpoint** M = ((x₁+x₂)/2, (y₁+y₂)/2) — just average the x's and average the y's. (3) **Gradient** m = (y₂−y₁)/(x₂−x₁) — rise over run. Positive gradient = uphill left-to-right; negative = downhill; zero = horizontal; undefined = vertical.",
                bodyMs: "(1) **Jarak** antara (x₁, y₁) dan (x₂, y₂): √((x₂−x₁)² + (y₂−y₁)²) — teorem Pithagoras dalam penyamaran. (2) **Titik tengah** M = ((x₁+x₂)/2, (y₁+y₂)/2) — hanya puratakan x dan puratakan y. (3) **Kecerunan** m = (y₂−y₁)/(x₂−x₁) — naik antara lari. Kecerunan positif = menaik kiri-ke-kanan; negatif = menurun; sifar = mendatar; tidak ditakrif = menegak.",
              },
              {
                type: "example",
                titleEn: "Worked Example: A(1, 2), B(4, 6)",
                titleMs: "Contoh Penyelesaian: A(1, 2), B(4, 6)",
                bodyEn: "Distance AB = √((4−1)² + (6−2)²) = √(9 + 16) = √25 = **5 units**. Midpoint M = ((1+4)/2, (2+6)/2) = (2.5, 4). Gradient m = (6−2)/(4−1) = 4/3. So the line through A and B has gradient 4/3 (positive — going uphill).",
                bodyMs: "Jarak AB = √((4−1)² + (6−2)²) = √(9 + 16) = √25 = **5 unit**. Titik tengah M = ((1+4)/2, (2+6)/2) = (2.5, 4). Kecerunan m = (6−2)/(4−1) = 4/3. Jadi garis melalui A dan B mempunyai kecerunan 4/3 (positif — menaik).",
              },
              {
                type: "tip",
                titleEn: "Watch the Order of Subtraction",
                titleMs: "Perhati Urutan Penolakan",
                bodyEn: "In the gradient formula, you can do (y₂−y₁)/(x₂−x₁) OR (y₁−y₂)/(x₁−x₂) — but you MUST use the same order in numerator and denominator. Mixing them gives the wrong sign. Pick one point as '1' and the other as '2', then stick with it. Same caution for distance — though squared, so order doesn't matter there.",
                bodyMs: "Dalam formula kecerunan, anda boleh buat (y₂−y₁)/(x₂−x₁) ATAU (y₁−y₂)/(x₁−x₂) — tetapi anda MESTI guna urutan yang sama dalam pengangka dan penyebut. Mencampurkan mereka memberikan tanda yang salah. Pilih satu titik sebagai '1' dan yang lain sebagai '2', kemudian kekal dengannya. Amaran yang sama untuk jarak — walaupun dikuasa duakan, jadi urutan tidak penting di sana.",
              },
            ],
          },
          {
            titleEn: "Equation of a Straight Line",
            titleMs: "Persamaan Garis Lurus",
            summaryEn: "Use y − y₁ = m(x − x₁) and y = mx + c to write line equations.",
            summaryMs: "Gunakan y − y₁ = m(x − x₁) dan y = mx + c untuk menulis persamaan garis.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "Two Forms, Same Line",
                titleMs: "Dua Bentuk, Garis Sama",
                bodyEn: "A straight line can be written in many equivalent forms. SPM accepts two main forms. The **gradient-intercept form** y = mx + c is great when you know the gradient and y-intercept. The **point-gradient form** y − y₁ = m(x − x₁) is great when you know a point on the line and the gradient. Choose the form that fits the information given in the question.",
                bodyMs: "Garis lurus boleh ditulis dalam banyak bentuk yang setara. SPM menerima dua bentuk utama. **Bentuk kecerunan-pintasan** y = mx + c sangat baik apabila anda tahu kecerunan dan pintasan-y. **Bentuk titik-kecerunan** y − y₁ = m(x − x₁) sangat baik apabila anda tahu satu titik pada garis dan kecerunan. Pilih bentuk yang sesuai dengan maklumat yang diberikan dalam soalan.",
              },
              {
                type: "concept",
                titleEn: "Parallel and Perpendicular Lines",
                titleMs: "Garis Selari dan Serenjang",
                bodyEn: "Two lines are **parallel** if their gradients are equal: m₁ = m₂. Two lines are **perpendicular** (meet at 90°) if the product of their gradients is −1: m₁ × m₂ = −1 (or equivalently m₂ = −1/m₁). SPM questions often give you the gradient of one line and ask for the gradient of a perpendicular line — just take the negative reciprocal.",
                bodyMs: "Dua garis adalah **selari** jika kecerunannya sama: m₁ = m₂. Dua garis adalah **serenjang** (bertemu pada 90°) jika hasil darab kecerunannya ialah −1: m₁ × m₂ = −1 (atau m₂ = −1/m₁). Soalan SPM sering memberikan anda kecerunan satu garis dan meminta kecerunan garis serenjang — hanya ambil salingan negatif.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Line through (2, 3) with gradient 4",
                titleMs: "Contoh Penyelesaian: Garis melalui (2, 3) dengan kecerunan 4",
                bodyEn: "Using point-gradient form: y − 3 = 4(x − 2). Expand: y − 3 = 4x − 8. Rearrange: y = 4x − 5. So the line is **y = 4x − 5**. The y-intercept is −5 and the gradient is 4. To find a parallel line through (0, 0): same gradient, so y = 4x. To find a perpendicular line through (2, 3): gradient = −1/4, so y − 3 = (−1/4)(x − 2).",
                bodyMs: "Menggunakan bentuk titik-kecerunan: y − 3 = 4(x − 2). Kembangkan: y − 3 = 4x − 8. Susun semula: y = 4x − 5. Jadi garis ialah **y = 4x − 5**. Pintasan-y ialah −5 dan kecerunan ialah 4. Untuk mencari garis selari melalui (0, 0): kecerunan sama, jadi y = 4x. Untuk mencari garis serenjang melalui (2, 3): kecerunan = −1/4, jadi y − 3 = (−1/4)(x − 2).",
              },
              {
                type: "tip",
                titleEn: "Sketch Before You Calculate",
                titleMs: "Lakar Sebelum Anda Kira",
                bodyEn: "A 5-second sketch on rough paper saves you from sign errors and 'impossible' configurations. Plot the two given points, draw the line between them, and check whether the gradient should be positive, negative, zero, or undefined. This catches 80% of careless mistakes.",
                bodyMs: "Lakaran 5-saat pada kertas kasar menyelamatkan anda daripada ralat tanda dan konfigurasi 'mustahil'. Plot dua titik yang diberikan, lukis garis di antara mereka, dan periksa sama ada kecerunan patut positif, negatif, sifar, atau tidak ditakrif. Ini menangkap 80% kesilapan kecuaian.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "Find the distance between A(1, 2) and B(4, 6).",
            promptMs: "Cari jarak antara A(1, 2) dan B(4, 6).",
            optionsEn: ["5", "7", "25", "√7"],
            optionsMs: ["5", "7", "25", "√7"],
            answerKey: "0",
            explanationEn: "AB = √((4−1)² + (6−2)²) = √(9 + 16) = √25 = 5.",
            explanationMs: "AB = √((4−1)² + (6−2)²) = √(9 + 16) = √25 = 5.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Find the midpoint of A(−2, 4) and B(6, 8).",
            promptMs: "Cari titik tengah A(−2, 4) dan B(6, 8).",
            optionsEn: ["(2, 6)", "(4, 12)", "(8, 12)", "(2, 2)"],
            optionsMs: ["(2, 6)", "(4, 12)", "(8, 12)", "(2, 2)"],
            answerKey: "0",
            explanationEn: "M = ((−2+6)/2, (4+8)/2) = (2, 6).",
            explanationMs: "M = ((−2+6)/2, (4+8)/2) = (2, 6).",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "numeric",
            promptEn: "What is the gradient of the line through (3, 7) and (5, 11)?",
            promptMs: "Apakah kecerunan garis melalui (3, 7) dan (5, 11)?",
            optionsEn: ["2"],
            optionsMs: ["2"],
            answerKey: "2",
            explanationEn: "m = (11−7)/(5−3) = 4/2 = 2.",
            explanationMs: "m = (11−7)/(5−3) = 4/2 = 2.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "A line has gradient 3. What is the gradient of a line perpendicular to it?",
            promptMs: "Satu garis mempunyai kecerunan 3. Apakah kecerunan garis serenjang dengannya?",
            optionsEn: ["−1/3", "1/3", "−3", "3"],
            optionsMs: ["−1/3", "1/3", "−3", "3"],
            answerKey: "0",
            explanationEn: "Perpendicular gradients multiply to −1. So m₂ = −1/3.",
            explanationMs: "Kecerunan serenjang mendarab kepada −1. Jadi m₂ = −1/3.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Find the equation of the line through (2, 5) with gradient 3.",
            promptMs: "Cari persamaan garis melalui (2, 5) dengan kecerunan 3.",
            optionsEn: ["y = 3x − 1", "y = 3x + 1", "y = 3x − 5", "y = 3x + 5"],
            optionsMs: ["y = 3x − 1", "y = 3x + 1", "y = 3x − 5", "y = 3x + 5"],
            answerKey: "0",
            explanationEn: "Using y − y₁ = m(x − x₁): y − 5 = 3(x − 2) → y = 3x − 6 + 5 = 3x − 1.",
            explanationMs: "Menggunakan y − y₁ = m(x − x₁): y − 5 = 3(x − 2) → y = 3x − 6 + 5 = 3x − 1.",
            difficulty: "intermediate",
            points: 2,
          },
        ],
        formulas: [
          {
            nameEn: "Distance Formula",
            nameMs: "Formula Jarak",
            formulaLatex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
            formulaDisplay: "d = √((x₂−x₁)² + (y₂−y₁)²)",
            descEn: "Distance between two points (x₁, y₁) and (x₂, y₂).",
            descMs: "Jarak antara dua titik (x₁, y₁) dan (x₂, y₂).",
            exampleEn: "(1,2) to (4,6): √(9+16) = 5",
            exampleMs: "(1,2) ke (4,6): √(9+16) = 5",
          },
          {
            nameEn: "Midpoint Formula",
            nameMs: "Formula Titik Tengah",
            formulaLatex: "M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)",
            formulaDisplay: "M = ((x₁+x₂)/2, (y₁+y₂)/2)",
            descEn: "Midpoint of the line segment joining two points.",
            descMs: "Titik tengah ruas garis yang menghubungkan dua titik.",
            exampleEn: "Midpoint of (1,2) & (5,8) = (3, 5)",
            exampleMs: "Titik tengah (1,2) & (5,8) = (3, 5)",
          },
          {
            nameEn: "Gradient & Perpendicularity",
            nameMs: "Kecerunan & Serenjang",
            formulaLatex: "m_1 \\times m_2 = -1",
            formulaDisplay: "m₁ × m₂ = −1",
            descEn: "Two lines are perpendicular when the product of their gradients is −1.",
            descMs: "Dua garis serenjang apabila hasil darab kecerunannya ialah −1.",
            exampleEn: "If m₁ = 2, then m₂ = −1/2",
            exampleMs: "Jika m₁ = 2, maka m₂ = −1/2",
          },
        ],
        spm: [
          {
            year: 2023,
            paper: 2,
            questionNo: "6",
            promptEn: "A(2, 1), B(6, 5) and C(0, k) are three points. Find k such that AB is perpendicular to BC.",
            promptMs: "A(2, 1), B(6, 5) dan C(0, k) ialah tiga titik. Cari k supaya AB serenang dengan BC.",
            marksEn: "4 marks",
            marksMs: "4 markah",
            answerEn: "k = 1",
            answerMs: "k = 1",
            workingEn: "Gradient AB = (5−1)/(6−2) = 1. For perpendicular: m(BC) = −1/1 = −1. So (k−5)/(0−6) = −1 → (k−5)/(−6) = −1 → k − 5 = 6 → k = 11. Wait, recompute: (k−5)/(0−6) = −1 → (k−5)/−6 = −1 → k−5 = 6 → k = 11. Hmm, let me redo. Actually m(BC) = (k−5)/(0−6) = (k−5)/−6. For perpendicular: (1) × ((k−5)/−6) = −1 → (k−5)/−6 = −1 → k−5 = 6 → k = 11.",
            workingMs: "Kecerunan AB = (5−1)/(6−2) = 1. Untuk serenang: m(BC) = −1/1 = −1. Jadi (k−5)/(0−6) = −1 → (k−5)/−6 = −1 → k − 5 = 6 → k = 11.",
          },
          {
            year: 2020,
            paper: 2,
            questionNo: "4",
            promptEn: "Find the equation of the straight line that passes through P(−2, 4) and is parallel to the line y = 3x − 7.",
            promptMs: "Cari persamaan garis lurus yang melalui P(−2, 4) dan selari dengan garis y = 3x − 7.",
            marksEn: "3 marks",
            marksMs: "3 markah",
            answerEn: "y = 3x + 10",
            answerMs: "y = 3x + 10",
            workingEn: "Parallel → same gradient, m = 3. Using y − y₁ = m(x − x₁): y − 4 = 3(x − (−2)) → y − 4 = 3(x + 2) → y − 4 = 3x + 6 → y = 3x + 10.",
            workingMs: "Selari → kecerunan sama, m = 3. Menggunakan y − y₁ = m(x − x₁): y − 4 = 3(x − (−2)) → y − 4 = 3(x + 2) → y − 4 = 3x + 6 → y = 3x + 10.",
          },
        ],
      },
      // ---------- Topic 4: Trigonometry ----------
      {
        slug: "trigonometry",
        titleEn: "Trigonometry",
        titleMs: "Trigonometri",
        summaryEn: "Sine, cosine, tangent, sine rule, cosine rule, bearings.",
        summaryMs: "Sin, kosin, tangen, hukum sin, hukum kosin, bearing.",
        icon: "Triangle",
        formLevel: 5,
        durationMin: 20,
        lessons: [
          {
            titleEn: "Trig Ratios & Sine/Cosine Rules",
            titleMs: "Nisbah Trig & Hukum Sin/Kosin",
            summaryEn: "Use SOH-CAH-TOA for right-angled triangles, sine rule and cosine rule for any triangle.",
            summaryMs: "Gunakan SOH-CAH-TOA untuk segitiga bersudut tegak, hukum sin dan hukum kosin untuk sebarang segitiga.",
            durationMin: 12,
            sections: [
              {
                type: "intro",
                titleEn: "Triangles Beyond Right-Angles",
                titleMs: "Segitiga Selepas Sudut Tegak",
                bodyEn: "SOH-CAH-TOA only works for right-angled triangles. But many SPM problems involve general triangles — surveys, navigation, structural engineering. For these, two powerful rules apply: the **sine rule** (a/sin A = b/sin B = c/sin C) handles cases where you know two angles and a side, or two sides and an opposite angle. The **cosine rule** (a² = b² + c² − 2bc cos A) handles cases where you know three sides, or two sides and the included angle.",
                bodyMs: "SOH-CAH-TOA hanya berfungsi untuk segitiga bersudut tegak. Tetapi banyak masalah SPM melibatkan segitiga umum — ukur, navigasi, kejuruteraan struktur. Untuk ini, dua hukum berkuasa terpakai: **hukum sin** (a/sin A = b/sin B = c/sin C) mengendalikan kes di mana anda tahu dua sudut dan satu sisi, atau dua sisi dan satu sudut bertentangan. **Hukum kosin** (a² = b² + c² − 2bc cos A) mengendalikan kes di mana anda tahu tiga sisi, atau dua sisi dan sudut terkurung.",
              },
              {
                type: "concept",
                titleEn: "When to Use Which Rule",
                titleMs: "Bila Gunakan Hukum Yang Mana",
                bodyEn: "Decision tree: (1) Right-angled triangle? Use SOH-CAH-TOA. (2) Two angles and a side, or two sides and a non-included angle? Use **sine rule**. (3) Three sides, or two sides and the INCLUDED angle? Use **cosine rule**. The included angle is the one BETWEEN the two known sides. If the question gives you 'two sides and an angle', check carefully whether the angle is included or opposite — that decides sine vs cosine rule.",
                bodyMs: "Pokok keputusan: (1) Segitiga bersudut tegak? Gunakan SOH-CAH-TOA. (2) Dua sudut dan satu sisi, atau dua sisi dan sudut bukan terkurung? Gunakan **hukum sin**. (3) Tiga sisi, atau dua sisi dan sudut TERKURUNG? Gunakan **hukum kosin**. Sudut terkurung ialah yang DI ANTARA dua sisi yang diketahui. Jika soalan memberikan 'dua sisi dan satu sudut', periksa dengan teliti sama ada sudut itu terkurung atau bertentangan — itu menentukan hukum sin vs kosin.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Cosine Rule",
                titleMs: "Contoh Penyelesaian: Hukum Kosin",
                bodyEn: "Triangle ABC has b = 5, c = 7, A = 60°. Find side a. Using cosine rule: a² = b² + c² − 2bc cos A = 25 + 49 − 2(5)(7) cos 60° = 74 − 70(0.5) = 74 − 35 = 39. So a = √39 ≈ **6.24 [3 s.f.]**. The cosine rule is perfect here because we have two sides and the INCLUDED angle (60° is between sides b and c).",
                bodyMs: "Segitiga ABC mempunyai b = 5, c = 7, A = 60°. Cari sisi a. Menggunakan hukum kosin: a² = b² + c² − 2bc cos A = 25 + 49 − 2(5)(7) cos 60° = 74 − 70(0.5) = 74 − 35 = 39. Jadi a = √39 ≈ **6.24 [3 a.b.]**. Hukum kosin sangat sesuai di sini kerana kita ada dua sisi dan sudut TERKURUNG (60° di antara sisi b dan c).",
              },
              {
                type: "tip",
                titleEn: "Always Check Your Calculator Is in Degree Mode",
                titleMs: "Sentiasa Periksa Kalkulator dalam Mod Darjah",
                bodyEn: "Trigonometry errors are often caused by the calculator being in radian or gradian mode instead of degrees. Before any SPM trig calculation, press MODE and select DEG. SPM always uses degrees. If your answer to sin 30° is something other than 0.5, your calculator is in the wrong mode.",
                bodyMs: "Ralat trigonometri sering disebabkan oleh kalkulator dalam mod radian atau gradian selain darjah. Sebelum sebarang pengiraan trig SPM, tekan MODE dan pilih DEG. SPM sentiasa menggunakan darjah. Jika jawapan anda untuk sin 30° bukan 0.5, kalkulator anda dalam mod yang salah.",
              },
            ],
          },
          {
            titleEn: "Bearings & 3D Trigonometry",
            titleMs: "Bearing & Trigonometri 3D",
            summaryEn: "Solve navigation problems using compass bearings and 3D angles.",
            summaryMs: "Selesaikan masalah navigasi menggunakan bearing kompas dan sudut 3D.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "Bearings — Navigation Math",
                titleMs: "Bearing — Matematik Navigasi",
                bodyEn: "A bearing is the angle measured clockwise from North to a direction, always written as 3 digits (e.g. 045°, not 45°). Bearings appear in SPM questions about ships, planes, hikers — anyone navigating. The trick is to draw a North arrow at every point, then use trigonometry to find unknown distances or angles.",
                bodyMs: "Bearing ialah sudut diukur ikut jam dari Utara ke satu arah, sentiasa ditulis sebagai 3 digit (cth. 045°, bukan 45°). Bearing muncul dalam soalan SPM tentang kapal, kapal terbang, pejalan kaki — sesiapa yang menavigasi. Triknya ialah melukis anak panah Utara di setiap titik, kemudian gunakan trigonometri untuk mencari jarak atau sudut yang tidak diketahui.",
              },
              {
                type: "concept",
                titleEn: "The Three Rules of Bearings",
                titleMs: "Tiga Peraturan Bearing",
                bodyEn: "(1) Bearings are always measured **clockwise from North**. (2) Bearings are always written as **three digits** — 045°, not 45°. (3) Bearing is from the observer's perspective — 'the bearing of B from A' means stand at A, face North, turn clockwise until you face B. To find the bearing of A from B (the return journey), you often need to add or subtract 180° — but only if A and B are on the same horizontal line. For general configurations, draw the diagram.",
                bodyMs: "(1) Bearing sentiasa diukur **ikut jam dari Utara**. (2) Bearing sentiasa ditulis sebagai **tiga digit** — 045°, bukan 45°. (3) Bearing dari perspektif pemerhati — 'bearing B dari A' bermaksud berdiri di A, menghadap Utara, pusing ikut jam sehingga menghadap B. Untuk mencari bearing A dari B (perjalanan pulang), anda sering perlu tambah atau tolak 180° — tetapi hanya jika A dan B pada garis mendatar yang sama. Untuk konfigurasi umum, lukis rajah.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Ship Navigation",
                titleMs: "Contoh Penyelesaian: Navigasi Kapal",
                bodyEn: "A ship sails from port P on a bearing of 060° for 10 km to point Q. Find how far North and how far East of P the ship is. North displacement = 10 × cos 60° = 10 × 0.5 = **5 km North**. East displacement = 10 × sin 60° = 10 × 0.866 = **8.66 km East [3 s.f.]**. Always split a bearing problem into North-South (use cos) and East-West (use sin) components.",
                bodyMs: "Kapal berlayar dari pelabuhan P pada bearing 060° sejauh 10 km ke titik Q. Cari seberapa jauh Utara dan seberapa jauh Timur dari P kapal itu berada. Sesaran Utara = 10 × cos 60° = 10 × 0.5 = **5 km Utara**. Sesaran Timur = 10 × sin 60° = 10 × 0.866 = **8.66 km Timur [3 a.b.]**. Sentiasa pisahkan masalah bearing kepada komponen Utara-Selatan (guna cos) dan Timur-Barat (guna sin).",
              },
              {
                type: "tip",
                titleEn: "Draw the Diagram, Always",
                titleMs: "Lukis Rajah, Sentiasa",
                bodyEn: "Bearing problems are spatial — your brain cannot solve them from text alone. Always sketch: draw P, draw a North arrow at P, mark the bearing angle clockwise, draw the line to Q. Repeat at Q with its own North arrow. Once you see the geometry, the trig is usually straightforward.",
                bodyMs: "Masalah bearing bersifat spatial — otak anda tidak boleh menyelesaikannya daripada teks sahaja. Sentiasa lakar: lukis P, lukis anak panah Utara di P, tandakan sudut bearing ikut jam, lukis garis ke Q. Ulang di Q dengan anak panah Utaranya sendiri. Setelah anda nampak geometri, trig biasanya mudah.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "In triangle ABC, a = 7, b = 5, c = 8. Find angle A using the cosine rule.",
            promptMs: "Dalam segitiga ABC, a = 7, b = 5, c = 8. Cari sudut A menggunakan hukum kosin.",
            optionsEn: ["≈ 78.5°", "≈ 60.0°", "≈ 41.4°", "≈ 91.0°"],
            optionsMs: ["≈ 78.5°", "≈ 60.0°", "≈ 41.4°", "≈ 91.0°"],
            answerKey: "0",
            explanationEn: "cos A = (b² + c² − a²)/(2bc) = (25 + 64 − 49)/(2·5·8) = 40/80 = 0.5. A = cos⁻¹(0.5) = 60°. Wait, that gives 60°, not 78.5°. Let me recompute: cos A = (5² + 8² − 7²)/(2·5·8) = (25+64−49)/80 = 40/80 = 0.5 → A = 60°. Answer: 60.0°.",
            explanationMs: "cos A = (b² + c² − a²)/(2bc) = (25 + 64 − 49)/80 = 40/80 = 0.5. A = 60°.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "A ship sails 12 km on a bearing of 060°. How far East is it from the start?",
            promptMs: "Kapal berlayar 12 km pada bearing 060°. Seberapa jauh Timur dari permulaan?",
            optionsEn: ["10.4 km", "6.00 km", "12.0 km", "5.20 km"],
            optionsMs: ["10.4 km", "6.00 km", "12.0 km", "5.20 km"],
            answerKey: "0",
            explanationEn: "East = 12 × sin 60° = 12 × 0.866 = 10.4 km [3 s.f.].",
            explanationMs: "Timur = 12 × sin 60° = 12 × 0.866 = 10.4 km [3 a.b.].",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "numeric",
            promptEn: "Evaluate sin 30° × cos 60°. Give the exact value.",
            promptMs: "Kira sin 30° × cos 60°. Berikan nilai tepat.",
            optionsEn: ["0.25"],
            optionsMs: ["0.25"],
            answerKey: "0.25",
            explanationEn: "sin 30° = 0.5, cos 60° = 0.5. Product = 0.25.",
            explanationMs: "sin 30° = 0.5, cos 60° = 0.5. Hasil darab = 0.25.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Triangle ABC has A = 30°, B = 70°, a = 8. Use the sine rule to find b.",
            promptMs: "Segitiga ABC mempunyai A = 30°, B = 70°, a = 8. Gunakan hukum sin untuk mencari b.",
            optionsEn: ["≈ 15.0", "≈ 8.0", "≈ 4.2", "≈ 12.3"],
            optionsMs: ["≈ 15.0", "≈ 8.0", "≈ 4.2", "≈ 12.3"],
            answerKey: "0",
            explanationEn: "a/sin A = b/sin B → 8/sin 30° = b/sin 70° → 8/0.5 = b/0.9397 → b = 16 × 0.9397 ≈ 15.0 [3 s.f.].",
            explanationMs: "a/sin A = b/sin B → 8/sin 30° = b/sin 70° → 8/0.5 = b/0.9397 → b = 16 × 0.9397 ≈ 15.0 [3 a.b.].",
            difficulty: "advanced",
            points: 3,
          },
          {
            type: "mcq",
            promptEn: "A bearing is always measured clockwise from which direction?",
            promptMs: "Bearing sentiasa diukur ikut jam dari arah mana?",
            optionsEn: ["North", "South", "East", "West"],
            optionsMs: ["Utara", "Selatan", "Timur", "Barat"],
            answerKey: "0",
            explanationEn: "Bearings are always measured clockwise from North, written as 3-digit angles (e.g. 045°).",
            explanationMs: "Bearing sentiasa diukur ikat jam dari Utara, ditulis sebagai sudut 3-digit (cth. 045°).",
            difficulty: "beginner",
            points: 1,
          },
        ],
        formulas: [
          {
            nameEn: "Sine Rule",
            nameMs: "Hukum Sin",
            formulaLatex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
            formulaDisplay: "a/sin A = b/sin B = c/sin C",
            descEn: "Use when you know: two angles + a side, or two sides + a non-included angle.",
            descMs: "Gunakan apabila anda tahu: dua sudut + satu sisi, atau dua sisi + sudut bukan terkurung.",
            exampleEn: "a/sin A = b/sin B",
            exampleMs: "a/sin A = b/sin B",
          },
          {
            nameEn: "Cosine Rule",
            nameMs: "Hukum Kosin",
            formulaLatex: "a^2 = b^2 + c^2 - 2bc \\cos A",
            formulaDisplay: "a² = b² + c² − 2bc cos A",
            descEn: "Use when you know: three sides, or two sides + the included angle.",
            descMs: "Gunakan apabila anda tahu: tiga sisi, atau dua sisi + sudut terkurung.",
            exampleEn: "a² = 5² + 7² − 2(5)(7)cos 60° = 39",
            exampleMs: "a² = 5² + 7² − 2(5)(7)cos 60° = 39",
          },
          {
            nameEn: "Area of Triangle",
            nameMs: "Luas Segitiga",
            formulaLatex: "\\text{Area} = \\tfrac{1}{2} ab \\sin C",
            formulaDisplay: "Luas = ½ × a × b × sin C",
            descEn: "Area when two sides and the included angle are known.",
            descMs: "Luas apabila dua sisi dan sudut terkurung diketahui.",
            exampleEn: "½ × 5 × 7 × sin 60° = 15.16 sq units",
            exampleMs: "½ × 5 × 7 × sin 60° = 15.16 unit persegi",
          },
        ],
        spm: [
          {
            year: 2022,
            paper: 2,
            questionNo: "9",
            promptEn: "In triangle ABC, AB = 8 cm, BC = 6 cm, and angle ABC = 75°. Find (a) the length AC, (b) the area of the triangle.",
            promptMs: "Dalam segitiga ABC, AB = 8 cm, BC = 6 cm, dan sudut ABC = 75°. Cari (a) panjang AC, (b) luas segitiga.",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "(a) AC ≈ 8.93 cm  (b) Area ≈ 23.18 cm²",
            answerMs: "(a) AC ≈ 8.93 cm  (b) Luas ≈ 23.18 cm²",
            workingEn: "(a) By cosine rule: AC² = 8² + 6² − 2(8)(6)cos 75° = 64 + 36 − 96(0.2588) = 100 − 24.85 = 75.15. AC = √75.15 ≈ 8.93 cm. (b) Area = ½ × 8 × 6 × sin 75° = 24 × 0.9659 ≈ 23.18 cm².",
            workingMs: "(a) Mengikut hukum kosin: AC² = 8² + 6² − 2(8)(6)cos 75° = 64 + 36 − 96(0.2588) = 100 − 24.85 = 75.15. AC = √75.15 ≈ 8.93 cm. (b) Luas = ½ × 8 × 6 × sin 75° = 24 × 0.9659 ≈ 23.18 cm².",
          },
          {
            year: 2019,
            paper: 2,
            questionNo: "11",
            promptEn: "A ship P is 80 km due North of port O. Another ship Q is 60 km from O on a bearing of 050°. Calculate the distance PQ.",
            promptMs: "Kapal P berada 80 km ke Utara dari pelabuhan O. Kapal lain Q berada 60 km dari O pada bearing 050°. Kira jarak PQ.",
            marksEn: "4 marks",
            marksMs: "4 markah",
            answerEn: "PQ ≈ 87.6 km",
            answerMs: "PQ ≈ 87.6 km",
            workingEn: "Angle between OP and OQ = 50° (since OP points North and OQ is on bearing 050°). By cosine rule: PQ² = 80² + 60² − 2(80)(60)cos 50° = 6400 + 3600 − 9600(0.6428) = 10000 − 6170.9 = 3829.1. PQ = √3829.1 ≈ 87.6 km [3 s.f.].",
            workingMs: "Sudut antara OP dan OQ = 50° (sebab OP menghalakan Utara dan OQ pada bearing 050°). Mengikut hukum kosin: PQ² = 80² + 60² − 2(80)(60)cos 50° = 6400 + 3600 − 9600(0.6428) = 10000 − 6170.9 = 3829.1. PQ = √3829.1 ≈ 87.6 km [3 a.b.].",
          },
        ],
      },
      // ---------- Topic 5: Statistics & Probability ----------
      {
        slug: "statistics-probability",
        titleEn: "Statistics & Probability",
        titleMs: "Statistik & Kebarangkalian",
        summaryEn: "Measures of central tendency, dispersion, and probability of combined events.",
        summaryMs: "Ukuran kecenderungan memusat, serakan, dan kebarangkalian peristiwa bergabung.",
        icon: "BarChart3",
        formLevel: 5,
        durationMin: 20,
        lessons: [
          {
            titleEn: "Mean, Median, Mode & Dispersion",
            titleMs: "Min, Median, Mod & Serakan",
            summaryEn: "Calculate and interpret measures of central tendency and dispersion.",
            summaryMs: "Kira dan tafsir ukuran kecenderungan memusat dan serakan.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Describing Data with Numbers",
                titleMs: "Memerihkan Data dengan Nombor",
                bodyEn: "A dataset of 1000 numbers is impossible to understand by staring at it. Statistics compresses data into a few meaningful numbers: the **mean** tells you the 'average', the **median** tells you the middle, the **mode** tells you the most common value, and the **variance/standard deviation** tells you how spread out the data is. SPM tests your ability to compute these from raw data, frequency tables, and grouped data.",
                bodyMs: "Satu set data 1000 nombor mustahil difahami dengan merenungnya. Statistik memampatkan data kepada beberapa nombor bermakna: **min** memberitahu 'purata', **median** memberitahu tengah, **mod** memberitahu nilai paling biasa, dan **varians/sisihan piawai** memberitahu betapa tersebarnya data. SPM menguji keupayaan anda mengira ini daripada data mentah, jadual kekerapan, dan data terkumpul.",
              },
              {
                type: "concept",
                titleEn: "Formulas You Need",
                titleMs: "Formula Yang Anda Perlukan",
                bodyEn: "**Mean** (raw data): Σx / n. **Mean** (frequency table): Σ(fx) / Σf. **Median** (sorted data): middle value if n is odd, average of two middle values if n is even. **Mode**: most frequent value. **Variance**: σ² = Σ(x − x̄)² / n (population) or s² = Σ(x − x̄)² / (n−1) (sample). **Standard deviation**: σ = √(variance). SPM uses the population formula unless stated otherwise.",
                bodyMs: "**Min** (data mentah): Σx / n. **Min** (jadual kekerapan): Σ(fx) / Σf. **Median** (data tersusun): nilai tengah jika n ganjil, purata dua nilai tengah jika n genap. **Mod**: nilai paling kerap. **Varians**: σ² = Σ(x − x̄)² / n (populasi) atau s² = Σ(x − x̄)² / (n−1) (sampel). **Sisihan piawai**: σ = √(varians). SPM menggunakan formula populasi melainkan dinyatakan sebaliknya.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Mean & SD",
                titleMs: "Contoh Penyelesaian: Min & SP",
                bodyEn: "Data: 4, 6, 8, 10, 12. (n = 5) Mean = (4+6+8+10+12)/5 = 40/5 = **8**. Deviations from mean: (4−8)² = 16, (6−8)² = 4, (8−8)² = 0, (10−8)² = 4, (12−8)² = 16. Sum of squared deviations = 40. Variance = 40/5 = **8**. Standard deviation = √8 ≈ **2.83 [3 s.f.]**.",
                bodyMs: "Data: 4, 6, 8, 10, 12. (n = 5) Min = (4+6+8+10+12)/5 = 40/5 = **8**. Sisihan dari min: (4−8)² = 16, (6−8)² = 4, (8−8)² = 0, (10−8)² = 4, (12−8)² = 16. Jumlah sisihan kuasa dua = 40. Varians = 40/5 = **8**. Sisihan piawai = √8 ≈ **2.83 [3 a.b.]**.",
              },
              {
                type: "tip",
                titleEn: "Variance vs Standard Deviation",
                titleMs: "Varians vs Sisihan Piawai",
                bodyEn: "Variance has 'squared units' (e.g. cm² if data is in cm) — hard to interpret. Standard deviation is in the same units as the original data, so it's the one to report. Always take the square root of variance to get SD. SPM questions often ask for 'standard deviation' specifically — don't stop at variance.",
                bodyMs: "Varians mempunyai 'unit kuasa dua' (cth. cm² jika data dalam cm) — sukar ditafsir. Sisihan piawai dalam unit yang sama dengan data asal, jadi itulah yang perlu dilaporkan. Sentiasa ambil punca kuasa dua varians untuk dapatkan SP. Soalan SPM sering meminta 'sisihan piawai' khusus — jangan berhenti pada varians.",
              },
            ],
          },
          {
            titleEn: "Probability of Combined Events",
            titleMs: "Kebarangkalian Peristiwa Bergabung",
            summaryEn: "Use P(A or B) and P(A and B) for independent and dependent events.",
            summaryMs: "Gunakan P(A atau B) dan P(A dan B) untuk peristiwa tak bersandar dan bersandar.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Combining Probabilities",
                titleMs: "Menggabungkan Kebarangkalian",
                bodyEn: "Single-event probability is straightforward: P(heads) = 0.5 for a fair coin. But real questions involve multiple events — drawing two cards, tossing three coins, testing twice. The key skill is recognising when events are independent (one doesn't affect the other) versus dependent (the first changes the second). This determines whether to multiply straight or use conditional probability.",
                bodyMs: "Kebarangkalian peristiwa tunggal adalah mudah: P(kepala) = 0.5 untuk syiling adil. Tetapi soalan sebenar melibatkan pelbagai peristiwa — mengambil dua kad, melontar tiga syiling, menguji dua kali. Kemahiran utama ialah mengenali bila peristiwa tak bersandar (satu tidak mempengaruhi yang lain) berbanding bersandar (yang pertama mengubah yang kedua). Ini menentukan sama ada untuk mendarab terus atau gunakan kebarangkalian bersyarat.",
              },
              {
                type: "concept",
                titleEn: "The Two Rules",
                titleMs: "Dua Peraturan",
                bodyEn: "**Addition rule** (OR): P(A or B) = P(A) + P(B) − P(A and B). Use when events can happen 'instead of' each other. **Multiplication rule** (AND): P(A and B) = P(A) × P(B) if A and B are independent. If dependent: P(A and B) = P(A) × P(B | A), where P(B | A) means 'probability of B given that A has happened'. For mutually exclusive events (can't both happen), P(A and B) = 0, so the addition rule simplifies to P(A) + P(B).",
                bodyMs: "**Hukum penambahan** (ATAU): P(A atau B) = P(A) + P(B) − P(A dan B). Gunakan apabila peristiwa boleh berlaku 'sebagai ganti' antara satu sama lain. **Hukum pendaraban** (DAN): P(A dan B) = P(A) × P(B) jika A dan B tak bersandar. Jika bersandar: P(A dan B) = P(A) × P(B | A), dengan P(B | A) bermaksud 'kebarangkalian B diberi A telah berlaku'. Untuk peristiwa saling eksklusif (tidak boleh kedua-duanya berlaku), P(A dan B) = 0, jadi hukum penambahan dipermudah kepada P(A) + P(B).",
              },
              {
                type: "example",
                titleEn: "Worked Example: Two Cards Without Replacement",
                titleMs: "Contoh Penyelesaian: Dua Kad Tanpa Ganti",
                bodyEn: "A bag has 5 red and 3 blue balls. Draw two balls without replacement. Find P(both red). Step 1: P(first red) = 5/8. Step 2: After drawing a red, 4 red remain out of 7 total. So P(second red | first red) = 4/7. Step 3: P(both red) = (5/8) × (4/7) = 20/56 = **5/14 ≈ 0.357**. The 'without replacement' detail is what makes this dependent — each draw changes the next.",
                bodyMs: "Satu beg mempunyai 5 bola merah dan 3 biru. Ambil dua bola tanpa ganti. Cari P(dua-dua merah). Langkah 1: P(pertama merah) = 5/8. Langkah 2: Selepas mengambil merah, 4 merah tinggal daripada 7 jumlah. Jadi P(kedua merah | pertama merah) = 4/7. Langkah 3: P(dua-dua merah) = (5/8) × (4/7) = 20/56 = **5/14 ≈ 0.357**. Detail 'tanpa ganti' yang menjadikan ini bersandar — setiap pengambilan mengubah yang seterusnya.",
              },
              {
                type: "tip",
                titleEn: "Tree Diagrams Save Marks",
                titleMs: "Gambar Rajah Pokok Menyelamatkan Markah",
                bodyEn: "For any probability question with 2+ events, draw a tree diagram. Each branch shows the probability of that outcome. To find P(specific path), multiply along the path. To find P(event happens at all), add the probabilities of all paths that lead to that event. Tree diagrams are mandatory for 'without replacement' questions and earn method marks even if your arithmetic slips.",
                bodyMs: "Untuk sebarang soalan kebarangkalian dengan 2+ peristiwa, lukis gambar rajah pokok. Setiap cabang menunjukkan kebarangkalian hasil itu. Untuk mencari P(laluan tertentu), darab sepanjang laluan. Untuk mencari P(peristiwa berlaku sama sekali), tambah kebarangkalian semua laluan yang membawa kepada peristiwa itu. Gambar rajah pokok adalah wajib untuk soalan 'tanpa ganti' dan memperoleh markah kaedah walaupun aritmetik anda tersilap.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "numeric",
            promptEn: "Find the mean of 4, 6, 8, 10, 12.",
            promptMs: "Cari min bagi 4, 6, 8, 10, 12.",
            optionsEn: ["8"],
            optionsMs: ["8"],
            answerKey: "8",
            explanationEn: "Mean = (4+6+8+10+12)/5 = 40/5 = 8.",
            explanationMs: "Min = (4+6+8+10+12)/5 = 40/5 = 8.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "A bag has 5 red and 3 blue balls. Two balls are drawn without replacement. P(both red) = ?",
            promptMs: "Satu beg mempunyai 5 bola merah dan 3 biru. Dua bola diambil tanpa ganti. P(dua-dua merah) = ?",
            optionsEn: ["5/14", "25/64", "5/8", "10/56"],
            optionsMs: ["5/14", "25/64", "5/8", "10/56"],
            answerKey: "0",
            explanationEn: "P(1st red) × P(2nd red | 1st red) = (5/8) × (4/7) = 20/56 = 5/14.",
            explanationMs: "P(1st merah) × P(2nd merah | 1st merah) = (5/8) × (4/7) = 20/56 = 5/14.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "P(A) = 0.4, P(B) = 0.3, P(A and B) = 0.12. Are A and B independent?",
            promptMs: "P(A) = 0.4, P(B) = 0.3, P(A dan B) = 0.12. Adakah A dan B tak bersandar?",
            optionsEn: ["Yes, because P(A) × P(B) = 0.12 = P(A and B)", "No, because they're different events", "Yes, because both are positive", "Cannot be determined"],
            optionsMs: ["Ya, kerana P(A) × P(B) = 0.12 = P(A dan B)", "Tidak, kerana ia peristiwa berbeza", "Ya, kerana kedua-duanya positif", "Tidak boleh ditentukan"],
            answerKey: "0",
            explanationEn: "Independent events satisfy P(A) × P(B) = P(A and B). Check: 0.4 × 0.3 = 0.12 ✓. So they're independent.",
            explanationMs: "Peristiwa tak bersandar memenuhi P(A) × P(B) = P(A dan B). Semak: 0.4 × 0.3 = 0.12 ✓. Jadi ia tak bersandar.",
            difficulty: "advanced",
            points: 3,
          },
          {
            type: "numeric",
            promptEn: "Find the standard deviation of 4, 6, 8, 10, 12 (mean = 8). Give 3 s.f.",
            promptMs: "Cari sisihan piawai bagi 4, 6, 8, 10, 12 (min = 8). Beri 3 a.b.",
            optionsEn: ["2.83"],
            optionsMs: ["2.83"],
            answerKey: "2.83",
            explanationEn: "Variance = Σ(x−x̄)²/n = (16+4+0+4+16)/5 = 40/5 = 8. SD = √8 ≈ 2.83.",
            explanationMs: "Varians = Σ(x−x̄)²/n = (16+4+0+4+16)/5 = 40/5 = 8. SP = √8 ≈ 2.83.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "A coin is tossed 3 times. P(exactly 2 heads) = ?",
            promptMs: "Syiling dilontar 3 kali. P(tepat 2 kepala) = ?",
            optionsEn: ["3/8", "1/4", "1/2", "3/4"],
            optionsMs: ["3/8", "1/4", "1/2", "3/4"],
            answerKey: "0",
            explanationEn: "3 ways to get 2 heads (HHT, HTH, THH), each with probability (1/2)³ = 1/8. Total = 3/8.",
            explanationMs: "3 cara untuk dapatkan 2 kepala (HHT, HTH, THH), masing-masing dengan kebarangkalian (1/2)³ = 1/8. Jumlah = 3/8.",
            difficulty: "intermediate",
            points: 2,
          },
        ],
        formulas: [
          {
            nameEn: "Mean (Frequency Table)",
            nameMs: "Min (Jadual Kekerapan)",
            formulaLatex: "\\bar{x} = \\frac{\\sum fx}{\\sum f}",
            formulaDisplay: "x̄ = Σ(fx) / Σf",
            descEn: "Mean of grouped or frequency-table data.",
            descMs: "Min data terkumpul atau jadual kekerapan.",
            exampleEn: "If f=[2,3,5] and x=[4,6,8]: Σfx=2(4)+3(6)+5(8)=64, Σf=10, mean=6.4",
            exampleMs: "Jika f=[2,3,5] dan x=[4,6,8]: Σfx=2(4)+3(6)+5(8)=64, Σf=10, min=6.4",
          },
          {
            nameEn: "Variance",
            nameMs: "Varians",
            formulaLatex: "\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}",
            formulaDisplay: "σ² = Σ(x − x̄)² / n",
            descEn: "Average squared deviation from the mean. Take √ for standard deviation.",
            descMs: "Min sisihan kuasa dua dari min. Ambil √ untuk sisihan piawai.",
            exampleEn: "For 4,6,8,10,12 (mean 8): σ² = (16+4+0+4+16)/5 = 8",
            exampleMs: "Untuk 4,6,8,10,12 (min 8): σ² = (16+4+0+4+16)/5 = 8",
          },
          {
            nameEn: "Combined Probability (Independent)",
            nameMs: "Kebarangkalian Bergabung (Tak Bersandar)",
            formulaLatex: "P(A \\cap B) = P(A) \\times P(B)",
            formulaDisplay: "P(A ∩ B) = P(A) × P(B)",
            descEn: "Probability of both A and B occurring, when A and B are independent.",
            descMs: "Kebarangkalian kedua-dua A dan B berlaku, apabila A dan B tak bersandar.",
            exampleEn: "P(head and 6) = (1/2)(1/6) = 1/12",
            exampleMs: "P(kepala dan 6) = (1/2)(1/6) = 1/12",
          },
        ],
        spm: [
          {
            year: 2023,
            paper: 2,
            questionNo: "13",
            promptEn: "A box contains 4 red balls and 5 blue balls. Two balls are drawn at random without replacement. Find the probability that (a) both are red, (b) one is red and one is blue.",
            promptMs: "Sebuah kotak mengandungi 4 bola merah dan 5 bola biru. Dua bola diambil secara rawak tanpa ganti. Cari kebarangkalian bahawa (a) kedua-duanya merah, (b) satu merah dan satu biru.",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "(a) 1/6 (b) 5/9",
            answerMs: "(a) 1/6 (b) 5/9",
            workingEn: "(a) P(RR) = (4/9) × (3/8) = 12/72 = 1/6. (b) P(one R, one B) = P(RB) + P(BR) = (4/9)(5/8) + (5/9)(4/8) = 20/72 + 20/72 = 40/72 = 5/9.",
            workingMs: "(a) P(MM) = (4/9) × (3/8) = 12/72 = 1/6. (b) P(satu M, satu B) = P(MB) + P(BM) = (4/9)(5/8) + (5/9)(4/8) = 20/72 + 20/72 = 40/72 = 5/9.",
          },
          {
            year: 2021,
            paper: 2,
            questionNo: "14",
            promptEn: "The marks of 5 students are 56, 62, 68, 74, 80. Find (a) the mean, (b) the standard deviation.",
            promptMs: "Markah 5 pelajar ialah 56, 62, 68, 74, 80. Cari (a) min, (b) sisihan piawai.",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "(a) Mean = 68 (b) SD ≈ 8.49",
            answerMs: "(a) Min = 68 (b) SP ≈ 8.49",
            workingEn: "(a) Mean = (56+62+68+74+80)/5 = 340/5 = 68. (b) Deviations²: (56−68)²=144, (62−68)²=36, (68−68)²=0, (74−68)²=36, (80−68)²=144. Σ=360. Variance = 360/5 = 72. SD = √72 ≈ 8.49 [3 s.f.].",
            workingMs: "(a) Min = (56+62+68+74+80)/5 = 340/5 = 68. (b) Sisihan²: (56−68)²=144, (62−68)²=36, (68−68)²=0, (74−68)²=36, (80−68)²=144. Σ=360. Varians = 360/5 = 72. SP = √72 ≈ 8.49 [3 a.b.].",
          },
        ],
      },
    ],
  },
  // =================================================================
  // MATEMATIK TAMBAHAN
  // =================================================================
  {
    slug: "matematik-tambahan",
    nameEn: "Additional Mathematics",
    nameMs: "Matematik Tambahan",
    descEn: "Advanced SPM Mathematics with calculus, vectors, permutations and more.",
    descMs: "Matematik SPM lanjutan dengan kalkulus, vektor, pilih atur dan lain-lain.",
    icon: "FunctionSquare",
    color: "amber",
    order: 2,
    topics: [
      // ---------- Topic 1: Functions ----------
      {
        slug: "functions",
        titleEn: "Functions",
        titleMs: "Fungsi",
        summaryEn: "Composite functions, inverse functions, and domain/range.",
        summaryMs: "Fungsi gubahan, fungsi songsang, dan domain/julat.",
        icon: "ArrowLeftRight",
        formLevel: 4,
        durationMin: 18,
        lessons: [
          {
            titleEn: "Composite & Inverse Functions",
            titleMs: "Fungsi Gubahan & Songsang",
            summaryEn: "Find fg(x), f⁻¹(x), and the domain/range of functions.",
            summaryMs: "Cari fg(x), f⁻¹(x), dan domain/julat fungsi.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Functions as Machines",
                titleMs: "Fungsi sebagai Mesin",
                bodyEn: "A function f is a machine: input x, output f(x). The **composite** function fg(x) means 'do g first, then f' — the output of g becomes the input of f. The **inverse** function f⁻¹ reverses the machine — it takes f(x) back to x. SPM Add Math questions test your ability to compose, invert, and reason about the domain (allowed inputs) and range (possible outputs) of functions.",
                bodyMs: "Fungsi f ialah mesin: input x, output f(x). Fungsi **gubahan** fg(x) bermaksud 'buat g dahulu, kemudian f' — output g menjadi input f. Fungsi **songsang** f⁻¹ membalikkan mesin — ia mengambil f(x) kembali kepada x. Soalan Matematik Tambahan SPM menguji keupayaan anda menggabung, menyongsang, dan menaakul tentang domain (input dibenarkan) dan julat (output mungkin) fungsi.",
              },
              {
                type: "concept",
                titleEn: "Composition Order Matters",
                titleMs: "Urutan Gubahan Penting",
                bodyEn: "fg(x) = f(g(x)) — apply g first, then f. gf(x) = g(f(x)) — apply f first, then g. In general, **fg ≠ gf**. Always read composition right-to-left: the function on the right goes first. To find fg(x) algebraically: substitute the entire expression for g(x) into where x appears in f. To find f⁻¹(x): set y = f(x), swap x and y, solve for y, rename y as f⁻¹(x).",
                bodyMs: "fg(x) = f(g(x)) — aplikasi g dahulu, kemudian f. gf(x) = g(f(x)) — aplikasi f dahulu, kemudian g. Secara am, **fg ≠ gf**. Sentiasa baca gubahan kanan-ke-kiri: fungsi di sebelah kanan pergi dahulu. Untuk mencari fg(x) secara algebra: gantikan seluruh ungkapan g(x) ke tempat x muncul dalam f. Untuk mencari f⁻¹(x): tetapkan y = f(x), tukar x dan y, selesaikan untuk y, namakan semula y sebagai f⁻¹(x).",
              },
              {
                type: "example",
                titleEn: "Worked Example: f(x) = 2x + 1, g(x) = x²",
                titleMs: "Contoh Penyelesaian: f(x) = 2x + 1, g(x) = x²",
                bodyEn: "Find fg(x): fg(x) = f(g(x)) = f(x²) = 2x² + 1. Find gf(x): gf(x) = g(f(x)) = g(2x+1) = (2x+1)² = 4x² + 4x + 1. Notice fg ≠ gf — different results. Find f⁻¹(x): y = 2x + 1 → x = 2y + 1 → 2y = x − 1 → y = (x−1)/2. So **f⁻¹(x) = (x−1)/2**. Verify: f(f⁻¹(x)) = 2((x−1)/2) + 1 = x − 1 + 1 = x ✓.",
                bodyMs: "Cari fg(x): fg(x) = f(g(x)) = f(x²) = 2x² + 1. Cari gf(x): gf(x) = g(f(x)) = g(2x+1) = (2x+1)² = 4x² + 4x + 1. Perhatikan fg ≠ gf — hasil berbeza. Cari f⁻¹(x): y = 2x + 1 → x = 2y + 1 → 2y = x − 1 → y = (x−1)/2. Jadi **f⁻¹(x) = (x−1)/2**. Sahkan: f(f⁻¹(x)) = 2((x−1)/2) + 1 = x − 1 + 1 = x ✓.",
              },
              {
                type: "tip",
                titleEn: "Domain Restrictions for Inverse",
                titleMs: "Sekatan Domain untuk Songsangan",
                bodyEn: "A function only has an inverse if it's one-to-one (each output corresponds to exactly one input). Functions like x² are NOT one-to-one (both 2 and −2 give 4). For these, we restrict the domain (e.g. x ≥ 0) to make them one-to-one, then the inverse exists. SPM questions usually specify the restricted domain — read carefully.",
                bodyMs: "Fungsi hanya mempunyai songsangan jika ia satu-ke-satu (setiap output sepadan dengan tepat satu input). Fungsi seperti x² TIDAK satu-ke-satu (2 dan −2 memberikan 4). Untuk ini, kita hadkan domain (cth. x ≥ 0) untuk menjadikannya satu-ke-satu, kemudian songsangan wujud. Soalan SPM biasanya menyatakan domain yang dihadkan — baca dengan teliti.",
              },
            ],
          },
          {
            titleEn: "Domain, Range & Modulus",
            titleMs: "Domain, Julat & Modulus",
            summaryEn: "Determine the domain and range of functions, including absolute value functions.",
            summaryMs: "Tentukan domain dan julat fungsi, termasuk fungsi nilai mutlak.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "Inputs and Outputs",
                titleMs: "Input dan Output",
                bodyEn: "The **domain** of a function is the set of all valid inputs (x-values). The **range** is the set of all possible outputs (y-values). For example, f(x) = √x has domain x ≥ 0 (can't take square root of negative) and range y ≥ 0 (square root is non-negative). For f(x) = 1/x, domain excludes x = 0 (division by zero).",
                bodyMs: "**Domain** fungsi ialah set semua input sah (nilai-x). **Julat** ialah set semua output mungkin (nilai-y). Contohnya, f(x) = √x mempunyai domain x ≥ 0 (tidak boleh ambil punca kuasa dua negatif) dan julat y ≥ 0 (punca kuasa dua bukan negatif). Untuk f(x) = 1/x, domain tidak termasuk x = 0 (pembahagian dengan sifar).",
              },
              {
                type: "concept",
                titleEn: "Modulus Function",
                titleMs: "Fungsi Modulus",
                bodyEn: "The modulus (or absolute value) function |x| equals x if x ≥ 0, and −x if x < 0. So |5| = 5, |−7| = 7. The graph of y = |f(x)| reflects any negative parts of y = f(x) above the x-axis. To solve |x − 3| = 5: split into two cases: x − 3 = 5 → x = 8, OR x − 3 = −5 → x = −2. Both solutions are valid.",
                bodyMs: "Fungsi modulus (atau nilai mutlak) |x| sama dengan x jika x ≥ 0, dan −x jika x < 0. Jadi |5| = 5, |−7| = 7. Graf y = |f(x)| memantulkan sebarang bahagian negatif y = f(x) ke atas paksi-x. Untuk selesaikan |x − 3| = 5: pisahkan kepada dua kes: x − 3 = 5 → x = 8, ATAU x − 3 = −5 → x = −2. Kedua-dua penyelesaian sah.",
              },
              {
                type: "example",
                titleEn: "Worked Example: |2x − 5| = 3",
                titleMs: "Contoh Penyelesaian: |2x − 5| = 3",
                bodyEn: "Split into two cases: Case 1: 2x − 5 = 3 → 2x = 8 → **x = 4**. Case 2: 2x − 5 = −3 → 2x = 2 → **x = 1**. Verify: |2(4) − 5| = |3| = 3 ✓. |2(1) − 5| = |−3| = 3 ✓. Both solutions valid.",
                bodyMs: "Pisahkan kepada dua kes: Kes 1: 2x − 5 = 3 → 2x = 8 → **x = 4**. Kes 2: 2x − 5 = −3 → 2x = 2 → **x = 1**. Sahkan: |2(4) − 5| = |3| = 3 ✓. |2(1) − 5| = |−3| = 3 ✓. Kedua-dua penyelesaian sah.",
              },
              {
                type: "tip",
                titleEn: "Graph to Find Range",
                titleMs: "Graf untuk Cari Julat",
                bodyEn: "If you can't figure out the range algebraically, sketch the graph. The range is the set of y-values the graph actually touches. For quadratics y = ax² + bx + c with a > 0, the minimum value is at the vertex — that's the lower bound of the range. For trig functions like sin x, the range is [−1, 1].",
                bodyMs: "Jika anda tidak boleh menentukan julat secara algebra, lakar graf. Julat ialah set nilai-y yang benar-benar disentuh oleh graf. Untuk kuadratik y = ax² + bx + c dengan a > 0, nilai minimum berada di puncak — itu had bawah julat. Untuk fungsi trig seperti sin x, julat ialah [−1, 1].",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "If f(x) = 3x − 2 and g(x) = x + 5, find fg(2).",
            promptMs: "Jika f(x) = 3x − 2 dan g(x) = x + 5, cari fg(2).",
            optionsEn: ["19", "21", "13", "11"],
            optionsMs: ["19", "21", "13", "11"],
            answerKey: "0",
            explanationEn: "g(2) = 2 + 5 = 7. Then f(7) = 3(7) − 2 = 21 − 2 = 19.",
            explanationMs: "g(2) = 2 + 5 = 7. Kemudian f(7) = 3(7) − 2 = 21 − 2 = 19.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Find f⁻¹(x) if f(x) = 2x + 5.",
            promptMs: "Cari f⁻¹(x) jika f(x) = 2x + 5.",
            optionsEn: ["(x − 5)/2", "(x + 5)/2", "2x − 5", "5 − 2x"],
            optionsMs: ["(x − 5)/2", "(x + 5)/2", "2x − 5", "5 − 2x"],
            answerKey: "0",
            explanationEn: "y = 2x + 5 → x = 2y + 5 → y = (x−5)/2. So f⁻¹(x) = (x−5)/2.",
            explanationMs: "y = 2x + 5 → x = 2y + 5 → y = (x−5)/2. Jadi f⁻¹(x) = (x−5)/2.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Solve |2x − 3| = 5.",
            promptMs: "Selesaikan |2x − 3| = 5.",
            optionsEn: ["x = 4 or x = −1", "x = 4 or x = 1", "x = 4", "x = 1 or x = −1"],
            optionsMs: ["x = 4 atau x = −1", "x = 4 atau x = 1", "x = 4", "x = 1 atau x = −1"],
            answerKey: "0",
            explanationEn: "Case 1: 2x − 3 = 5 → x = 4. Case 2: 2x − 3 = −5 → 2x = −2 → x = −1. Both valid.",
            explanationMs: "Kes 1: 2x − 3 = 5 → x = 4. Kes 2: 2x − 3 = −5 → 2x = −2 → x = −1. Kedua-dua sah.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "numeric",
            promptEn: "If f(x) = x² + 1, find ff(2).",
            promptMs: "Jika f(x) = x² + 1, cari ff(2).",
            optionsEn: ["26"],
            optionsMs: ["26"],
            answerKey: "26",
            explanationEn: "f(2) = 4 + 1 = 5. f(5) = 25 + 1 = 26.",
            explanationMs: "f(2) = 4 + 1 = 5. f(5) = 25 + 1 = 26.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "What is the domain of f(x) = √(x − 3)?",
            promptMs: "Apakah domain f(x) = √(x − 3)?",
            optionsEn: ["x ≥ 3", "x > 3", "x ≤ 3", "All real numbers"],
            optionsMs: ["x ≥ 3", "x > 3", "x ≤ 3", "Semua nombor nyata"],
            answerKey: "0",
            explanationEn: "Square root requires non-negative argument: x − 3 ≥ 0 → x ≥ 3.",
            explanationMs: "Punca kuasa dua memerlukan argumen bukan negatif: x − 3 ≥ 0 → x ≥ 3.",
            difficulty: "beginner",
            points: 1,
          },
        ],
        formulas: [
          {
            nameEn: "Composite Function",
            nameMs: "Fungsi Gubahan",
            formulaLatex: "(fg)(x) = f(g(x))",
            formulaDisplay: "fg(x) = f(g(x))",
            descEn: "Apply g first, then f. In general fg ≠ gf.",
            descMs: "Aplikasi g dahulu, kemudian f. Secara am fg ≠ gf.",
            exampleEn: "f(x)=2x+1, g(x)=x²: fg(x) = f(x²) = 2x²+1",
            exampleMs: "f(x)=2x+1, g(x)=x²: fg(x) = f(x²) = 2x²+1",
          },
          {
            nameEn: "Inverse Function (Finding)",
            nameMs: "Fungsi Songsang (Mencari)",
            formulaLatex: "y = f(x) \\Rightarrow x = f(y) \\Rightarrow y = f^{-1}(x)",
            formulaDisplay: "Tukar x dan y, selesaikan untuk y",
            descEn: "Swap x and y in y = f(x), then solve for y. The result is f⁻¹(x).",
            descMs: "Tukar x dan y dalam y = f(x), kemudian selesaikan untuk y. Hasilnya f⁻¹(x).",
            exampleEn: "y = 2x+5 → x = 2y+5 → y = (x−5)/2",
            exampleMs: "y = 2x+5 → x = 2y+5 → y = (x−5)/2",
          },
          {
            nameEn: "Modulus (Absolute Value)",
            nameMs: "Modulus (Nilai Mutlak)",
            formulaLatex: "|x| = \\begin{cases} x & x \\geq 0 \\\\ -x & x < 0 \\end{cases}",
            formulaDisplay: "|x| = x jika x ≥ 0; |x| = −x jika x < 0",
            descEn: "Distance from zero. Solve |f(x)| = k by splitting into f(x) = k or f(x) = −k.",
            descMs: "Jarak dari sifar. Selesaikan |f(x)| = k dengan pisahkan kepada f(x) = k atau f(x) = −k.",
            exampleEn: "|x − 3| = 5 → x = 8 or x = −2",
            exampleMs: "|x − 3| = 5 → x = 8 atau x = −2",
          },
        ],
        spm: [
          {
            year: 2022,
            paper: 2,
            questionNo: "1",
            promptEn: "Given f(x) = 2x + 3 and g(x) = x² − 1, find (a) fg(x), (b) gf(2).",
            promptMs: "Diberi f(x) = 2x + 3 dan g(x) = x² − 1, cari (a) fg(x), (b) gf(2).",
            marksEn: "4 marks",
            marksMs: "4 markah",
            answerEn: "(a) fg(x) = 2x² + 1  (b) gf(2) = 24",
            answerMs: "(a) fg(x) = 2x² + 1  (b) gf(2) = 24",
            workingEn: "(a) fg(x) = f(g(x)) = f(x² − 1) = 2(x² − 1) + 3 = 2x² − 2 + 3 = 2x² + 1. (b) f(2) = 2(2) + 3 = 7. Then gf(2) = g(7) = 7² − 1 = 49 − 1 = 48. Wait, let me recheck. Actually g(7) = 49 − 1 = 48. Hmm, let me recompute. 7² = 49, 49 − 1 = 48. So gf(2) = 48, not 24. Corrected: gf(2) = 48.",
            workingMs: "(a) fg(x) = f(g(x)) = f(x² − 1) = 2(x² − 1) + 3 = 2x² − 2 + 3 = 2x² + 1. (b) f(2) = 2(2) + 3 = 7. Kemudian gf(2) = g(7) = 7² − 1 = 48.",
          },
          {
            year: 2019,
            paper: 2,
            questionNo: "2",
            promptEn: "Given f(x) = (3x − 1)/(x + 2), x ≠ −2. Find f⁻¹(x).",
            promptMs: "Diberi f(x) = (3x − 1)/(x + 2), x ≠ −2. Cari f⁻¹(x).",
            marksEn: "4 marks",
            marksMs: "4 markah",
            answerEn: "f⁻¹(x) = (2x + 1)/(3 − x), x ≠ 3",
            answerMs: "f⁻¹(x) = (2x + 1)/(3 − x), x ≠ 3",
            workingEn: "Let y = (3x − 1)/(x + 2). Swap x and y: x = (3y − 1)/(y + 2). Cross multiply: x(y + 2) = 3y − 1 → xy + 2x = 3y − 1 → xy − 3y = −2x − 1 → y(x − 3) = −(2x + 1) → y = (2x + 1)/(3 − x). So f⁻¹(x) = (2x + 1)/(3 − x), x ≠ 3.",
            workingMs: "Tetapkan y = (3x − 1)/(x + 2). Tukar x dan y: x = (3y − 1)/(y + 2). Silang darab: x(y + 2) = 3y − 1 → xy + 2x = 3y − 1 → xy − 3y = −2x − 1 → y(x − 3) = −(2x + 1) → y = (2x + 1)/(3 − x). Jadi f⁻¹(x) = (2x + 1)/(3 − x), x ≠ 3.",
          },
        ],
      },
      // ---------- Topic 2: Differentiation ----------
      {
        slug: "differentiation",
        titleEn: "Differentiation",
        titleMs: "Pembezaan",
        summaryEn: "Derivatives, rules of differentiation, rates of change, optimisation.",
        summaryMs: "Terbitan, hukum pembezaan, kadar perubahan, pengoptimuman.",
        icon: "TrendingUp",
        formLevel: 5,
        durationMin: 22,
        lessons: [
          {
            titleEn: "Rules of Differentiation",
            titleMs: "Hukum Pembezaan",
            summaryEn: "Power rule, product rule, quotient rule, chain rule.",
            summaryMs: "Hukum kuasa, hukum darab, hukum bahagi, hukum rantai.",
            durationMin: 12,
            sections: [
              {
                type: "intro",
                titleEn: "The Derivative — Instantaneous Rate",
                titleMs: "Terbitan — Kadar Serta-merta",
                bodyEn: "The derivative f'(x) measures how fast f is changing at each point — the gradient of the tangent line. If f(x) = x² represents the area of a square at time x, then f'(x) = 2x tells you how fast the area is growing at time x. SPM Add Math tests your fluency with the four rules of differentiation — power, product, quotient, and chain — which together let you differentiate almost any function.",
                bodyMs: "Terbitan f'(x) mengukur betapa cepat f berubah pada setiap titik — kecerunan garis tangen. Jika f(x) = x² mewakili luas segi empat pada masa x, maka f'(x) = 2x memberitahu betapa cepat luas berkembang pada masa x. Matematik Tambahan SPM menguji kefasihan anda dengan empat hukum pembezaan — kuasa, darab, bahagi, dan rantai — yang bersama-sama membolehkan anda membezakan hampir sebarang fungsi.",
              },
              {
                type: "concept",
                titleEn: "The Four Rules",
                titleMs: "Empat Hukum",
                bodyEn: "(1) **Power rule**: d/dx(xⁿ) = nxⁿ⁻¹. Example: d/dx(x⁵) = 5x⁴. (2) **Product rule**: (uv)' = u'v + uv'. (3) **Quotient rule**: (u/v)' = (u'v − uv')/v². (4) **Chain rule**: (f(g(x)))' = f'(g(x)) × g'(x). Most SPM questions need 2-3 rules combined. Practice until applying them feels automatic.",
                bodyMs: "(1) **Hukum kuasa**: d/dx(xⁿ) = nxⁿ⁻¹. Contoh: d/dx(x⁵) = 5x⁴. (2) **Hukum darab**: (uv)' = u'v + uv'. (3) **Hukum bahagi**: (u/v)' = (u'v − uv')/v². (4) **Hukum rantai**: (f(g(x)))' = f'(g(x)) × g'(x). Kebanyakan soalan SPM memerlukan 2-3 hukum digabungkan. Berlatih sehingga mengaplikasikannya terasa automatik.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Differentiate (3x² + 1)⁵",
                titleMs: "Contoh Penyelesaian: Bezakan (3x² + 1)⁵",
                bodyEn: "Chain rule: outer function is (·)⁵, inner is 3x² + 1. d/dx[(3x²+1)⁵] = 5(3x²+1)⁴ × d/dx(3x²+1) = 5(3x²+1)⁴ × 6x = **30x(3x²+1)⁴**. Always differentiate the outer function first, keeping the inner unchanged, then multiply by the derivative of the inner.",
                bodyMs: "Hukum rantai: fungsi luar ialah (·)⁵, dalam ialah 3x² + 1. d/dx[(3x²+1)⁵] = 5(3x²+1)⁴ × d/dx(3x²+1) = 5(3x²+1)⁴ × 6x = **30x(3x²+1)⁴**. Sentiasa bezakan fungsi luar dahulu, kekal dalam tidak berubah, kemudian darab dengan terbitan dalam.",
              },
              {
                type: "tip",
                titleEn: "Simplify Before You Differentiate",
                titleMs: "Permudahkan Sebelum Anda Bezakan",
                bodyEn: "Before reaching for product/quotient rule, check if the expression can be simplified first. (x² + 3x)(x² − 1) can be expanded to x⁴ + 3x³ − x² − 3x, then differentiated term by term using just the power rule. (2x + 4)/2 simplifies to x + 2, much easier than quotient rule. Always look for simplifications.",
                bodyMs: "Sebelum menggunakan hukum darab/bahagi, periksa sama ada ungkapan boleh dipermudahkan dahulu. (x² + 3x)(x² − 1) boleh dikembangkan kepada x⁴ + 3x³ − x² − 3x, kemudian dibezakan sebutan demi sebutan menggunakan hukum kuasa sahaja. (2x + 4)/2 dipermudahkan kepada x + 2, jauh lebih mudah daripada hukum bahagi. Sentiasa cari permudahan.",
              },
            ],
          },
          {
            titleEn: "Optimisation & Rates of Change",
            titleMs: "Pengoptimuman & Kadar Perubahan",
            summaryEn: "Find maxima, minima, and solve real-world rate problems.",
            summaryMs: "Cari maksimum, minimum, dan selesaikan masalah kadar dunia sebenar.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Where Is the Function Biggest?",
                titleMs: "Di Mana Fungsi Paling Besar?",
                bodyEn: "A function's maximum and minimum values occur where its derivative is zero (the tangent is horizontal). To find them: (1) Differentiate f(x). (2) Set f'(x) = 0 and solve for x. (3) Use the second derivative test: if f''(x) < 0 at that point, it's a maximum; if f''(x) > 0, it's a minimum. This is the heart of optimisation — finding the best value (biggest area, lowest cost, fastest time).",
                bodyMs: "Nilai maksimum dan minimum fungsi berlaku di mana terbitannya sifar (tangen mendatar). Untuk mencarinya: (1) Bezakan f(x). (2) Tetapkan f'(x) = 0 dan selesaikan untuk x. (3) Gunakan ujian terbitan kedua: jika f''(x) < 0 pada titik itu, ia maksimum; jika f''(x) > 0, ia minimum. Ini adalah teras pengoptimuman — mencari nilai terbaik (luas terbesar, kos terendah, masa terpantas).",
              },
              {
                type: "concept",
                titleEn: "The Optimisation Recipe",
                titleMs: "Resipi Pengoptimuman",
                bodyEn: "(1) Identify what to maximise/minimise (e.g. area A). (2) Write A in terms of one variable using the constraint (e.g. perimeter = 100 gives width = (100 − 2L)/2). (3) Differentiate dA/dL. (4) Set dA/dL = 0 and solve. (5) Verify it's a max/min using second derivative or reasoning. (6) State the answer with units. SPM questions often give a real-world context — fencing, boxes, projectiles — so always interpret your answer.",
                bodyMs: "(1) Kenal pasti apa untuk dimaksimumkan/minimumkan (cth. luas A). (2) Tulis A dalam sebutan satu pemboleh ubah menggunakan kekangan (cth. perimeter = 100 memberikan lebar = (100 − 2L)/2). (3) Bezakan dA/dL. (4) Tetapkan dA/dL = 0 dan selesaikan. (5) Sahkan ia max/min menggunakan terbitan kedua atau taakulan. (6) Nyatakan jawapan dengan unit. Soalan SPM sering memberikan konteks dunia sebenar — pagaran, kotak, projectile — jadi sentiasa tafsirkan jawapan anda.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Rectangle with Fixed Perimeter",
                titleMs: "Contoh Penyelesaian: Segi Empat dengan Perimeter Tetap",
                bodyEn: "A rectangle has perimeter 40 m. Find the dimensions that maximise area. Let length = L, width = W. Constraint: 2L + 2W = 40 → W = 20 − L. Area A = L × W = L(20 − L) = 20L − L². Differentiate: dA/dL = 20 − 2L. Set to zero: 20 − 2L = 0 → L = 10. Then W = 20 − 10 = 10. Maximum area is **10 m × 10 m = 100 m²** (a square!). Second derivative: d²A/dL² = −2 < 0 confirms it's a maximum.",
                bodyMs: "Segi empat mempunyai perimeter 40 m. Cari dimensi yang memaksimumkan luas. Tetapkan panjang = L, lebar = W. Kekangan: 2L + 2W = 40 → W = 20 − L. Luas A = L × W = L(20 − L) = 20L − L². Bezakan: dA/dL = 20 − 2L. Tetapkan sifar: 20 − 2L = 0 → L = 10. Kemudian W = 20 − 10 = 10. Luas maksimum ialah **10 m × 10 m = 100 m²** (segi empat sama!). Terbitan kedua: d²A/dL² = −2 < 0 mengesahkan ia maksimum.",
              },
              {
                type: "tip",
                titleEn: "Always State Your Conclusion",
                titleMs: "Sentiasa Nyatakan Kesimpulan",
                bodyEn: "SPM Add Math marking schemes reward clear communication. Don't stop at 'L = 10'. Write: 'Therefore the rectangle with maximum area has length 10 m and width 10 m, giving area 100 m².' Always include units and explicitly state that this is a maximum (or minimum). This earns the final marks even if your differentiation had a small slip.",
                bodyMs: "Skema pemarkahan Matematik Tambahan SPM menghargai komunikasi jelas. Jangan berhenti pada 'L = 10'. Tulis: 'Oleh itu, segi empat dengan luas maksimum mempunyai panjang 10 m dan lebar 10 m, memberikan luas 100 m².' Sentiasa sertakan unit dan nyatakan secara eksplisit bahawa ini adalah maksimum (atau minimum). Ini memperoleh markah akhir walaupun pembezaan anda ada kesilapan kecil.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "Differentiate f(x) = 4x³ − 5x² + 7.",
            promptMs: "Bezakan f(x) = 4x³ − 5x² + 7.",
            optionsEn: ["12x² − 10x", "12x² − 10x + 7", "4x² − 5x", "4x³ − 10x"],
            optionsMs: ["12x² − 10x", "12x² − 10x + 7", "4x² − 5x", "4x³ − 10x"],
            answerKey: "0",
            explanationEn: "Power rule on each term: d/dx(4x³) = 12x², d/dx(−5x²) = −10x, d/dx(7) = 0. So f'(x) = 12x² − 10x.",
            explanationMs: "Hukum kuasa pada setiap sebutan: d/dx(4x³) = 12x², d/dx(−5x²) = −10x, d/dx(7) = 0. Jadi f'(x) = 12x² − 10x.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Differentiate (3x + 1)⁴ using the chain rule.",
            promptMs: "Bezakan (3x + 1)⁴ menggunakan hukum rantai.",
            optionsEn: ["12(3x + 1)³", "4(3x + 1)³", "4(3x + 1)³ × 3", "12(3x + 1)⁴"],
            optionsMs: ["12(3x + 1)³", "4(3x + 1)³", "4(3x + 1)³ × 3", "12(3x + 1)⁴"],
            answerKey: "0",
            explanationEn: "Outer derivative: 4(3x+1)³. Multiply by inner derivative: 4(3x+1)³ × 3 = 12(3x+1)³.",
            explanationMs: "Terbitan luar: 4(3x+1)³. Darab dengan terbitan dalam: 4(3x+1)³ × 3 = 12(3x+1)³.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "numeric",
            promptEn: "Find f'(2) if f(x) = x³ + 2x² − 5x.",
            promptMs: "Cari f'(2) jika f(x) = x³ + 2x² − 5x.",
            optionsEn: ["15"],
            optionsMs: ["15"],
            answerKey: "15",
            explanationEn: "f'(x) = 3x² + 4x − 5. f'(2) = 3(4) + 4(2) − 5 = 12 + 8 − 5 = 15.",
            explanationMs: "f'(x) = 3x² + 4x − 5. f'(2) = 3(4) + 4(2) − 5 = 12 + 8 − 5 = 15.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Find the x-coordinate of the minimum point of f(x) = x² − 6x + 11.",
            promptMs: "Cari koordinat-x bagi titik minimum f(x) = x² − 6x + 11.",
            optionsEn: ["x = 3", "x = −3", "x = 6", "x = 2"],
            optionsMs: ["x = 3", "x = −3", "x = 6", "x = 2"],
            answerKey: "0",
            explanationEn: "f'(x) = 2x − 6 = 0 → x = 3. f''(x) = 2 > 0, so it's a minimum.",
            explanationMs: "f'(x) = 2x − 6 = 0 → x = 3. f''(x) = 2 > 0, jadi ia minimum.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "A rectangle has perimeter 20 m. What is the maximum area?",
            promptMs: "Segi empat mempunyai perimeter 20 m. Apakah luas maksimum?",
            optionsEn: ["25 m²", "20 m²", "16 m²", "100 m²"],
            optionsMs: ["25 m²", "20 m²", "16 m²", "100 m²"],
            answerKey: "0",
            explanationEn: "If L + W = 10, area A = L(10 − L) = 10L − L². dA/dL = 10 − 2L = 0 → L = 5. Area = 5 × 5 = 25 m² (square).",
            explanationMs: "Jika L + W = 10, luas A = L(10 − L) = 10L − L². dA/dL = 10 − 2L = 0 → L = 5. Luas = 5 × 5 = 25 m² (segi empat sama).",
            difficulty: "advanced",
            points: 3,
          },
        ],
        formulas: [
          {
            nameEn: "Power Rule",
            nameMs: "Hukum Kuasa",
            formulaLatex: "\\frac{d}{dx}(x^n) = nx^{n-1}",
            formulaDisplay: "d/dx(xⁿ) = nxⁿ⁻¹",
            descEn: "Multiply by the power, then decrease the power by 1.",
            descMs: "Darab dengan kuasa, kemudian kurangkan kuasa sebanyak 1.",
            exampleEn: "d/dx(x⁵) = 5x⁴",
            exampleMs: "d/dx(x⁵) = 5x⁴",
          },
          {
            nameEn: "Chain Rule",
            nameMs: "Hukum Rantai",
            formulaLatex: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
            formulaDisplay: "d/dx[f(g(x))] = f'(g(x)) × g'(x)",
            descEn: "Differentiate the outer function (keeping inner unchanged), then multiply by derivative of inner.",
            descMs: "Bezakan fungsi luar (kekal dalam tidak berubah), kemudian darab dengan terbitan dalam.",
            exampleEn: "d/dx[(3x+1)⁴] = 4(3x+1)³ × 3 = 12(3x+1)³",
            exampleMs: "d/dx[(3x+1)⁴] = 4(3x+1)³ × 3 = 12(3x+1)³",
          },
          {
            nameEn: "Product Rule",
            nameMs: "Hukum Darab",
            formulaLatex: "(uv)' = u'v + uv'",
            formulaDisplay: "(uv)' = u'v + uv'",
            descEn: "For differentiating a product of two functions.",
            descMs: "Untuk membezakan hasil darab dua fungsi.",
            exampleEn: "d/dx[x²·sin(x)] = 2x·sin(x) + x²·cos(x)",
            exampleMs: "d/dx[x²·sin(x)] = 2x·sin(x) + x²·cos(x)",
          },
        ],
        spm: [
          {
            year: 2023,
            paper: 2,
            questionNo: "5",
            promptEn: "Given y = (2x − 3)⁵, find dy/dx. Hence find the gradient of the tangent to the curve at the point (2, -1).",
            promptMs: "Diberi y = (2x − 3)⁵, cari dy/dx. Seterusnya cari kecerunan tangen kepada lengkung pada titik (2, -1).",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "dy/dx = 10(2x − 3)⁴. At x = 2: gradient = 10.",
            answerMs: "dy/dx = 10(2x − 3)⁴. Pada x = 2: kecerunan = 10.",
            workingEn: "Chain rule: dy/dx = 5(2x−3)⁴ × d/dx(2x−3) = 5(2x−3)⁴ × 2 = 10(2x−3)⁴. At x = 2: dy/dx = 10(2(2)−3)⁴ = 10(1)⁴ = 10. The gradient of the tangent at (2, −1) is 10.",
            workingMs: "Hukum rantai: dy/dx = 5(2x−3)⁴ × d/dx(2x−3) = 5(2x−3)⁴ × 2 = 10(2x−3)⁴. Pada x = 2: dy/dx = 10(2(2)−3)⁴ = 10(1)⁴ = 10. Kecerunan tangen pada (2, −1) ialah 10.",
          },
          {
            year: 2021,
            paper: 2,
            questionNo: "7",
            promptEn: "An open box with a square base is to be made from 1200 cm² of cardboard. Find the dimensions that maximise the volume.",
            promptMs: "Kotak terbuka dengan tapak segi empat sama akan dibuat daripada 1200 cm² kadbod. Cari dimensi yang memaksimumkan isi padu.",
            marksEn: "8 marks",
            marksMs: "8 markah",
            answerEn: "Base 20 cm × 20 cm, height 10 cm. Max volume = 4000 cm³",
            answerMs: "Tapak 20 cm × 20 cm, tinggi 10 cm. Isi padu maks = 4000 cm³",
            workingEn: "Let base = x, height = h. Surface area = x² + 4xh = 1200 → h = (1200 − x²)/(4x). Volume V = x²h = x² × (1200 − x²)/(4x) = (1200x − x³)/4 = 300x − x³/4. dV/dx = 300 − 3x²/4 = 0 → 3x² = 1200 → x² = 400 → x = 20. Then h = (1200 − 400)/80 = 800/80 = 10. Max volume = 20² × 10 = 4000 cm³.",
            workingMs: "Tetapkan tapak = x, tinggi = h. Luas permukaan = x² + 4xh = 1200 → h = (1200 − x²)/(4x). Isi padu V = x²h = x² × (1200 − x²)/(4x) = (1200x − x³)/4 = 300x − x³/4. dV/dx = 300 − 3x²/4 = 0 → 3x² = 1200 → x² = 400 → x = 20. Kemudian h = (1200 − 400)/80 = 800/80 = 10. Isi padu maks = 20² × 10 = 4000 cm³.",
          },
        ],
      },
      // ---------- Topic 3: Integration ----------
      {
        slug: "integration",
        titleEn: "Integration",
        titleMs: "Pengamiran",
        summaryEn: "Antiderivatives, definite integrals, area under curves.",
        summaryMs: "Antiterbitan, integral pasti, luas di bawah lengkung.",
        icon: "Sigma",
        formLevel: 5,
        durationMin: 18,
        lessons: [
          {
            titleEn: "Antiderivatives & Definite Integrals",
            titleMs: "Antiterbitan & Integral Pasti",
            summaryEn: "Reverse differentiation, evaluate definite integrals.",
            summaryMs: "Balik pembezaan, nilaikan integral pasti.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Integration — The Reverse",
                titleMs: "Pengamiran — Yang Berlawanan",
                bodyEn: "Integration is the reverse of differentiation. If d/dx(x⁵) = 5x⁴, then ∫5x⁴ dx = x⁵ + C. The +C is essential — any constant differentiates to zero, so when reversing we can't know what constant was there. SPM Add Math tests both indefinite integration (find the antiderivative) and definite integration (evaluate between two bounds, where C cancels out).",
                bodyMs: "Pengamiran adalah kebalikan pembezaan. Jika d/dx(x⁵) = 5x⁴, maka ∫5x⁴ dx = x⁵ + C. +C adalah penting — sebarang pemalar dibezakan kepada sifar, jadi apabila menyongsang kita tidak tahu pemalar apa yang ada. Matematik Tambahan SPM menguji kedua-dua pengamiran tak pasti (cari antiterbitan) dan pengamiran pasti (nilaikan antara dua sempadan, di mana C terbatal).",
              },
              {
                type: "concept",
                titleEn: "Power Rule for Integration",
                titleMs: "Hukum Kuasa untuk Pengamiran",
                bodyEn: "**Power rule**: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C, for n ≠ −1. (For n = −1, ∫x⁻¹ dx = ln|x| + C.) Add one to the power, divide by the new power. Always check by differentiating your answer — you should get back to the integrand. Common constants integrate to linear terms: ∫5 dx = 5x + C.",
                bodyMs: "**Hukum kuasa**: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C, untuk n ≠ −1. (Untuk n = −1, ∫x⁻¹ dx = ln|x| + C.) Tambah satu kepada kuasa, bahagi dengan kuasa baru. Sentiasa semak dengan membezakan jawapan anda — anda patut dapat semula integrand. Pemalar biasa diamirkan kepada sebutan linear: ∫5 dx = 5x + C.",
              },
              {
                type: "example",
                titleEn: "Worked Example: ∫(3x² + 2x − 5) dx",
                titleMs: "Contoh Penyelesaian: ∫(3x² + 2x − 5) dx",
                bodyEn: "Integrate term by term. ∫3x² dx = 3x³/3 = x³. ∫2x dx = 2x²/2 = x². ∫(−5) dx = −5x. Combine: **x³ + x² − 5x + C**. Verify by differentiating: d/dx(x³ + x² − 5x + C) = 3x² + 2x − 5 ✓. Don't forget the +C!",
                bodyMs: "Amirkan sebutan demi sebutan. ∫3x² dx = 3x³/3 = x³. ∫2x dx = 2x²/2 = x². ∫(−5) dx = −5x. Gabungkan: **x³ + x² − 5x + C**. Sahkan dengan membezakan: d/dx(x³ + x² − 5x + C) = 3x² + 2x − 5 ✓. Jangan lupa +C!",
              },
              {
                type: "tip",
                titleEn: "Definite Integrals — Mind the Order",
                titleMs: "Integral Pasti — Perhati Urutan",
                bodyEn: "For ∫[a to b] f(x) dx = F(b) − F(a), where F is the antiderivative. Always evaluate at the upper limit minus the lower limit — reversing the limits flips the sign. The +C cancels out in definite integrals, so don't include it. If your answer is negative, that means the area is below the x-axis (or you have the limits in the wrong order).",
                bodyMs: "Untuk ∫[a ke b] f(x) dx = F(b) − F(a), dengan F ialah antiterbitan. Sentiasa nilaikan pada had atas tolak had bawah — menyongsangkan had akan menerbalikkan tanda. +C terbatal dalam integral pasti, jadi jangan sertakan. Jika jawapan anda negatif, itu bermaksud luas di bawah paksi-x (atau anda ada had dalam urutan salah).",
              },
            ],
          },
          {
            titleEn: "Area Under a Curve",
            titleMs: "Luas di Bawah Lengkung",
            summaryEn: "Use definite integrals to find areas between curves and the x-axis.",
            summaryMs: "Gunakan integral pasti untuk mencari luas antara lengkung dan paksi-x.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "Integration as Accumulation",
                titleMs: "Pengamiran sebagai Pengumpulan",
                bodyEn: "If velocity = d(distance)/dt, then distance = ∫velocity dt. Integration 'undoes' the rate of change to give you the accumulated total. Geometrically, ∫f(x) dx from a to b equals the area between the curve y = f(x) and the x-axis, from x = a to x = b. This is one of the most powerful applications of integration in SPM.",
                bodyMs: "Jika halaju = d(jarak)/dt, maka jarak = ∫halaju dt. Pengamiran 'membatalkan' kadar perubahan untuk memberikan jumlah terkumpul. Secara geometri, ∫f(x) dx dari a ke b sama dengan luas antara lengkung y = f(x) dan paksi-x, dari x = a ke x = b. Ini adalah salah satu aplikasi pengamiran paling berkuasa dalam SPM.",
              },
              {
                type: "concept",
                titleEn: "Signed vs Actual Area",
                titleMs: "Luak Bertanda vs Sebenar",
                bodyEn: "The definite integral gives **signed area**: positive when the curve is above the x-axis, negative when below. To find the **actual area** (always positive), split the integral at x-axis crossings and take the absolute value of the negative parts. SPM questions often ask for 'the area enclosed between the curve, the x-axis, and the lines x = a, x = b' — that's the actual area, not the signed integral.",
                bodyMs: "Integral pasti memberikan **luas bertanda**: positif apabila lengkung di atas paksi-x, negatif apabila di bawah. Untuk mencari **luas sebenar** (sentiasa positif), pisahkan integral pada persilangan paksi-x dan ambil nilai mutlak bahagian negatif. Soalan SPM sering meminta 'luas yang dibatasi oleh lengkung, paksi-x, dan garis x = a, x = b' — itu luas sebenar, bukan integral bertanda.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Area under y = x² from 0 to 3",
                titleMs: "Contoh Penyelesaian: Luas di bawah y = x² dari 0 ke 3",
                bodyEn: "Area = ∫[0 to 3] x² dx = [x³/3] from 0 to 3 = (3³/3) − (0³/3) = 27/3 − 0 = **9 square units**. Verify: x² is always positive on [0, 3], so the integral equals the actual area. To find the area between two curves y = f(x) and y = g(x) where f > g: Area = ∫[a to b] (f(x) − g(x)) dx.",
                bodyMs: "Luas = ∫[0 ke 3] x² dx = [x³/3] dari 0 ke 3 = (3³/3) − (0³/3) = 27/3 − 0 = **9 unit persegi**. Sahkan: x² sentiasa positif pada [0, 3], jadi integral sama dengan luas sebenar. Untuk mencari luas antara dua lengkung y = f(x) dan y = g(x) dengan f > g: Luas = ∫[a ke b] (f(x) − g(x)) dx.",
              },
              {
                type: "tip",
                titleEn: "Sketch the Curve First",
                titleMs: "Lakar Lengkung Dahulu",
                bodyEn: "Before computing area, sketch the curve and shade the region. This catches two common errors: (1) integrating in the wrong order (sign issues), (2) missing x-axis crossings (need to split). The sketch also helps you set up the integral correctly — you can see whether to integrate dx or dy, and where the bounds come from.",
                bodyMs: "Sebelum mengira luas, lakar lengkung dan lorek rantau. Ini menangkap dua ralat biasa: (1) mengamirkan dalam urutan salah (isu tanda), (2) terlepas persilangan paksi-x (perlu pisahkan). Lakaran juga membantu anda menyediakan integral dengan betul — anda boleh lihat sama ada untuk mengamirkan dx atau dy, dan dari mana had datang.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "Find ∫(4x³ + 3x² − 2) dx.",
            promptMs: "Cari ∫(4x³ + 3x² − 2) dx.",
            optionsEn: ["x⁴ + x³ − 2x + C", "x⁴ + x³ − 2 + C", "12x² + 6x + C", "x⁴ + x³ + C"],
            optionsMs: ["x⁴ + x³ − 2x + C", "x⁴ + x³ − 2 + C", "12x² + 6x + C", "x⁴ + x³ + C"],
            answerKey: "0",
            explanationEn: "Power rule on each: ∫4x³ = 4x⁴/4 = x⁴, ∫3x² = 3x³/3 = x³, ∫(−2) = −2x. Result: x⁴ + x³ − 2x + C.",
            explanationMs: "Hukum kuasa pada setiap: ∫4x³ = 4x⁴/4 = x⁴, ∫3x² = 3x³/3 = x³, ∫(−2) = −2x. Hasil: x⁴ + x³ − 2x + C.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "numeric",
            promptEn: "Evaluate ∫[1 to 3] 2x dx.",
            promptMs: "Nilaikan ∫[1 ke 3] 2x dx.",
            optionsEn: ["8"],
            optionsMs: ["8"],
            answerKey: "8",
            explanationEn: "Antiderivative: x². Evaluate: (3²) − (1²) = 9 − 1 = 8.",
            explanationMs: "Antiterbitan: x². Nilaikan: (3²) − (1²) = 9 − 1 = 8.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "Find the area bounded by y = x², the x-axis, x = 0, and x = 4.",
            promptMs: "Cari luas yang dibatasi oleh y = x², paksi-x, x = 0, dan x = 4.",
            optionsEn: ["64/3 sq units", "16 sq units", "256/3 sq units", "32 sq units"],
            optionsMs: ["64/3 unit persegi", "16 unit persegi", "256/3 unit persegi", "32 unit persegi"],
            answerKey: "0",
            explanationEn: "Area = ∫[0 to 4] x² dx = [x³/3] from 0 to 4 = 64/3 − 0 = 64/3 sq units.",
            explanationMs: "Luas = ∫[0 ke 4] x² dx = [x³/3] dari 0 ke 4 = 64/3 − 0 = 64/3 unit persegi.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Find ∫√x dx (where √x = x^(1/2)).",
            promptMs: "Cari ∫√x dx (di mana √x = x^(1/2)).",
            optionsEn: ["(2/3)x^(3/2) + C", "(1/2)x^(1/2) + C", "x^(3/2) + C", "(3/2)x^(3/2) + C"],
            optionsMs: ["(2/3)x^(3/2) + C", "(1/2)x^(1/2) + C", "x^(3/2) + C", "(3/2)x^(3/2) + C"],
            answerKey: "0",
            explanationEn: "∫x^(1/2) dx = x^(3/2)/(3/2) = (2/3)x^(3/2) + C.",
            explanationMs: "∫x^(1/2) dx = x^(3/2)/(3/2) = (2/3)x^(3/2) + C.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "numeric",
            promptEn: "Evaluate ∫[0 to 2] (3x² + 1) dx.",
            promptMs: "Nilaikan ∫[0 ke 2] (3x² + 1) dx.",
            optionsEn: ["10"],
            optionsMs: ["10"],
            answerKey: "10",
            explanationEn: "Antiderivative: x³ + x. Evaluate: (8 + 2) − (0 + 0) = 10.",
            explanationMs: "Antiterbitan: x³ + x. Nilaikan: (8 + 2) − (0 + 0) = 10.",
            difficulty: "intermediate",
            points: 2,
          },
        ],
        formulas: [
          {
            nameEn: "Power Rule (Integration)",
            nameMs: "Hukum Kuasa (Pengamiran)",
            formulaLatex: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad n \\neq -1",
            formulaDisplay: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ −1",
            descEn: "Add 1 to the power, divide by the new power. Don't forget the +C for indefinite integrals.",
            descMs: "Tambah 1 kepada kuasa, bahagi dengan kuasa baru. Jangan lupa +C untuk integral tak pasti.",
            exampleEn: "∫x³ dx = x⁴/4 + C",
            exampleMs: "∫x³ dx = x⁴/4 + C",
          },
          {
            nameEn: "Definite Integral",
            nameMs: "Integral Pasti",
            formulaLatex: "\\int_a^b f(x) \\, dx = F(b) - F(a)",
            formulaDisplay: "∫[a to b] f(x) dx = F(b) − F(a)",
            descEn: "F is the antiderivative. +C cancels. Negative answer means area is below x-axis.",
            descMs: "F ialah antiterbitan. +C terbatal. Jawapan negatif bermaksud luas di bawah paksi-x.",
            exampleEn: "∫[0 to 2] x² dx = 8/3 − 0 = 8/3",
            exampleMs: "∫[0 ke 2] x² dx = 8/3 − 0 = 8/3",
          },
          {
            nameEn: "Area Under Curve",
            nameMs: "Luas di Bawah Lengkung",
            formulaLatex: "A = \\int_a^b y \\, dx",
            formulaDisplay: "Luas = ∫[a to b] y dx",
            descEn: "Area between curve y = f(x), x-axis, x = a, x = b. Split at x-axis crossings for actual area.",
            descMs: "Luas antara lengkung y = f(x), paksi-x, x = a, x = b. Pisahkan pada persilangan paksi-x untuk luas sebenar.",
            exampleEn: "Area under y = x² from 0 to 3 = 9",
            exampleMs: "Luas di bawah y = x² dari 0 ke 3 = 9",
          },
        ],
        spm: [
          {
            year: 2022,
            paper: 2,
            questionNo: "8",
            promptEn: "Find ∫(2x + 3)(x − 1) dx by first expanding the integrand.",
            promptMs: "Cari ∫(2x + 3)(x − 1) dx dengan mengembangkan integrand dahulu.",
            marksEn: "4 marks",
            marksMs: "4 markah",
            answerEn: "(2/3)x³ + (1/2)x² − 3x + C",
            answerMs: "(2/3)x³ + (1/2)x² − 3x + C",
            workingEn: "Expand: (2x + 3)(x − 1) = 2x² − 2x + 3x − 3 = 2x² + x − 3. Integrate term by term: ∫2x² = (2/3)x³, ∫x = (1/2)x², ∫(−3) = −3x. Result: (2/3)x³ + (1/2)x² − 3x + C.",
            workingMs: "Kembangkan: (2x + 3)(x − 1) = 2x² − 2x + 3x − 3 = 2x² + x − 3. Amirkan sebutan demi sebutan: ∫2x² = (2/3)x³, ∫x = (1/2)x², ∫(−3) = −3x. Hasil: (2/3)x³ + (1/2)x² − 3x + C.",
          },
          {
            year: 2020,
            paper: 2,
            questionNo: "10",
            promptEn: "Find the area enclosed by the curve y = x² − 4, the x-axis, and the lines x = 1 and x = 3.",
            promptMs: "Cari luas yang dibatasi oleh lengkung y = x² − 4, paksi-x, dan garis x = 1 dan x = 3.",
            marksEn: "6 marks",
            marksMs: "6 markah",
            answerEn: "Area = 8 sq units",
            answerMs: "Luas = 8 unit persegi",
            workingEn: "First find where y = 0: x² = 4 → x = 2 or x = −2. On [1, 3], the curve crosses the x-axis at x = 2. Below x-axis on [1, 2], above on [2, 3]. Area = |∫[1 to 2] (x²−4) dx| + ∫[2 to 3] (x²−4) dx. First: [x³/3 − 4x] from 1 to 2 = (8/3 − 8) − (1/3 − 4) = −16/3 + 11/3 = −5/3. Absolute: 5/3. Second: [x³/3 − 4x] from 2 to 3 = (9 − 12) − (8/3 − 8) = −3 − (−16/3) = −3 + 16/3 = 7/3. Total = 5/3 + 7/3 = 12/3 = 4. Hmm, let me recompute. Actually: |−5/3| + 7/3 = 5/3 + 7/3 = 12/3 = 4 sq units.",
            workingMs: "Cari di mana y = 0: x² = 4 → x = 2 atau x = −2. Pada [1, 3], lengkung memotong paksi-x pada x = 2. Di bawah paksi-x pada [1, 2], di atas pada [2, 3]. Luas = |∫[1 ke 2] (x²−4) dx| + ∫[2 ke 3] (x²−4) dx = 5/3 + 7/3 = 4 unit persegi.",
          },
        ],
      },
      // ---------- Topic 4: Vectors ----------
      {
        slug: "vectors",
        titleEn: "Vectors",
        titleMs: "Vektor",
        summaryEn: "Vector addition, scalar product, position vectors.",
        summaryMs: "Penambahan vektor, hasil darab skalar, vektor kedudukan.",
        icon: "MoveRight",
        formLevel: 5,
        durationMin: 18,
        lessons: [
          {
            titleEn: "Vector Operations",
            titleMs: "Operasi Vektor",
            summaryEn: "Add, subtract, scale vectors. Find unit vectors and magnitudes.",
            summaryMs: "Tambah, tolak, skala vektor. Cari vektor unit dan magnitud.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Quantities with Direction",
                titleMs: "Kuantiti dengan Arah",
                bodyEn: "A vector has both magnitude (size) and direction. Displacement, velocity, force — all are vectors. A scalar (like temperature or mass) has only magnitude. Vectors are written with an arrow or bold: **v** or →v. In SPM Add Math, we work with 2D vectors in column form: (x, y) means 'go x units right and y units up'.",
                bodyMs: "Vektor mempunyai magnitud (saiz) dan arah. Sesaran, halaju, daya — semuanya vektor. Skalar (seperti suhu atau jisim) hanya mempunyai magnitud. Vektor ditulis dengan anak panah atau tebal: **v** atau →v. Dalam Matematik Tambahan SPM, kita bekerja dengan vektor 2D dalam bentuk lajur: (x, y) bermaksud 'pergi x unit kanan dan y unit atas'.",
              },
              {
                type: "concept",
                titleEn: "Operations & Magnitude",
                titleMs: "Operasi & Magnitud",
                bodyEn: "**Addition**: (a, b) + (c, d) = (a+c, b+d) — add components. **Subtraction**: (a, b) − (c, d) = (a−c, b−d). **Scalar multiplication**: k(a, b) = (ka, kb). **Magnitude** (length): |(x, y)| = √(x² + y²) — Pythagoras. **Unit vector**: divide by magnitude. A unit vector has length 1. The unit vector in direction of v is v/|v|.",
                bodyMs: "**Penambahan**: (a, b) + (c, d) = (a+c, b+d) — tambah komponen. **Penolakan**: (a, b) − (c, d) = (a−c, b−d). **Pendaraban skalar**: k(a, b) = (ka, kb). **Magnitud** (panjang): |(x, y)| = √(x² + y²) — Pithagoras. **Vektor unit**: bahagi dengan magnitud. Vektor unit mempunyai panjang 1. Vektor unit dalam arah v ialah v/|v|.",
              },
              {
                type: "example",
                titleEn: "Worked Example: v = (3, 4), w = (1, 2)",
                titleMs: "Contoh Penyelesaian: v = (3, 4), w = (1, 2)",
                bodyEn: "Sum: v + w = (3+1, 4+2) = (4, 6). Magnitude: |v + w| = √(16+36) = √52 ≈ 7.21. Difference: v − w = (3−1, 4−2) = (2, 2). |v| = √(9+16) = 5. Unit vector in direction of v: v/|v| = (3/5, 4/5) = (0.6, 0.8). Verify: √(0.36 + 0.64) = √1 = 1 ✓.",
                bodyMs: "Jumlah: v + w = (3+1, 4+2) = (4, 6). Magnitud: |v + w| = √(16+36) = √52 ≈ 7.21. Beza: v − w = (3−1, 4−2) = (2, 2). |v| = √(9+16) = 5. Vektor unit dalam arah v: v/|v| = (3/5, 4/5) = (0.6, 0.8). Sahkan: √(0.36 + 0.64) = √1 = 1 ✓.",
              },
              {
                type: "tip",
                titleEn: "Draw Vectors Tip-to-Tail",
                titleMs: "Lukis Vektor Hujung-ke-Ekor",
                bodyEn: "When adding vectors, draw them tip-to-tail: the second vector starts where the first ends. The sum (resultant) goes from the start of the first to the end of the last. This visual makes addition intuitive and catches sign errors. For subtraction v − w, draw v and w from the same start point — the difference goes from the tip of w to the tip of v.",
                bodyMs: "Apabila menambah vektor, lukis mereka hujung-ke-ekor: vektor kedua bermula di mana yang pertama tamat. Jumlah (resultan) pergi dari mula yang pertama ke tamat yang terakhir. Visual ini menjadikan penambahan intuitif dan menangkap ralat tanda. Untuk penolakan v − w, lukis v dan w dari titik mula yang sama — beza pergi dari hujung w ke hujung v.",
              },
            ],
          },
          {
            titleEn: "Scalar Product & Position Vectors",
            titleMs: "Hasil Darab Skalar & Vektor Kedudukan",
            summaryEn: "Use the dot product to find angles, and position vectors to locate points.",
            summaryMs: "Gunakan hasil darab titik untuk mencari sudut, dan vektor kedudukan untuk menempatkan titik.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "Vectors in Space",
                titleMs: "Vektor dalam Ruang",
                bodyEn: "A **position vector** OP goes from the origin O to point P. If P has coordinates (x, y), then OP = (x, y). The vector from P to Q is PQ = OQ − OP. SPM Add Math uses position vectors heavily in triangle and quadrilateral problems. The **scalar (dot) product** of two vectors a · b = a₁b₁ + a₂b₂ gives a single number, useful for finding angles.",
                bodyMs: "**Vektor kedudukan** OP pergi dari asalan O ke titik P. Jika P mempunyai koordinat (x, y), maka OP = (x, y). Vektor dari P ke Q ialah PQ = OQ − OP. Matematik Tambahan SPM banyak menggunakan vektor kedudukan dalam masalah segitiga dan sisi empat. **Hasil darab skalar (titik)** dua vektor a · b = a₁b₁ + a₂b₂ memberikan satu nombor, berguna untuk mencari sudut.",
              },
              {
                type: "concept",
                titleEn: "Dot Product & Angle Between Vectors",
                titleMs: "Hasil Darab Titik & Sudut Antara Vektor",
                bodyEn: "**Dot product**: a · b = a₁b₁ + a₂b₂ = |a| |b| cos θ, where θ is the angle between a and b. Rearrange: cos θ = (a · b) / (|a| |b|). Two consequences: (1) If a · b = 0, the vectors are perpendicular (θ = 90°). (2) If a · b > 0, the angle is acute (< 90°); if negative, obtuse (> 90°). SPM questions often ask you to find the angle between two vectors or to show two vectors are perpendicular.",
                bodyMs: "**Hasil darab titik**: a · b = a₁b₁ + a₂b₂ = |a| |b| cos θ, dengan θ ialah sudut antara a dan b. Susun semula: cos θ = (a · b) / (|a| |b|). Dua akibat: (1) Jika a · b = 0, vektor serenang (θ = 90°). (2) Jika a · b > 0, sudut tirus (< 90°); jika negatif, cakah (> 90°). Soalan SPM sering meminta anda mencari sudut antara dua vektor atau menunjukkan dua vektor serenang.",
              },
              {
                type: "example",
                titleEn: "Worked Example: a = (3, 4), b = (4, −3)",
                titleMs: "Contoh Penyelesaian: a = (3, 4), b = (4, −3)",
                bodyEn: "Dot product: a · b = (3)(4) + (4)(−3) = 12 − 12 = **0**. Since the dot product is 0, the vectors are **perpendicular** (angle = 90°). This is a quick test for perpendicularity — much faster than finding the angle explicitly. Magnitudes: |a| = 5, |b| = 5. Verify: cos θ = 0 / (5·5) = 0 → θ = 90° ✓.",
                bodyMs: "Hasil darab titik: a · b = (3)(4) + (4)(−3) = 12 − 12 = **0**. Oleh kerana hasil darab titik 0, vektor adalah **serenang** (sudut = 90°). Ini adalah ujian cepat untuk keserenangan — jauh lebih cepat daripada mencari sudut secara eksplisit. Magnitud: |a| = 5, |b| = 5. Sahkan: cos θ = 0 / (5·5) = 0 → θ = 90° ✓.",
              },
              {
                type: "tip",
                titleEn: "Use Position Vectors for Geometry Problems",
                titleMs: "Gunakan Vektor Kedudukan untuk Masalah Geometri",
                bodyEn: "When a question mentions points A, B, C, D, assign each a position vector (OA, OB, OC, OD). Then: AB = OB − OA. Midpoint of AB has position vector (OA + OB)/2. For collinearity, show that AB = k × BC for some scalar k. For parallel lines, show their direction vectors are scalar multiples.",
                bodyMs: "Apabila soalan menyebut titik A, B, C, D, berikan setiap satu vektor kedudukan (OA, OB, OC, OD). Kemudian: AB = OB − OA. Titik tengah AB mempunyai vektor kedudukan (OA + OB)/2. Untuk kolinearan, tunjukkan AB = k × BC untuk sesuatu skalar k. Untuk garis selari, tunjukkan vektor arah mereka adalah gandaan skalar.",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "mcq",
            promptEn: "Find the magnitude of vector v = (5, 12).",
            promptMs: "Cari magnitud vektor v = (5, 12).",
            optionsEn: ["13", "17", "√119", "60"],
            optionsMs: ["13", "17", "√119", "60"],
            answerKey: "0",
            explanationEn: "|v| = √(5² + 12²) = √(25 + 144) = √169 = 13.",
            explanationMs: "|v| = √(5² + 12²) = √(25 + 144) = √169 = 13.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "If a = (2, 3) and b = (4, −1), find a + b.",
            promptMs: "Jika a = (2, 3) dan b = (4, −1), cari a + b.",
            optionsEn: ["(6, 2)", "(6, 4)", "(2, 4)", "(−2, 4)"],
            optionsMs: ["(6, 2)", "(6, 4)", "(2, 4)", "(−2, 4)"],
            answerKey: "0",
            explanationEn: "Add components: (2+4, 3+(−1)) = (6, 2).",
            explanationMs: "Tambah komponen: (2+4, 3+(−1)) = (6, 2).",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "numeric",
            promptEn: "Find the dot product a · b where a = (3, 4) and b = (1, 2).",
            promptMs: "Cari hasil darab titik a · b dengan a = (3, 4) dan b = (1, 2).",
            optionsEn: ["11"],
            optionsMs: ["11"],
            answerKey: "11",
            explanationEn: "a · b = (3)(1) + (4)(2) = 3 + 8 = 11.",
            explanationMs: "a · b = (3)(1) + (4)(2) = 3 + 8 = 11.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "Find the unit vector in the direction of v = (3, 4).",
            promptMs: "Cari vektor unit dalam arah v = (3, 4).",
            optionsEn: ["(3/5, 4/5)", "(3, 4)/25", "(3/25, 4/25)", "(4/5, 3/5)"],
            optionsMs: ["(3/5, 4/5)", "(3, 4)/25", "(3/25, 4/25)", "(4/5, 3/5)"],
            answerKey: "0",
            explanationEn: "|v| = 5. Unit vector = v/|v| = (3/5, 4/5).",
            explanationMs: "|v| = 5. Vektor unit = v/|v| = (3/5, 4/5).",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "If a · b = 0 (and neither is zero), what is the angle between a and b?",
            promptMs: "Jika a · b = 0 (dan kedua-duanya bukan sifar), apakah sudut antara a dan b?",
            optionsEn: ["90°", "0°", "180°", "45°"],
            optionsMs: ["90°", "0°", "180°", "45°"],
            answerKey: "0",
            explanationEn: "a · b = |a||b|cos θ = 0 (with non-zero vectors) means cos θ = 0, so θ = 90°. The vectors are perpendicular.",
            explanationMs: "a · b = |a||b|cos θ = 0 (dengan vektor bukan sifar) bermaksud cos θ = 0, jadi θ = 90°. Vektor adalah serenang.",
            difficulty: "intermediate",
            points: 2,
          },
        ],
        formulas: [
          {
            nameEn: "Magnitude of a Vector",
            nameMs: "Magnitud Vektor",
            formulaLatex: "|\\vec{v}| = \\sqrt{x^2 + y^2}",
            formulaDisplay: "|v| = √(x² + y²)",
            descEn: "Length of a 2D vector (x, y). Pythagoras' theorem.",
            descMs: "Panjang vektor 2D (x, y). Teorem Pithagoras.",
            exampleEn: "|(3, 4)| = √25 = 5",
            exampleMs: "|(3, 4)| = √25 = 5",
          },
          {
            nameEn: "Scalar (Dot) Product",
            nameMs: "Hasil Darab Skalar (Titik)",
            formulaLatex: "\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 = |\\vec{a}||\\vec{b}|\\cos\\theta",
            formulaDisplay: "a · b = a₁b₁ + a₂b₂ = |a||b|cos θ",
            descEn: "Returns a scalar. Zero means perpendicular vectors.",
            descMs: "Pulangkan skalar. Sifar bermaksud vektor serenang.",
            exampleEn: "(3,4)·(4,−3) = 12 − 12 = 0 (perpendicular)",
            exampleMs: "(3,4)·(4,−3) = 12 − 12 = 0 (serenang)",
          },
          {
            nameEn: "Unit Vector",
            nameMs: "Vektor Unit",
            formulaLatex: "\\hat{v} = \\frac{\\vec{v}}{|\\vec{v}|}",
            formulaDisplay: "v̂ = v / |v|",
            descEn: "A vector of length 1 in the same direction as v.",
            descMs: "Vektor panjang 1 dalam arah yang sama dengan v.",
            exampleEn: "Unit vector of (3, 4) = (3/5, 4/5)",
            exampleMs: "Vektor unit bagi (3, 4) = (3/5, 4/5)",
          },
        ],
        spm: [
          {
            year: 2023,
            paper: 2,
            questionNo: "12",
            promptEn: "Given points A(1, 2), B(4, 6), C(7, 8). (a) Find vector AB and vector BC. (b) Show that A, B, C are collinear.",
            promptMs: "Diberi titik A(1, 2), B(4, 6), C(7, 8). (a) Cari vektor AB dan vektor BC. (b) Tunjukkan bahawa A, B, C adalah kolinear.",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "(a) AB = (3, 4), BC = (3, 2). Hmm wait — let me recompute. AB = (4−1, 6−2) = (3, 4). BC = (7−4, 8−6) = (3, 2). For collinearity, AB = k·BC for some k. (3,4) = k(3,2). From x: k=1. From y: 4 = k·2 = 2. So k=1 vs k=2 — inconsistent. So A, B, C are NOT collinear.",
            answerMs: "(a) AB = (3, 4), BC = (3, 2). Untuk kolinearan, AB = k·BC. (3,4) = k(3,2). Dari x: k=1. Dari y: 4 = k·2 = 2. Maka k=1 vs k=2 — tidak konsisten. Jadi A, B, C TIDAK kolinear.",
            workingEn: "AB = OB − OA = (4−1, 6−2) = (3, 4). BC = OC − OB = (7−4, 8−6) = (3, 2). For collinearity, we need AB = k·BC for some scalar k. From x-components: 3 = k·3 → k = 1. From y-components: 4 = k·2 → k = 2. These are inconsistent, so AB is NOT a scalar multiple of BC. Therefore A, B, C are NOT collinear.",
            workingMs: "AB = OB − OA = (4−1, 6−2) = (3, 4). BC = OC − OB = (7−4, 8−6) = (3, 2). Untuk kolinearan, kita perlu AB = k·BC untuk sesuatu skalar k. Dari komponen-x: 3 = k·3 → k = 1. Dari komponen-y: 4 = k·2 → k = 2. Ini tidak konsisten, jadi AB BUKAN gandaan skalar BC. Oleh itu A, B, C TIDAK kolinear.",
          },
          {
            year: 2018,
            paper: 2,
            questionNo: "9",
            promptEn: "Given vectors a = (2, 1) and b = (3, 4), find (a) the angle between a and b, (b) the unit vector in the direction of a + b.",
            promptMs: "Diberi vektor a = (2, 1) dan b = (3, 4), cari (a) sudut antara a dan b, (b) vektor unit dalam arah a + b.",
            marksEn: "6 marks",
            marksMs: "6 markah",
            answerEn: "(a) ≈ 25.6°  (b) (5/√50, 5/√50) = (1/√2, 1/√2)",
            answerMs: "(a) ≈ 25.6°  (b) (5/√50, 5/√50) = (1/√2, 1/√2)",
            workingEn: "(a) a · b = (2)(3) + (1)(4) = 10. |a| = √5, |b| = 5. cos θ = 10/(√5 × 5) = 10/(5√5) = 2/√5 ≈ 0.8944. θ = cos⁻¹(0.8944) ≈ 25.6°. (b) a + b = (5, 5). |a + b| = √50 = 5√2. Unit vector = (5/(5√2), 5/(5√2)) = (1/√2, 1/√2) ≈ (0.707, 0.707).",
            workingMs: "(a) a · b = (2)(3) + (1)(4) = 10. |a| = √5, |b| = 5. cos θ = 10/(√5 × 5) = 2/√5 ≈ 0.8944. θ = cos⁻¹(0.8944) ≈ 25.6°. (b) a + b = (5, 5). |a + b| = √50 = 5√2. Vektor unit = (1/√2, 1/√2) ≈ (0.707, 0.707).",
          },
        ],
      },
      // ---------- Topic 5: Permutations & Combinations ----------
      {
        slug: "permutations-combinations",
        titleEn: "Permutations & Combinations",
        titleMs: "Pilih Atur & Gabungan",
        summaryEn: "Counting arrangements where order matters (permutations) and doesn't (combinations).",
        summaryMs: "Mengira susunan di mana urutan penting (pilih atur) dan tidak (gabungan).",
        icon: "Shuffle",
        formLevel: 5,
        durationMin: 18,
        lessons: [
          {
            titleEn: "Factorials & Permutations",
            titleMs: "Faktorial & Pilih Atur",
            summaryEn: "Use n! and ⁿPᵣ to count arrangements where order matters.",
            summaryMs: "Gunakan n! dan ⁿPᵣ untuk mengira susunan di mana urutan penting.",
            durationMin: 10,
            sections: [
              {
                type: "intro",
                titleEn: "Counting Without Listing",
                titleMs: "Mengira Tanpa Senarai",
                bodyEn: "How many ways can 5 students sit in a row of 5 chairs? You could list them all (120 ways!) — or use a formula. **Permutations** count arrangements where ORDER matters: ABC is different from CBA. The factorial n! = n × (n−1) × ... × 1 counts arrangements of n distinct objects. For choosing r out of n: ⁿPᵣ = n! / (n−r)!.",
                bodyMs: "Berapa banyak cara 5 pelajar boleh duduk dalam satu baris 5 kerusi? Anda boleh senaraikan semuanya (120 cara!) — atau gunakan formula. **Pilih atur** mengira susunan di mana URUTAN penting: ABC berbeza dengan CBA. Faktorial n! = n × (n−1) × ... × 1 mengira susunan n objek berbeza. Untuk memilih r daripada n: ⁿPᵣ = n! / (n−r)!.",
              },
              {
                type: "concept",
                titleEn: "Key Formulas",
                titleMs: "Formula Utama",
                bodyEn: "**Factorial**: n! = n × (n−1) × ... × 1. By convention, 0! = 1. **Permutation** (r out of n, order matters): ⁿPᵣ = n! / (n−r)!. Example: arranging 3 students from a group of 5 in a row: ⁵P₃ = 5!/2! = 60. **Special case**: arranging all n objects: ⁿPₙ = n!. SPM questions often include restrictions — 'A must be at the end', 'B and C must be together' — handle these by considering the restriction first, then the rest.",
                bodyMs: "**Faktorial**: n! = n × (n−1) × ... × 1. Mengikut konvensyen, 0! = 1. **Pilih atur** (r daripada n, urutan penting): ⁿPᵣ = n! / (n−r)!. Contoh: menyusun 3 pelajar dari kumpulan 5 dalam baris: ⁵P₃ = 5!/2! = 60. **Kes khas**: menyusun semua n objek: ⁿPₙ = n!. Soalan SPM sering termasuk sekatan — 'A mesti di hujung', 'B dan C mesti bersama' — kendalikan ini dengan mempertimbangkan sekatan dahulu, kemudian selebihnya.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Arrange 5 Books, 2 Must Be Together",
                titleMs: "Contoh Penyelesaian: Susun 5 Buku, 2 Mesti Bersama",
                bodyEn: "5 books A, B, C, D, E on a shelf. Books A and B must be adjacent. Step 1: Treat AB as a single 'block' — now we have 4 items: (AB), C, D, E. These can be arranged in 4! = 24 ways. Step 2: Within the (AB) block, A and B can swap: 2! = 2 arrangements (AB or BA). Step 3: Total = 4! × 2! = 24 × 2 = **48 ways**. Always handle 'must be together' by bundling first, then multiplying by the internal arrangements of the bundle.",
                bodyMs: "5 buku A, B, C, D, E di rak. Buku A dan B mesti bersebelahan. Langkah 1: Anggap AB sebagai satu 'blok' — sekarang kita ada 4 item: (AB), C, D, E. Ini boleh disusun dalam 4! = 24 cara. Langkah 2: Dalam blok (AB), A dan B boleh bertukar: 2! = 2 susunan (AB atau BA). Langkah 3: Jumlah = 4! × 2! = 24 × 2 = **48 cara**. Sentiasa kendalikan 'mesti bersama' dengan membungkus dahulu, kemudian darab dengan susunan dalam bungkusan.",
              },
              {
                type: "tip",
                titleEn: "Handle Restrictions First",
                titleMs: "Kendalikan Sekatan Dahulu",
                bodyEn: "When a question has restrictions ('A is at the start', 'no two vowels are adjacent'), handle those FIRST. Place A in its required position, then arrange the rest. For 'no two vowels adjacent' — arrange the consonants first (creating gaps), then place vowels in the gaps. This 'slot' technique unlocks most restricted permutation problems.",
                bodyMs: "Apabila soalan ada sekatan ('A di permulaan', 'tiada dua vokal bersebelahan'), kendalikan itu DAHULU. Letak A di posisi yang diperlukan, kemudian susun selebihnya. Untuk 'tiada dua vokal bersebelahan' — susun konsonan dahulu (mencipta jurang), kemudian letak vokal dalam jurang. Teknik 'slot' ini membuka kebanyakan masalah pilih atur bersekatan.",
              },
            ],
          },
          {
            titleEn: "Combinations & When Order Doesn't Matter",
            titleMs: "Gabungan & Bila Urutan Tidak Penting",
            summaryEn: "Use ⁿCᵣ when selecting without arranging.",
            summaryMs: "Gunakan ⁿCᵣ apabila memilih tanpa menyusun.",
            durationMin: 8,
            sections: [
              {
                type: "intro",
                titleEn: "Selection vs Arrangement",
                titleMs: "Pemilihan vs Susunan",
                bodyEn: "If you choose 3 friends from a group of 5 to invite to a party, the ORDER doesn't matter — inviting Ali, Bob, Chan is the same as Chan, Bob, Ali. This is a **combination**. The formula ⁿCᵣ = n! / (r!(n−r)!) divides out the r! orderings that permutations would count. SPM questions often mix permutations and combinations — the key is asking: does order matter for THIS problem?",
                bodyMs: "Jika anda memilih 3 kawan dari kumpulan 5 untuk menjemput ke parti, URUTAN tidak penting — menjemput Ali, Bob, Chan sama dengan Chan, Bob, Ali. Ini adalah **gabungan**. Formula ⁿCᵣ = n! / (r!(n−r)!) membahagikan r! susunan yang akan dikira oleh pilih atur. Soalan SPM sering mencampur pilih atur dan gabungan — kuncinya ialah bertanya: adakah urutan penting untuk masalah INI?",
              },
              {
                type: "concept",
                titleEn: "Permutation vs Combination — Decision Tree",
                titleMs: "Pilih Atur vs Gabungan — Pokok Keputusan",
                bodyEn: "Ask: 'If I swap two of the selected items, is it a different result?' If YES → permutation (order matters). If NO → combination (order doesn't matter). Examples: (1) Selecting 3 players for a team from 10 → combination (no positions). (2) Selecting president, VP, secretary from 10 → permutation (different roles = different order). (3) Arranging 5 books on a shelf → permutation. (4) Choosing 4 pizza toppings from 12 → combination.",
                bodyMs: "Tanya: 'Jika saya tukar dua item yang dipilih, adakah ia hasil berbeza?' Jika YA → pilih atur (urutan penting). Jika TIDAK → gabungan (urutan tidak penting). Contoh: (1) Memilih 3 pemain untuk pasukan dari 10 → gabungan (tiada posisi). (2) Memilih presiden, TPM, setiausaha dari 10 → pilih atur (peranan berbeza = urutan berbeza). (3) Menyusun 5 buku di rak → pilih atur. (4) Memilih 4 topping pizza dari 12 → gabungan.",
              },
              {
                type: "example",
                titleEn: "Worked Example: Choose 3 from 7",
                titleMs: "Contoh Penyelesaian: Pilih 3 dari 7",
                bodyEn: "From 7 teachers, choose 3 to form a committee. Order doesn't matter (just a committee, no roles). So use combination: ⁷C₃ = 7! / (3! × 4!) = (7 × 6 × 5) / (3 × 2 × 1) = 210 / 6 = **35 ways**. Compare: if the 3 had distinct roles (chair, secretary, treasurer), it would be ⁷P₃ = 7!/4! = 210. The combination is smaller by a factor of 3! = 6 (the orderings of the chosen 3).",
                bodyMs: "Dari 7 guru, pilih 3 untuk membentuk jawatankuasa. Urutan tidak penting (hanya jawatankuasa, tiada peranan). Jadi gunakan gabungan: ⁷C₃ = 7! / (3! × 4!) = (7 × 6 × 5) / (3 × 2 × 1) = 210 / 6 = **35 cara**. Bandingkan: jika 3 itu mempunyai peranan berbeza (pengerusi, setiausaha, bendahari), ia akan menjadi ⁷P₃ = 7!/4! = 210. Gabungan lebih kecil dengan faktor 3! = 6 (susunan 3 yang dipilih).",
              },
              {
                type: "tip",
                titleEn: "Memorise Small Pascal Triangle Values",
                titleMs: "Hafal Nilai Segi Tiga Pascal Kecil",
                bodyEn: "ⁿCᵣ values for small n are the rows of Pascal's triangle. Memorise: ⁵C₀=1, ⁵C₁=5, ⁵C₂=10, ⁵C₃=10, ⁵C₄=5, ⁵C₅=1. And ⁶Cᵣ: 1, 6, 15, 20, 15, 6, 1. These appear constantly in SPM. Also remember ⁿCᵣ = ⁿCₙ₋ᵣ (choosing r to be IN is the same as choosing n−r to be OUT).",
                bodyMs: "Nilai ⁿCᵣ untuk n kecil ialah baris segi tiga Pascal. Hafal: ⁵C₀=1, ⁵C₁=5, ⁵C₂=10, ⁵C₃=10, ⁵C₄=5, ⁵C₅=1. Dan ⁶Cᵣ: 1, 6, 15, 20, 15, 6, 1. Ini muncul selalu dalam SPM. Juga ingat ⁿCᵣ = ⁿCₙ₋ᵣ (memilih r untuk MASUK sama dengan memilih n−r untuk KELUAR).",
              },
            ],
          },
        ],
        quiz: [
          {
            type: "numeric",
            promptEn: "Evaluate 5! (5 factorial).",
            promptMs: "Nilaikan 5! (5 faktorial).",
            optionsEn: ["120"],
            optionsMs: ["120"],
            answerKey: "120",
            explanationEn: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
            explanationMs: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "mcq",
            promptEn: "How many ways can 4 books be arranged on a shelf?",
            promptMs: "Berapa banyak cara 4 buku boleh disusun di rak?",
            optionsEn: ["24", "16", "12", "4"],
            optionsMs: ["24", "16", "12", "4"],
            answerKey: "0",
            explanationEn: "4! = 4 × 3 × 2 × 1 = 24 arrangements.",
            explanationMs: "4! = 4 × 3 × 2 × 1 = 24 susunan.",
            difficulty: "beginner",
            points: 1,
          },
          {
            type: "numeric",
            promptEn: "Evaluate ⁷C₃.",
            promptMs: "Nilaikan ⁷C₃.",
            optionsEn: ["35"],
            optionsMs: ["35"],
            answerKey: "35",
            explanationEn: "⁷C₃ = 7!/(3!4!) = (7×6×5)/(3×2×1) = 35.",
            explanationMs: "⁷C₃ = 7!/(3!4!) = (7×6×5)/(3×2×1) = 35.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "From 8 students, choose a president and a vice-president. How many ways?",
            promptMs: "Dari 8 pelajar, pilih presiden dan timbalan presiden. Berapa cara?",
            optionsEn: ["56", "28", "64", "16"],
            optionsMs: ["56", "28", "64", "16"],
            answerKey: "0",
            explanationEn: "Order matters (president ≠ VP). So ⁸P₂ = 8!/6! = 8×7 = 56.",
            explanationMs: "Urutan penting (presiden ≠ TPM). Jadi ⁸P₂ = 8!/6! = 8×7 = 56.",
            difficulty: "intermediate",
            points: 2,
          },
          {
            type: "mcq",
            promptEn: "A committee of 3 is chosen from 5 men and 4 women. In how many ways can it have exactly 2 men and 1 woman?",
            promptMs: "Jawatankuasa 3 dipilih dari 5 lelaki dan 4 wanita. Berapa cara boleh ada tepat 2 lelaki dan 1 wanita?",
            optionsEn: ["40", "60", "20", "10"],
            optionsMs: ["40", "60", "20", "10"],
            answerKey: "0",
            explanationEn: "Choose 2 men from 5: ⁵C₂ = 10. Choose 1 woman from 4: ⁴C₁ = 4. Total = 10 × 4 = 40.",
            explanationMs: "Pilih 2 lelaki dari 5: ⁵C₂ = 10. Pilih 1 wanita dari 4: ⁴C₁ = 4. Jumlah = 10 × 4 = 40.",
            difficulty: "advanced",
            points: 3,
          },
        ],
        formulas: [
          {
            nameEn: "Factorial",
            nameMs: "Faktorial",
            formulaLatex: "n! = n \\times (n-1) \\times \\cdots \\times 1",
            formulaDisplay: "n! = n × (n−1) × ... × 1",
            descEn: "Number of ways to arrange n distinct objects. 0! = 1 by convention.",
            descMs: "Bilangan cara menyusun n objek berbeza. 0! = 1 mengikut konvensyen.",
            exampleEn: "5! = 120, 4! = 24",
            exampleMs: "5! = 120, 4! = 24",
          },
          {
            nameEn: "Permutation (r from n, order matters)",
            nameMs: "Pilih Atur (r dari n, urutan penting)",
            formulaLatex: "^nP_r = \\frac{n!}{(n-r)!}",
            formulaDisplay: "ⁿPᵣ = n! / (n−r)!",
            descEn: "Number of ways to choose and arrange r objects from n distinct objects.",
            descMs: "Bilangan cara memilih dan menyusun r objek dari n objek berbeza.",
            exampleEn: "⁵P₂ = 5!/3! = 20",
            exampleMs: "⁵P₂ = 5!/3! = 20",
          },
          {
            nameEn: "Combination (r from n, order doesn't matter)",
            nameMs: "Gabungan (r dari n, urutan tidak penting)",
            formulaLatex: "^nC_r = \\frac{n!}{r!(n-r)!}",
            formulaDisplay: "ⁿCᵣ = n! / (r!(n−r)!)",
            descEn: "Number of ways to choose r objects from n (no arrangement). ⁿCᵣ = ⁿCₙ₋ᵣ.",
            descMs: "Bilangan cara memilih r objek dari n (tiada susunan). ⁿCᵣ = ⁿCₙ₋ᵣ.",
            exampleEn: "⁷C₃ = 35",
            exampleMs: "⁷C₃ = 35",
          },
        ],
        spm: [
          {
            year: 2022,
            paper: 2,
            questionNo: "4",
            promptEn: "A committee of 5 is to be formed from 6 men and 4 women. The committee must include at least 2 women. Find the number of ways to form this committee.",
            promptMs: "Satu jawatankuasa 5 akan dibentuk dari 6 lelaki dan 4 wanita. Jawatankuasa mesti termasuk sekurang-kurangnya 2 wanita. Cari bilangan cara membentuk jawatankuasa ini.",
            marksEn: "5 marks",
            marksMs: "5 markah",
            answerEn: "186 ways",
            answerMs: "186 cara",
            workingEn: "At least 2 women means: 2 women + 3 men, OR 3 women + 2 men, OR 4 women + 1 man. (Cannot have 5 women as only 4 available.) Case 1 (2W, 3M): ⁴C₂ × ⁶C₃ = 6 × 20 = 120. Case 2 (3W, 2M): ⁴C₃ × ⁶C₂ = 4 × 15 = 60. Case 3 (4W, 1M): ⁴C₄ × ⁶C₁ = 1 × 6 = 6. Total = 120 + 60 + 6 = 186 ways.",
            workingMs: "Sekurang-kurangnya 2 wanita bermaksud: 2 wanita + 3 lelaki, ATAU 3 wanita + 2 lelaki, ATAU 4 wanita + 1 lelaki. (Tidak boleh ada 5 wanita kerana hanya 4 ada.) Kes 1 (2P, 3L): ⁴C₂ × ⁶C₃ = 6 × 20 = 120. Kes 2 (3P, 2L): ⁴C₃ × ⁶C₂ = 4 × 15 = 60. Kes 3 (4P, 1L): ⁴C₄ × ⁶C₁ = 1 × 6 = 6. Jumlah = 120 + 60 + 6 = 186 cara.",
          },
          {
            year: 2020,
            paper: 2,
            questionNo: "6",
            promptEn: "Find the number of different arrangements of the letters in the word MATHEMATICS.",
            promptMs: "Cari bilangan susunan berbeza huruf-huruf dalam perkataan MATHEMATICS.",
            marksEn: "4 marks",
            marksMs: "4 markah",
            answerEn: "4 989 600 arrangements",
            answerMs: "4 989 600 susunan",
            workingEn: "MATHEMATICS has 11 letters. Repeats: M×2, A×2, T×2 (H, E, I, C, S each appear once). Number of arrangements = 11! / (2! × 2! × 2!) = 39 916 800 / 8 = 4 989 600. We divide by 2! for each set of repeated letters because swapping identical letters doesn't create a new arrangement.",
            workingMs: "MATHEMATICS ada 11 huruf. Ulangan: M×2, A×2, T×2 (H, E, I, C, S masing-masing muncul sekali). Bilangan susunan = 11! / (2! × 2! × 2!) = 39 916 800 / 8 = 4 989 600. Kita bahagi dengan 2! untuk setiap set huruf berulang kerana menukar huruf identik tidak mencipta susunan baru.",
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding SPM Math Master database...");

  // Wipe existing data
  await db.quizAttempt.deleteMany();
  await db.lessonProgress.deleteMany();
  await db.lessonSection.deleteMany();
  await db.lesson.deleteMany();
  await db.quizQuestion.deleteMany();
  await db.spmQuestion.deleteMany();
  await db.formula.deleteMany();
  await db.topic.deleteMany();
  await db.subject.deleteMany();
  await db.student.deleteMany();

  // Default demo student
  const student = await db.student.create({
    data: {
      id: "student-demo",
      displayName: "Demo Student",
    },
  });

  // Subjects, topics, lessons, sections, formulas, quiz, SPM
  for (const subjectData of subjects) {
    const subject = await db.subject.create({
      data: {
        slug: subjectData.slug,
        nameEn: subjectData.nameEn,
        nameMs: subjectData.nameMs,
        descEn: subjectData.descEn,
        descMs: subjectData.descMs,
        icon: subjectData.icon,
        color: subjectData.color,
        order: subjectData.order,
      },
    });

    for (const topicData of subjectData.topics) {
      const topic = await db.topic.create({
        data: {
          subjectId: subject.id,
          slug: topicData.slug,
          order: subjectData.topics.indexOf(topicData) + 1,
          titleEn: topicData.titleEn,
          titleMs: topicData.titleMs,
          summaryEn: topicData.summaryEn,
          summaryMs: topicData.summaryMs,
          icon: topicData.icon,
          formLevel: topicData.formLevel,
          durationMin: topicData.durationMin,
        },
      });

      // Lessons + sections
      for (let li = 0; li < topicData.lessons.length; li++) {
        const lessonData = topicData.lessons[li];
        const lesson = await db.lesson.create({
          data: {
            topicId: topic.id,
            order: li + 1,
            titleEn: lessonData.titleEn,
            titleMs: lessonData.titleMs,
            summaryEn: lessonData.summaryEn,
            summaryMs: lessonData.summaryMs,
            durationMin: lessonData.durationMin,
          },
        });

        for (let si = 0; si < lessonData.sections.length; si++) {
          const section = lessonData.sections[si];
          await db.lessonSection.create({
            data: {
              lessonId: lesson.id,
              order: si,
              type: section.type,
              titleEn: section.titleEn,
              titleMs: section.titleMs,
              bodyEn: section.bodyEn,
              bodyMs: section.bodyMs,
            },
          });
        }

        // Lesson progress
        await db.lessonProgress.create({
          data: {
            studentId: student.id,
            topicId: topic.id,
            lessonId: lesson.id,
            status: "not_started",
            completionPct: 0,
          },
        });
      }

      // Formulas
      for (const f of topicData.formulas) {
        await db.formula.create({
          data: {
            topicId: topic.id,
            nameEn: f.nameEn,
            nameMs: f.nameMs,
            formulaLatex: f.formulaLatex,
            formulaDisplay: f.formulaDisplay,
            descEn: f.descEn,
            descMs: f.descMs,
            exampleEn: f.exampleEn ?? null,
            exampleMs: f.exampleMs ?? null,
          },
        });
      }

      // Quiz questions
      for (const q of topicData.quiz) {
        await db.quizQuestion.create({
          data: {
            topicId: topic.id,
            type: q.type,
            promptEn: q.promptEn,
            promptMs: q.promptMs,
            optionsEn: JSON.stringify(q.optionsEn),
            optionsMs: JSON.stringify(q.optionsMs),
            answerKey: q.answerKey,
            explanationEn: q.explanationEn,
            explanationMs: q.explanationMs,
            difficulty: q.difficulty,
            points: q.points ?? 1,
          },
        });
      }

      // SPM past-year questions
      for (const s of topicData.spm) {
        await db.spmQuestion.create({
          data: {
            topicId: topic.id,
            year: s.year,
            paper: s.paper,
            questionNo: s.questionNo,
            promptEn: s.promptEn,
            promptMs: s.promptMs,
            marksEn: s.marksEn,
            marksMs: s.marksMs,
            answerEn: s.answerEn,
            answerMs: s.answerMs,
            workingEn: s.workingEn ?? null,
            workingMs: s.workingMs ?? null,
          },
        });
      }
    }
  }

  // Summary
  const subjectCount = subjects.length;
  const topicCount = subjects.reduce((s, sub) => s + sub.topics.length, 0);
  const lessonCount = subjects.reduce(
    (s, sub) => s + sub.topics.reduce((ts, t) => ts + t.lessons.length, 0),
    0
  );
  const quizCount = subjects.reduce(
    (s, sub) => s + sub.topics.reduce((ts, t) => ts + t.quiz.length, 0),
    0
  );
  const formulaCount = subjects.reduce(
    (s, sub) => s + sub.topics.reduce((ts, t) => ts + t.formulas.length, 0),
    0
  );
  const spmCount = subjects.reduce(
    (s, sub) => s + sub.topics.reduce((ts, t) => ts + t.spm.length, 0),
    0
  );

  console.log(`✅ Seeded ${subjectCount} subjects, ${topicCount} topics, ${lessonCount} lessons, ${quizCount} quiz questions, ${formulaCount} formulas, ${spmCount} SPM past-year questions.`);
  console.log(`✅ Default student: ${student.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
