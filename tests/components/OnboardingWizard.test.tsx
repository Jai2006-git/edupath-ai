import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingWizard } from '../../src/pages/OnboardingWizard';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: 5-Step Onboarding Wizard', () => {
  it('should render Step 1 form field and validate required input', () => {
    render(
      <StudyPlanProvider>
        <OnboardingWizard />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/What subject or examination are you preparing for/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/e.g. Data Structures & Algorithms/i);
    expect(input).toBeInTheDocument();
  });

  it('should advance to next step when valid subject is provided', () => {
    render(
      <StudyPlanProvider>
        <OnboardingWizard />
      </StudyPlanProvider>
    );

    const input = screen.getByPlaceholderText(/e.g. Data Structures & Algorithms/i);
    fireEvent.change(input, { target: { value: 'Operating Systems & Concurrency' } });

    const continueBtn = screen.getByRole('button', { name: /next: syllabus topics/i });
    fireEvent.click(continueBtn);

    expect(screen.getByText(/Enter Your Topics & Chapters/i)).toBeInTheDocument();
  });
});
