import { describe, it, expect } from 'vitest';
import { generateQuizQuestions } from '../src/services/aiService';

describe('Active Recall Quiz Generation & Scoring', () => {
  it('should generate multiple-choice questions with 4 options and valid answer indices', () => {
    const questions = generateQuizQuestions('Binary Search & BST', 5, 'medium');

    expect(questions).toHaveLength(5);
    questions.forEach(q => {
      expect(q.options).toHaveLength(4);
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswer).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
      expect(q.whyCorrect).toBeTruthy();
    });
  });

  it('should generate domain-specific questions for medical biochemistry topics', () => {
    const questions = generateQuizQuestions('Medical Biochemistry & Enzymes', 3, 'hard');

    expect(questions.length).toBeGreaterThanOrEqual(2);
    expect(questions[0].topic).toContain('Biochemistry');
  });

  it('should generate dynamic questions for custom unseen topics', () => {
    const questions = generateQuizQuestions('Advanced Quantum Computing Gates', 3, 'easy');

    expect(questions).toHaveLength(3);
    expect(questions[0].options).toHaveLength(4);
  });
});
