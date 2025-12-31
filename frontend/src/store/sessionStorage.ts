export class SessionStorage {
  private static TOKEN_KEY = 'authToken';
  static saveToken(token: string | null) {
    if (token) {
      sessionStorage.setItem(SessionStorage.TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(SessionStorage.TOKEN_KEY);
    }
  }

  static getToken(): string | null {
    return sessionStorage.getItem(SessionStorage.TOKEN_KEY);
  }

  static clearToken() {
    sessionStorage.removeItem(SessionStorage.TOKEN_KEY);
  }
}
