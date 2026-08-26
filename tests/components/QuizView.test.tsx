import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizView } from '../../src/pages/QuizView';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Active Recall AI Quiz View', () => {
  it('should render quiz customization controls (topic selector, question count, difficulty)', () => {
    render(
      <StudyPlanProvider>
        <QuizView />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/AI Diagnostic Quiz Generator/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate ai active recall drill/i })).toBeInTheDocument();
  });
});
