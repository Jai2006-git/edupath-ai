import { describe, it, expect } from 'vitest';
import { extractJsonFromText } from '../../src/services/geminiClient';
import { getTutorAnswer } from '../../src/services/aiService';

describe('Unit Tests: AI Client, JSON Parsing & Error Normalization', () => {
  it('should parse direct JSON string properly', () => {
    const raw = '{"success": true, "score": 95}';
    const parsed = extractJsonFromText<{ success: boolean; score: number }>(raw);
    expect(parsed).toEqual({ success: true, score: 95 });
  });

  it('should extract JSON from markdown code fences', () => {
    const raw = 'Here is the response:\n```json\n{"subject": "Physics", "hours": 3}\n```\nGood luck!';
    const parsed = extractJsonFromText<{ subject: string; hours: number }>(raw);
    expect(parsed).toEqual({ subject: 'Physics', hours: 3 });
  });

  it('should extract JSON from boundary brackets when markdown fences are missing', () => {
    const raw = 'The study plan result is {"phase": 1, "topic": "Calculus"} as calculated.';
    const parsed = extractJsonFromText<{ phase: number; topic: string }>(raw);
    expect(parsed).toEqual({ phase: 1, topic: 'Calculus' });
  });

  it('should return null for malformed or unparseable input without throwing exceptions', () => {
    const raw = 'This is an error with no valid json at all.';
    const parsed = extractJsonFromText(raw);
    expect(parsed).toBeNull();
  });

  it('should format 4-part educational structured responses in AI Tutor fallback mode', async () => {
    const answer = await getTutorAnswer(
      'Explain Quicksort pivot selection',
      'Data Structures',
      'Sorting Algorithms',
      ['Partitioning'],
      ''
    );

    expect(answer).toContain('💡');
    expect(answer).toContain('🔑');
    expect(answer).toContain('📝');
    expect(answer).toContain('📌');
  });
});
