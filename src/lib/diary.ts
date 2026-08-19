export type Mood = {
  key: string;
  label: string;
  emoji: string;
  score: number;
};

export const MOODS: Mood[] = [
  { key: "great", label: "Great", emoji: "😄", score: 5 },
  { key: "good", label: "Good", emoji: "🙂", score: 4 },
  { key: "okay", label: "Okay", emoji: "😐", score: 3 },
  { key: "low", label: "Low", emoji: "😕", score: 2 },
  { key: "sad", label: "Sad", emoji: "😔", score: 1 },
  { key: "frustrated", label: "Frustrated", emoji: "😤", score: 2 },
  { key: "tired", label: "Tired", emoji: "😴", score: 3 },
  { key: "motivated", label: "Motivated", emoji: "🔥", score: 5 },
  { key: "grateful", label: "Grateful", emoji: "❤️", score: 5 },
];

export function moodOf(key: string | null | undefined): Mood | undefined {
  return MOODS.find((m) => m.key === key);
}

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const WRITING_FONTS = [
  { key: "serif", label: "Serif", className: "write-serif" },
  { key: "sans", label: "Sans-serif", className: "write-sans" },
  { key: "hand", label: "Handwritten", className: "write-hand" },
] as const;

export function writingFontClass(key: string | null | undefined) {
  return WRITING_FONTS.find((f) => f.key === key)?.className ?? "write-serif";
}

export function writingSizeClass(key: string | null | undefined) {
  switch (key) {
    case "small":
      return "text-base";
    case "large":
      return "text-2xl";
    default:
      return "text-xl";
  }
}

export function lineSpacingClass(key: string | null | undefined) {
  switch (key) {
    case "tight":
      return "leading-relaxed";
    case "loose":
      return "leading-[2.2]";
    default:
      return "leading-[1.9]";
  }
}

/** Local (not UTC) yyyy-mm-dd for a date. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function todayKey(timezone?: string | null): string {
  if (!timezone) return toDateKey(new Date());
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    return parts;
  } catch {
    return toDateKey(new Date());
  }
}

export function shiftDateKey(key: string, days: number): string {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

export function friendlyError(message?: string | null): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "That email and password don't match.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try signing in.";
  if (m.includes("password") && m.includes("6"))
    return "Please choose a password with at least 6 characters.";
  if (m.includes("fetch") || m.includes("network"))
    return "You're offline. Your writing is saved on this device and will sync when you're back online.";
  return "Something went wrong. Your writing is safe on this device. Please try again.";
}

export function excerpt(content: string, length = 140): string {
  const plain = content.replace(/[#*_>`-]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > length ? `${plain.slice(0, length)}…` : plain;
}

export const draftKey = (dateKey: string) => `dd:draft:${dateKey}`;
