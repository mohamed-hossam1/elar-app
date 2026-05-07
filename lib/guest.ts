export const GUEST_COOKIE_NAME = "guest-id";

const GUEST_ID_PATTERN = /^guest_[a-z0-9]{10,}$/;

function isValidGuestId(value: unknown): value is string {
  return typeof value === "string" && GUEST_ID_PATTERN.test(value);
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return rest.join("=");
    }
  }

  return undefined;
}

export function getGuestId(): string | undefined {
  const raw = getCookie(GUEST_COOKIE_NAME);
  if (!raw) return undefined;

  try {
    const decoded = decodeURIComponent(raw);
    return isValidGuestId(decoded) ? decoded : undefined;
  } catch {
    return undefined;
  }
}

export function setGuestId(id: string) {
  if (typeof document === "undefined") return;
  if (!isValidGuestId(id)) return;

  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";

  document.cookie = [
    `${GUEST_COOKIE_NAME}=${encodeURIComponent(id)}`,
    `expires=${expires.toUTCString()}`,
    "path=/",
    "SameSite=Lax",
    isSecure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function createGuestId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `guest_${crypto.randomUUID().replace(/-/g, "")}`;
  }

  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateGuestId(): string {
  let id = getGuestId();

  if (!id) {
    id = createGuestId();
    setGuestId(id);
  }

  return id;
}
