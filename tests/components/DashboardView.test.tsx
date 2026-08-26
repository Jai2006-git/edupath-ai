import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardView } from '../../src/pages/DashboardView';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Student Dashboard View', () => {
  it('should render core KPI cards (Readiness Score, Study Streak, Countdown)', () => {
    const handleOpenRebalance = vi.fn();
    render(
      <StudyPlanProvider>
        <DashboardView onOpenRebalance={handleOpenRebalance} />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/Exam Readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Study Streak/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's Actionable Tasks/i)).toBeInTheDocument();
  });

  it('should render Next Recommended Topic with explainable rationale', () => {
    const handleOpenRebalance = vi.fn();
    render(
      <StudyPlanProvider>
        <DashboardView onOpenRebalance={handleOpenRebalance} />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/Next Recommended Topic/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Recommended/i)).toBeInTheDocument();
  });
});
