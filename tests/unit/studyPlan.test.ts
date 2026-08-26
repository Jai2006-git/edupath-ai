import { describe, it, expect } from 'vitest';
import { generateStudyPlan, suggestTopicsForSubject } from '../../src/services/aiService';

describe('Unit Tests: Study Plan & Roadmap Generation Logic', () => {
  it('should synthesize a comprehensive 4-phase pedagogical curriculum', () => {
    const plan = generateStudyPlan(
      'Machine Learning Systems',
      ['Gradient Descent', 'Transformer Attention', 'Quantization (LoRA)', 'Model Serving'],
      '2026-11-20',
      4.0,
      'intermediate',
      'practice',
      'Ace ML Engineering Interview'
    );

    expect(plan.phases).toHaveLength(4);
    expect(plan.phases[0].milestones.length).toBeGreaterThan(0);
    expect(plan.dailyTasks.length).toBeGreaterThanOrEqual(4);
    expect(plan.readinessScore).toBeGreaterThanOrEqual(15);
    expect(plan.subject).toBe('Machine Learning Systems');
  });

  it('should handle edge cases with 1 topic gracefully by generating sub-milestones', () => {
    const plan = generateStudyPlan(
      'Recursion',
      ['Base Cases & Stack Overflow'],
      '2026-10-01',
      2.0,
      'beginner',
      'conceptual',
      'Understand Recursion'
    );

    expect(plan.phases.length).toBe(4);
    expect(plan.phases.some(p => p.milestones.length > 0)).toBe(true);
  });

  it('should auto-suggest high-yield syllabus topics for standard subjects', () => {
    const dsaTopics = suggestTopicsForSubject('Data Structures');
    expect(dsaTopics.length).toBeGreaterThanOrEqual(4);
    expect(dsaTopics.some(t => t.toLowerCase().includes('array') || t.toLowerCase().includes('tree'))).toBe(true);

    const medTopics = suggestTopicsForSubject('USMLE Step 1');
    expect(medTopics.length).toBeGreaterThanOrEqual(4);
  });
});
