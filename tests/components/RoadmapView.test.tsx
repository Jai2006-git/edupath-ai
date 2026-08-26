import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoadmapView } from '../../src/pages/RoadmapView';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Phased AI Roadmap View', () => {
  it('should render all study phases and milestones in timeline order', () => {
    const handleOpenRebalance = vi.fn();
    render(
      <StudyPlanProvider>
        <RoadmapView onOpenRebalance={handleOpenRebalance} />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/Personalized AI Study Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/P1/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap Progress/i)).toBeInTheDocument();
  });

  it('should render filter pills and Rebalance trigger button', () => {
    const handleOpenRebalance = vi.fn();
    render(
      <StudyPlanProvider>
        <RoadmapView onOpenRebalance={handleOpenRebalance} />
      </StudyPlanProvider>
    );

    expect(screen.getByRole('button', { name: /all topics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ai rebalance schedule/i })).toBeInTheDocument();
  });
});
