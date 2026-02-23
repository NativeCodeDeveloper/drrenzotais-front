const FALLBACK_SEPARATOR = "||";

export function parseDescripcionPublicacion(rawValue) {
  const raw = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!raw) return { title: "", text: "" };

  // New format: JSON string stored in descripcionPublicaciones
  if (raw.startsWith("{") && raw.endsWith("}")) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          title: typeof parsed.title === "string" ? parsed.title.trim() : "",
          text: typeof parsed.text === "string" ? parsed.text.trim() : "",
        };
      }
    } catch {
      // Continue with legacy formats
    }
  }

  // Legacy safe fallback for manually edited records
  if (raw.includes(FALLBACK_SEPARATOR)) {
    const [title, ...rest] = raw.split(FALLBACK_SEPARATOR);
    return {
      title: title.trim(),
      text: rest.join(FALLBACK_SEPARATOR).trim(),
    };
  }

  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return { title: lines[0], text: lines.slice(1).join(" ") };
  }

  return { title: raw, text: "" };
}

export function buildDescripcionPublicacion(title, text) {
  return JSON.stringify({
    title: String(title ?? "").trim(),
    text: String(text ?? "").trim(),
  });
}
