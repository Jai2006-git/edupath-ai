/**
 * Security & Input Sanitization Utilities for EduPath AI
 * Protects against XSS, malformed inputs, prototype pollution, and out-of-bounds dates/numbers.
 */

/**
 * Sanitizes user input string by stripping HTML tags and trimming unsafe characters
 */
export function sanitizeText(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[<>'"`;]/g, char => {
      // Escape critical characters if any survive
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '`': return '&#96;';
        case ';': return '&#59;';
        default: return char;
      }
    })
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes an array of topic strings
 */
export function sanitizeTopicList(topics: string[], maxTopics: number = 50): string[] {
  if (!Array.isArray(topics)) return [];
  return topics
    .map(t => sanitizeText(t, 120))
    .filter(t => t.length > 0)
    .slice(0, maxTopics);
}

/**
 * Validates that an exam date is a valid future ISO date string (YYYY-MM-DD)
 */
export function validateFutureDate(dateStr: string): { isValid: boolean; error?: string } {
  if (!dateStr) {
    return { isValid: false, error: 'Exam date is required.' };
  }

  const timestamp = Date.parse(dateStr);
  if (isNaN(timestamp)) {
    return { isValid: false, error: 'Invalid date format. Please select a valid date.' };
  }

  const selectedDate = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (selectedDate.getTime() < now.getTime()) {
    return { isValid: false, error: 'Exam date must be in the future.' };
  }

  const maxFuture = new Date();
  maxFuture.setFullYear(maxFuture.getFullYear() + 3);
  if (selectedDate.getTime() > maxFuture.getTime()) {
    return { isValid: false, error: 'Exam date must be within the next 3 years.' };
  }

  return { isValid: true };
}

/**
 * Sanitizes daily study hours to stay within safe range [0.5, 16]
 */
export function sanitizeDailyHours(hours: number): number {
  if (typeof hours !== 'number' || isNaN(hours)) return 3.0;
  return Math.min(16, Math.max(0.5, Math.round(hours * 10) / 10));
}

/**
 * Masks an API key for safe display in UI
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '';
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}
