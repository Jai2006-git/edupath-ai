import { describe, it, expect } from 'vitest';
import { rebalanceStudyPlan } from '../src/services/aiService';
import { PRESET_STUDY_PLANS } from '../src/data/presets';

describe('AI Schedule Rebalancing Algorithms', () => {
  const basePlan = PRESET_STUDY_PLANS[0];

  it('should compress lower priority milestones when a student falls behind or misses days', () => {
    const rebalanced = rebalanceStudyPlan(basePlan, 'I fell behind / missed 1-2 study days');

    expect(rebalanced.readinessScore).toBeGreaterThanOrEqual(basePlan.readinessScore);
    expect(rebalanced.dailyTasks.some(t => t.notes?.includes('AI Rebalanced'))).toBe(true);
  });

  it('should allocate targeted recovery drills when struggling with weak areas', () => {
    const rebalanced = rebalanceStudyPlan(basePlan, 'I am struggling with a specific weak area');

    const recoveryTask = rebalanced.dailyTasks.find(t => t.title.includes('Recovery Drill'));
    expect(recoveryTask).toBeDefined();
    expect(recoveryTask?.priority).toBe('high');
  });

  it('should accelerate milestone unlocking and boost velocity when requested', () => {
    const rebalanced = rebalanceStudyPlan(basePlan, 'I want to accelerate my learning velocity');

    expect(rebalanced.readinessScore).toBeGreaterThan(basePlan.readinessScore);
    const hasCurrent = rebalanced.phases.some(p => p.milestones.some(m => m.status === 'current'));
    expect(hasCurrent).toBe(true);
  });
});
