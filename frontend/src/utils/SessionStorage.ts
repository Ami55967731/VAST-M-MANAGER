const SESSION_KEY = "vast_session";

export interface Session {
  email: string;
  isLoggedIn: boolean;
}

export function createSession(email: string): void {
  const session: Session = {
    email,
    isLoggedIn: true,
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );
}

export function getSession(): Session | null {
  const session = localStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  return JSON.parse(session) as Session;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}