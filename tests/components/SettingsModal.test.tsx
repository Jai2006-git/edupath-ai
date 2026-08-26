import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsModal } from '../../src/components/SettingsModal';
import { StudyPlanProvider } from '../../src/context/StudyPlanContext';

describe('Component Tests: Settings Modal', () => {
  it('should render API key input and preset reload buttons when open', () => {
    const handleClose = vi.fn();
    render(
      <StudyPlanProvider>
        <SettingsModal isOpen={true} onClose={handleClose} />
      </StudyPlanProvider>
    );

    expect(screen.getByText(/App Settings & AI Engine/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save key/i })).toBeInTheDocument();
    expect(screen.getByText(/Reload Built-In Hackathon Presets/i)).toBeInTheDocument();
  });
});
