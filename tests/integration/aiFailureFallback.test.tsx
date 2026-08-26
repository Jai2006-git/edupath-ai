import { describe, it, expect, vi } from 'vitest';
import { getTutorAnswer, generateStudyPlanAsync } from '../../src/services/aiService';

describe('Integration Tests: AI Network Failure & Graceful Fallback', () => {
  it('should fall back to algorithmic cognitive engine when API network fails without crashing', async () => {
    // Force network failure simulation
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    try {
      const fallbackAnswer = await getTutorAnswer('Explain Red-Black Tree invariant', 'DSA', 'Trees', [], 'invalid-key');
      expect(fallbackAnswer).toContain('💡');
      expect(fallbackAnswer).toContain('🔑');

      const plan = await generateStudyPlanAsync('Compiler Design', ['Lexing', 'Parsing'], '2026-12-01', 3, 'intermediate', 'practice', 'Exam', 'invalid-key');
      expect(plan.phases.length).toBe(4);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
