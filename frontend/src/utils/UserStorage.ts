export interface User {
  fullName: string;
  email: string;
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem("vast_user");

  if (!user) return null;

  return JSON.parse(user);
}

export function getProfileImage(): string {
  return (
    localStorage.getItem("vast_profile_image") || ""
  );
}