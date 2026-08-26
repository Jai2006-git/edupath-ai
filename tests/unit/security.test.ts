import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeTopicList,
  validateFutureDate,
  sanitizeDailyHours,
  maskApiKey
} from '../../src/utils/security';

describe('Unit Tests: Security & Input Validation', () => {
  it('should strip script tags and escape dangerous characters', () => {
    const raw = '<script>alert("xss")</script>Tree Traversals & Graphs';
    const sanitized = sanitizeText(raw);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Tree Traversals & Graphs');
  });

  it('should enforce maximum string length limits', () => {
    const longString = 'A'.repeat(800);
    const sanitized = sanitizeText(longString, 250);
    expect(sanitized.length).toBe(250);
  });

  it('should clean and deduplicate empty topic items from array', () => {
    const rawList = [
      ' Dynamic Programming ',
      '<iframe src="evil.com"></iframe>Backtracking',
      '   ',
      '',
      'Trie Data Structures'
    ];
    const cleaned = sanitizeTopicList(rawList);
    expect(cleaned).toHaveLength(3);
    expect(cleaned[0]).toBe('Dynamic Programming');
    expect(cleaned[1]).not.toContain('<iframe');
    expect(cleaned[2]).toBe('Trie Data Structures');
  });

  it('should validate future exam dates and reject past dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);
    const validRes = validateFutureDate(futureDate.toISOString().split('T')[0]);
    expect(validRes.isValid).toBe(true);

    const pastRes = validateFutureDate('2021-05-12');
    expect(pastRes.isValid).toBe(false);
    expect(pastRes.error).toContain('future');
  });

  it('should clamp study hours to realistic daily range [0.5, 16.0]', () => {
    expect(sanitizeDailyHours(0.1)).toBe(0.5);
    expect(sanitizeDailyHours(24)).toBe(16.0);
    expect(sanitizeDailyHours(4.0)).toBe(4.0);
    expect(sanitizeDailyHours(NaN)).toBe(3.0);
  });

  it('should mask API keys securely without revealing secret characters', () => {
    const rawKey = 'AIzaSyD_SECRET_KEY_12345678';
    const masked = maskApiKey(rawKey);
    expect(masked).toBe('AIza••••••••5678');
    expect(masked).not.toContain('SECRET');
  });
});
