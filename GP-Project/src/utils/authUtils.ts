// utils/authUtils.ts
export function isTokenValid(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the payload
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp > currentTime; // Check if the token has not expired
  } catch (error) {
    return false; // If decoding fails, the token is invalid
  }
}

export function clearSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
