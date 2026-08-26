import { describe, it, expect } from 'vitest';
import { PRESET_STUDY_PLANS } from '../../src/data/presets';
import { rebalanceStudyPlan, generateQuizQuestions } from '../../src/services/aiService';

describe('End-to-End Workflow & Core State Invariants', () => {
  it('Complete Student Lifecycle: Preset Load -> Milestone Completion -> Active Recall Quiz -> Schedule Rebalance', () => {
    // 1. Initial State
    const plan = JSON.parse(JSON.stringify(PRESET_STUDY_PLANS[0]));
    expect(plan.phases.length).toBeGreaterThanOrEqual(3);
    const initialScore = plan.readinessScore;

    // 2. Locate Active Milestone and Complete it
    const activeMilestone = plan.phases.flatMap((p: any) => p.milestones).find((m: any) => m.status === 'in-progress' || m.status === 'pending');
    expect(activeMilestone).toBeDefined();

    if (activeMilestone) {
      activeMilestone.status = 'completed';
      activeMilestone.progress = 100;
      plan.readinessScore = Math.min(100, plan.readinessScore + 10);
    }
    expect(plan.readinessScore).toBeGreaterThan(initialScore);

    // 3. Generate Active Recall Quiz
    const quizQuestions = generateQuizQuestions(plan.subject, 5, 'medium');
    expect(quizQuestions.length).toBeGreaterThanOrEqual(3);

    // 4. Trigger Dynamic Schedule Rebalancing
    const rebalancedPlan = rebalanceStudyPlan(plan, 'I fell behind / missed 1-2 study days');
    expect(rebalancedPlan.dailyTasks.length).toBeGreaterThan(0);
    expect(rebalancedPlan.readinessScore).toBeGreaterThanOrEqual(plan.readinessScore);
  });
});
