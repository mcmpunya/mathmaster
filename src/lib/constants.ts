// The default student ID used for the sandbox demo. In a real deployment,
// this would be replaced by authenticated user IDs from NextAuth.
export const DEFAULT_STUDENT_ID = "student-demo";

// Helper to safely parse JSON strings coming from Prisma.
export function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
