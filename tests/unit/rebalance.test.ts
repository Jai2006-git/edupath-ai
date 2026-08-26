import { describe, it, expect } from 'vitest';
import { rebalanceStudyPlan } from '../../src/services/aiService';
import { PRESET_STUDY_PLANS } from '../../src/data/presets';

describe('Unit Tests: Schedule Rebalance Algorithms & State Mutation', () => {
  const basePlan = PRESET_STUDY_PLANS[0];

  it('should adjust daily task checklist and milestones when missing study days', () => {
    const rebalanced = rebalanceStudyPlan(basePlan, 'I fell behind / missed 1-2 study days');

    expect(rebalanced.readinessScore).toBeGreaterThanOrEqual(basePlan.readinessScore);
    const hasRebalancedTag = rebalanced.dailyTasks.some(t => t.notes?.includes('AI Rebalanced'));
    expect(hasRebalancedTag).toBe(true);
  });

  it('should insert targeted recovery drill task when struggling with a weak area', () => {
    const rebalanced = rebalanceStudyPlan(basePlan, 'I am struggling with a specific weak area');

    const recoveryTask = rebalanced.dailyTasks.find(t => t.title.includes('Recovery Drill'));
    expect(recoveryTask).toBeDefined();
    expect(recoveryTask?.priority).toBe('high');
  });

  it('should unlock next milestone and boost readiness when accelerating velocity', () => {
    const rebalanced = rebalanceStudyPlan(basePlan, 'I want to accelerate my learning velocity');

    expect(rebalanced.readinessScore).toBeGreaterThan(basePlan.readinessScore);
    const hasCurrent = rebalanced.phases.some(p => p.milestones.some(m => m.status === 'current'));
    expect(hasCurrent).toBe(true);
  });
});
