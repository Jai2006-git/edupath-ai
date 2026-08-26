import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '../../src/pages/LandingPage';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Landing Page & Interactive Product Tour', () => {
  it('should render the main headline and primary call to action buttons', () => {
    render(
      <StudyPlanProvider>
        <LandingPage />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/Master Any Syllabus/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by Adaptive AI/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore live demo dashboard/i })).toBeInTheDocument();
  });

  it('should render the Social Impact and Problem vs Solution sections', () => {
    render(
      <StudyPlanProvider>
        <LandingPage />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/Democratizing World-Class Mentorship for Every Student/i)).toBeInTheDocument();
    expect(screen.getByText(/The Examination Crisis & How EduPath AI Solves It/i)).toBeInTheDocument();
  });

  it('should allow switching between product tour tabs', () => {
    render(
      <StudyPlanProvider>
        <LandingPage />
      </StudyPlanProvider>
    );

    const quizTab = screen.getByRole('tab', { name: /active recall quiz/i });
    fireEvent.click(quizTab);
    expect(quizTab).toHaveAttribute('aria-selected', 'true');
  });
});
