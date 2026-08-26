import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TutorView } from '../../src/pages/TutorView';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: 24/7 Context-Aware AI Tutor View', () => {
  it('should render AI tutor header and message input field', () => {
    render(
      <StudyPlanProvider>
        <TutorView />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/EduPath 24\/7 AI Study Tutor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask tutor/i })).toBeInTheDocument();
  });
});
