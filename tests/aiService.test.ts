import { describe, it, expect } from 'vitest';
import {
  generateStudyPlan,
  getTutorAnswer,
  suggestTopicsForSubject
} from '../src/services/aiService';

describe('AI Cognitive Service Layer & Fallbacks', () => {
  it('should generate a 4-phase structured study plan with milestones and daily tasks', () => {
    const plan = generateStudyPlan(
      'Fullstack System Architecture',
      ['Microservices', 'Database Sharding', 'Message Queues (Kafka)', 'Caching (Redis)'],
      '2026-10-15',
      3.0,
      'intermediate',
      'practice',
      'Master High-Scale Systems'
    );

    expect(plan.phases).toHaveLength(4);
    expect(plan.phases[0].title).toContain('Phase 1');
    expect(plan.dailyTasks.length).toBeGreaterThan(0);
    expect(plan.readinessScore).toBeGreaterThanOrEqual(25);
    expect(plan.weakAreas.length).toBeGreaterThanOrEqual(1);
  });

  it('should provide structured 4-part educational answers in AI tutor fallback', async () => {
    const answer = await getTutorAnswer(
      'How does binary search work?',
      'Data Structures',
      'Binary Search',
      ['Edge Cases'],
      ''
    );

    expect(answer).toContain('💡');
    expect(answer).toContain('🔑');
    expect(answer).toContain('📝');
    expect(answer).toContain('📌');
  });

  it('should auto-suggest high-yield syllabus topics for standard curriculums', () => {
    const topics = suggestTopicsForSubject('Data Structures & Algorithms');
    expect(topics.length).toBeGreaterThanOrEqual(4);
    expect(topics.some(t => t.toLowerCase().includes('array') || t.toLowerCase().includes('tree'))).toBe(true);
  });
});
