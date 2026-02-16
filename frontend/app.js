// Main Application File

class App {
  static init() {
    this.setupRouter();
    this.setupGlobalListeners();
    this.checkAuthState();
  }

  // Setup routing
  static setupRouter() {
    window.addEventListener("hashchange", () => {
      this.route();
    });
    this.route();
  }

  // Route to appropriate view
  static route() {
    const hash = window.location.hash.slice(1) || "login";
    const app = document.getElementById("app");

    // Check if user is logged in
    if (hash !== "login" && !Auth.isLoggedIn()) {
      window.location.hash = "#login";
      return;
    }

    // Route based on path
    switch (hash) {
      case "login":
        this.showLoginPage();
        break;
      case "dashboard":
        this.showDashboard();
        break;
      default:
        window.location.hash = "#login";
    }
  }

  // Show login page
  static showLoginPage() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const template = Utils.cloneTemplate("login-template");
    app.appendChild(template);

    // Setup form
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (e) => this.handleLogin(e));
  }

  // Handle login
  static async handleLogin(e) {
    e.preventDefault();
    Utils.clearError("login-error");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validate inputs
    if (!email || !password) {
      Utils.showError("login-error", "Email and password are required");
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Utils.showError("login-error", "Please enter a valid email address");
      return;
    }

    try {
      const loginBtn = document.querySelector('button[type="submit"]');
      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      // Call login API
      const response = await Auth.login(email, password);

      Utils.showSuccess("Login successful!");

      // Redirect based on role and password change requirement
      if (response.user.mustChangePassword) {
        // Show change password screen
        this.showChangePasswordPage();
      } else {
        // Show dashboard
        window.location.hash = "#dashboard";
      }
    } catch (error) {
      Utils.showError(
        "login-error",
        error.message || "Login failed. Please try again.",
      );
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
      }
    }
  }

  // Show change password page
  static showChangePasswordPage() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const template = Utils.cloneTemplate("change-password-template");
    app.appendChild(template);

    const form = document.getElementById("change-password-form");
    form.addEventListener("submit", (e) => this.handlePasswordChange(e));
  }

  // Handle password change
  static async handlePasswordChange(e) {
    e.preventDefault();
    Utils.clearError("change-password-error");

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Utils.showError("change-password-error", "All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      Utils.showError(
        "change-password-error",
        "New password must be at least 6 characters",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Utils.showError("change-password-error", "New passwords do not match");
      return;
    }

    try {
      const submitBtn = document.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Changing password...";

      // Call change password API
      await API.auth.changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      Utils.showSuccess("Password changed successfully!");

      // Update user object to reflect password change
      const user = Auth.getCurrentUser();
      user.mustChangePassword = false;
      Auth.setCurrentUser(user);

      // Redirect to dashboard
      setTimeout(() => {
        window.location.hash = "#dashboard";
      }, 1000);
    } catch (error) {
      Utils.showError(
        "change-password-error",
        error.message || "Failed to change password",
      );
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Change Password";
      }
    }
  }

  // Show dashboard based on user role
  static showDashboard() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const userRole = Auth.getUserRole();

    if (userRole === "student") {
      const template = Utils.cloneTemplate("student-dashboard-template");
      app.appendChild(template);
      StudentDashboard.init();
    } else if (userRole === "admin" || userRole === "teacher") {
      const template = Utils.cloneTemplate("admin-dashboard-template");
      app.appendChild(template);
      AdminDashboard.init();
    } else {
      // Unknown role, logout
      Auth.logout();
      window.location.hash = "#login";
    }
  }

  // Setup global listeners
  static setupGlobalListeners() {
    // Handle 401 errors globally
    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason && event.reason.message === "Token is not valid") {
        Auth.logout();
        window.location.hash = "#login";
      }
    });
  }

  // Check auth state on page load
  static async checkAuthState() {
    if (Auth.isLoggedIn()) {
      // Verify token is still valid
      try {
        // Just route to the appropriate page
        const hash = window.location.hash.slice(1) || "login";
        if (hash === "login") {
          window.location.hash = "#dashboard";
        }
      } catch (error) {
        Auth.logout();
        window.location.hash = "#login";
      }
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎓 Interface Computer College Student Portal - Starting...");
  App.init();
});

// Handle page unload
window.addEventListener("beforeunload", () => {
  // Keep session alive by not clearing anything here
});
