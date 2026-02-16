// API Helper Functions

class API {
  // Get Auth Token from localStorage
  static getToken() {
    return localStorage.getItem(Config.STORAGE_KEYS.TOKEN);
  }

  // Set Auth Token
  static setToken(token) {
    localStorage.setItem(Config.STORAGE_KEYS.TOKEN, token);
  }

  // Clear Auth Token
  static clearToken() {
    localStorage.removeItem(Config.STORAGE_KEYS.TOKEN);
  }

  // Build headers with authentication
  static getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic fetch wrapper
  static async request(endpoint, options = {}) {
    const url = `${Config.API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearToken();
        window.location.href = "#login";
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // GET request
  static get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  static post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // PUT request
  static put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  static delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // ===== AUTH ENDPOINTS =====
  static auth = {
    login: (email, password) => API.post("/auth/login", { email, password }),
    changePassword: (currentPassword, newPassword, confirmPassword) =>
      API.post("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    getCurrentUser: () => API.get("/auth/me"),
    updateProfile: (data) => API.put("/auth/profile", data),
  };

  // ===== ADMIN ENDPOINTS =====
  static admin = {
    createStudent: (data) => API.post("/admin/create-student", data),
    createTeacher: (data) => API.post("/admin/create-teacher", data),
    getAllStudents: () => API.get("/admin/students"),
    getAllTeachers: () => API.get("/admin/teachers"),
    deactivateUser: (userId) => API.put(`/admin/deactivate/${userId}`, {}),
    activateUser: (userId) => API.put(`/admin/activate/${userId}`, {}),
    resetPassword: (userId) => API.post(`/admin/reset-password/${userId}`, {}),
    enrollStudentInSubject: (studentId, subjectId) =>
      API.post("/admin/enroll-student", { studentId, subjectId }),
  };

  // ===== SUBJECT ENDPOINTS =====
  static subjects = {
    getAll: () => API.get("/subjects"),
    getById: (id) => API.get(`/subjects/${id}`),
    create: (data) => API.post("/subjects", data),
    update: (id, data) => API.put(`/subjects/${id}`, data),
    assignTeacher: (subjectId, teacherId) =>
      API.post("/subjects/assign-teacher", { subjectId, teacherId }),
  };

  // ===== GRADE ENDPOINTS =====
  static grades = {
    getByStudent: (studentId) => API.get(`/grades/student/${studentId}`),
    getBySubject: (subjectId) => API.get(`/grades/subject/${subjectId}`),
    encode: (data) => API.post("/grades/encode", data),
  };

  // ===== ANNOUNCEMENT ENDPOINTS =====
  static announcements = {
    getAll: () => API.get("/announcements"),
    getById: (id) => API.get(`/announcements/${id}`),
    create: (data) => API.post("/announcements", data),
    update: (id, data) => API.put(`/announcements/${id}`, data),
    delete: (id) => API.delete(`/announcements/${id}`),
  };

  // ===== PAYMENT ENDPOINTS =====
  static payments = {
    getRecords: (studentId) => API.get(`/payments/records/${studentId}`),
    getBalance: (studentId) => API.get(`/payments/balance/${studentId}`),
    getAll: () => API.get("/payments"),
    create: (data) => API.post("/payments/create", data),
    update: (id, data) => API.put(`/payments/${id}`, data),
  };
}
