import { useState, useEffect, useCallback } from 'react';

export interface UseStudyTimerOptions {
  initialSeconds?: number;
  countDown?: boolean;
  onTimeExpired?: () => void;
}

export function useStudyTimer({
  initialSeconds = 60,
  countDown = true,
  onTimeExpired
}: UseStudyTimerOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTotal, setElapsedTotal] = useState(0);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback((newSeconds = initialSeconds) => {
    setSeconds(newSeconds);
    setElapsedTotal(0);
    setIsActive(false);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTotal(prev => prev + 1);

        if (countDown) {
          setSeconds(prev => {
            if (prev <= 1) {
              setIsActive(false);
              onTimeExpired?.();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setSeconds(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, countDown, onTimeExpired]);

  const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  return {
    seconds,
    elapsedTotal,
    isActive,
    formattedTime,
    start,
    pause,
    reset,
    setSeconds
  };
}
