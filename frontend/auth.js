// Authentication Functions

class Auth {
  // Get current user from localStorage
  static getCurrentUser() {
    const userStr = localStorage.getItem(Config.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set current user in localStorage
  static setCurrentUser(user) {
    localStorage.setItem(Config.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Check if user is logged in
  static isLoggedIn() {
    return !!API.getToken();
  }

  // Login user
  static async login(email, password) {
    try {
      const response = await API.auth.login(email, password);

      // Store token and user info
      API.setToken(response.token);
      this.setCurrentUser(response.user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  static logout() {
    API.clearToken();
    localStorage.removeItem(Config.STORAGE_KEYS.USER);
    sessionStorage.clear();
  }

  // Check if user must change password
  static mustChangePassword() {
    const user = this.getCurrentUser();
    return user && user.mustChangePassword;
  }

  // Get user role
  static getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Check if user has role
  static hasRole(role) {
    return this.getUserRole() === role;
  }

  // Check if user is admin
  static isAdmin() {
    return this.hasRole("admin");
  }

  // Check if user is teacher
  static isTeacher() {
    return this.hasRole("teacher");
  }

  // Check if user is student
  static isStudent() {
    return this.hasRole("student");
  }

  // Get user ID
  static getUserId() {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  // Get user email
  static getUserEmail() {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }

  // Check authorization for page/action
  static canAccess(requiredRole) {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(this.getUserRole());
    }
    return this.hasRole(requiredRole);
  }

  // Verify token is still valid by checking current user
  static async verifyToken() {
    try {
      const response = await API.auth.getCurrentUser();
      this.setCurrentUser(response);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}
