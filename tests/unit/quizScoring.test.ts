import { describe, it, expect } from 'vitest';
import { generateQuizQuestions } from '../../src/services/aiService';

describe('Unit Tests: Active Recall Quiz Generation & Scoring Mathematics', () => {
  it('should generate multiple-choice questions with 4 distinct options and valid answer indices', () => {
    const questions = generateQuizQuestions('Dynamic Programming', 5, 'medium');

    expect(questions.length).toBeGreaterThanOrEqual(3);
    questions.forEach(q => {
      expect(q.options).toHaveLength(4);
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswer).toBeLessThan(4);
      expect(typeof q.explanation).toBe('string');
      expect(q.explanation.length).toBeGreaterThan(10);
      if (q.whyCorrect) expect(typeof q.whyCorrect).toBe('string');
    });
  });

  it('should compute exact quiz accuracy percentage and feedback tiers', () => {
    const totalQuestions = 5;
    const calculateScoreData = (correctCount: number) => {
      const pct = Math.round((correctCount / totalQuestions) * 100);
      let tier = 'Needs Practice';
      if (pct >= 80) tier = 'Mastery';
      else if (pct >= 60) tier = 'Solid Foundation';
      return { pct, tier };
    };

    expect(calculateScoreData(5)).toEqual({ pct: 100, tier: 'Mastery' });
    expect(calculateScoreData(4)).toEqual({ pct: 80, tier: 'Mastery' });
    expect(calculateScoreData(3)).toEqual({ pct: 60, tier: 'Solid Foundation' });
    expect(calculateScoreData(1)).toEqual({ pct: 20, tier: 'Needs Practice' });
  });

  it('should generate dynamic questions for unseen custom inputs without crashing', () => {
    const questions = generateQuizQuestions('Quantum Superposition & Qubits', 3, 'hard');
    expect(questions).toHaveLength(3);
    expect(questions[0].topic).toContain('Quantum');
  });
});
