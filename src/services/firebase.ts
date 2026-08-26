/**
 * Google Firebase Integration Service for EduPath AI
 * Provides optional user authentication and cloud persistence for study plans and quiz history.
 * If Firebase environment variables are not supplied, the app operates in resilient guest mode.
 */

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export interface FirebaseSyncStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
  currentUser: FirebaseUser | null;
  lastSyncTimestamp: number | null;
}

/**
 * Checks if Firebase configuration is provided via environment variables
 */
export function isFirebaseConfigured(): boolean {
  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    return Boolean(apiKey && projectId && typeof apiKey === 'string' && apiKey.length > 5);
  } catch (e) {
    return false;
  }
}

/**
 * Returns current sync status
 */
export function getFirebaseSyncStatus(): FirebaseSyncStatus {
  const configured = isFirebaseConfigured();
  return {
    isConfigured: configured,
    isAuthenticated: false,
    currentUser: null,
    lastSyncTimestamp: null
  };
}
