import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeTopicList,
  validateFutureDate,
  sanitizeDailyHours,
  maskApiKey
} from '../src/utils/security';

describe('Security & Input Sanitization Utilities', () => {
  it('should sanitize raw strings and strip HTML script tags', () => {
    const maliciousInput = '<script>alert("xss")</script>Binary Trees & BST';
    const sanitized = sanitizeText(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Binary Trees & BST');
  });

  it('should enforce maximum length bounds on input', () => {
    const longString = 'a'.repeat(600);
    const sanitized = sanitizeText(longString, 100);
    expect(sanitized.length).toBeLessThanOrEqual(100);
  });

  it('should sanitize and clean an array of syllabus topics', () => {
    const topics = [
      '  Dynamic Programming  ',
      '<svg onload=alert(1)>Graph Dijkstra',
      '',
      '   ',
      'Binary Search'
    ];
    const cleaned = sanitizeTopicList(topics);
    expect(cleaned).toHaveLength(3);
    expect(cleaned[0]).toBe('Dynamic Programming');
    expect(cleaned[1]).not.toContain('<svg');
    expect(cleaned[2]).toBe('Binary Search');
  });

  it('should validate future exam dates correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = futureDate.toISOString().split('T')[0];

    const validCheck = validateFutureDate(dateStr);
    expect(validCheck.isValid).toBe(true);

    const pastDate = '2020-01-01';
    const pastCheck = validateFutureDate(pastDate);
    expect(pastCheck.isValid).toBe(false);
    expect(pastCheck.error).toContain('future');
  });

  it('should constrain daily hours to safe numeric bounds [0.5, 16.0]', () => {
    expect(sanitizeDailyHours(0.1)).toBe(0.5);
    expect(sanitizeDailyHours(25)).toBe(16.0);
    expect(sanitizeDailyHours(3.5)).toBe(3.5);
    expect(sanitizeDailyHours(NaN)).toBe(3.0);
  });

  it('should safely mask API keys for UI display', () => {
    const key = 'AIzaSyD-1234567890abcdefg';
    const masked = maskApiKey(key);
    expect(masked).toBe('AIza••••••••defg');
    expect(masked).not.toContain('1234567890');
    expect(maskApiKey('')).toBe('');
  });
});
