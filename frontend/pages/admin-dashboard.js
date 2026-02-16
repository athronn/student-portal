// Admin Dashboard Functions

class AdminDashboard {
  static currentUser = null;

  // Initialize admin dashboard
  static async init() {
    this.setupEventListeners();
    await this.loadUserData();
  }

  // Setup event listeners
  static setupEventListeners() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateTo(e.target.dataset.page);
      });
    });

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }
  }

  // Load user data
  static async loadUserData() {
    try {
      const user = Auth.getCurrentUser();
      this.currentUser = user;

      // Update header
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName} (Admin)`;
      }

      // Load default page
      this.navigateTo("admin-users");
    } catch (error) {
      console.error("Error loading user data:", error);
      Utils.showErrorNotification("Failed to load user data");
    }
  }

  // Navigate to page
  static navigateTo(page) {
    // Update active nav link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add("active");

    // Load page
    switch (page) {
      case "admin-users":
        this.showUsersPage();
        break;
      case "admin-subjects":
        this.showSubjectsPage();
        break;
      case "admin-payments":
        this.showPaymentsPage();
        break;
      case "admin-announcements":
        this.showAnnouncementsPage();
        break;
      default:
        this.showUsersPage();
    }
  }

  // Show Users Management Page
  static async showUsersPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("admin-users-page-template");
      contentArea.appendChild(template);

      // Load students
      await this.loadStudents();

      // Setup tabs
      this.setupUserTabs();

      // Setup create buttons
      document
        .getElementById("create-student-btn")
        .addEventListener("click", () => this.showCreateUserModal("student"));
      document
        .getElementById("create-teacher-btn")
        .addEventListener("click", () => this.showCreateUserModal("teacher"));
    } catch (error) {
      console.error("Error loading users:", error);
      Utils.showErrorNotification("Failed to load users");
    }
  }

  // Load students table
  static async loadStudents() {
    try {
      const students = await API.admin.getAllStudents();
      const tbody = document.getElementById("students-tbody");
      tbody.innerHTML = "";

      students.forEach((student) => {
        const row = tbody.insertRow();
        const statusClass = Utils.getStatusClass(
          student.isActive ? "active" : "inactive",
        );
        row.innerHTML = `
          <td>${student.studentID}</td>
          <td>${student.firstName} ${student.lastName}</td>
          <td>${student.email}</td>
          <td>${student.contact || "N/A"}</td>
          <td><span class="status-badge ${statusClass}">${student.isActive ? "Active" : "Inactive"}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.editUser('${student._id}', 'student')">Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.toggleUserStatus('${student._id}', ${student.isActive})">
              ${student.isActive ? "Deactivate" : "Activate"}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.resetUserPassword('${student._id}')">Reset Password</button>
          </td>
        `;
      });

      if (students.length === 0) {
        tbody.insertRow().innerHTML =
          '<td colspan="6" class="text-center">No students found.</td>';
      }
    } catch (error) {
      console.error("Error loading students:", error);
    }
  }

  // Load teachers table
  static async loadTeachers() {
    try {
      const teachers = await API.admin.getAllTeachers();
      const tbody = document.getElementById("teachers-tbody");
      tbody.innerHTML = "";

      teachers.forEach((teacher) => {
        const row = tbody.insertRow();
        const statusClass = Utils.getStatusClass(
          teacher.isActive ? "active" : "inactive",
        );
        row.innerHTML = `
          <td>${teacher._id.substring(0, 8)}</td>
          <td>${teacher.firstName} ${teacher.lastName}</td>
          <td>${teacher.email}</td>
          <td>${teacher.contact || "N/A"}</td>
          <td><span class="status-badge ${statusClass}">${teacher.isActive ? "Active" : "Inactive"}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.editUser('${teacher._id}', 'teacher')">Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.toggleUserStatus('${teacher._id}', ${teacher.isActive})">
              ${teacher.isActive ? "Deactivate" : "Activate"}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.resetUserPassword('${teacher._id}')">Reset Password</button>
          </td>
        `;
      });

      if (teachers.length === 0) {
        tbody.insertRow().innerHTML =
          '<td colspan="6" class="text-center">No teachers found.</td>';
      }
    } catch (error) {
      console.error("Error loading teachers:", error);
    }
  }

  // Setup user tabs
  static setupUserTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        btn.classList.add("active");
        const tab = document.getElementById(btn.dataset.tab + "-tab");
        if (tab) {
          tab.classList.add("active");
          if (btn.dataset.tab === "teachers") {
            this.loadTeachers();
          }
        }
      });
    });
  }

  // Show create user modal
  static showCreateUserModal(userType) {
    const app = document.getElementById("app");
    const modalTemplate = Utils.cloneTemplate("create-user-modal-template");

    const modal = document.createElement("div");
    modal.innerHTML = modalTemplate.innerHTML;
    app.appendChild(modal);

    const overlay = document.getElementById("user-modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("create-user-form");

    modalTitle.textContent = `Create New ${userType === "student" ? "Student" : "Teacher"}`;

    // Setup form submission
    form.addEventListener("submit", (e) =>
      this.handleCreateUser(e, userType, overlay),
    );

    // Setup close button
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  // Handle create user
  static async handleCreateUser(e, userType, overlay) {
    e.preventDefault();
    Utils.clearError("modal-error");

    const form = e.target;
    const data = Utils.getFormData(form);

    try {
      if (userType === "student") {
        await API.admin.createStudent(data);
      } else {
        await API.admin.createTeacher(data);
      }

      Utils.showSuccess(
        `${userType === "student" ? "Student" : "Teacher"} created successfully`,
      );
      overlay.remove();
      this.loadStudents();
    } catch (error) {
      Utils.showError("modal-error", error.message);
    }
  }

  // Toggle user status
  static async toggleUserStatus(userId, currentStatus) {
    if (
      !confirm(
        `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this user?`,
      )
    ) {
      return;
    }

    try {
      if (currentStatus) {
        await API.admin.deactivateUser(userId);
      } else {
        await API.admin.activateUser(userId);
      }
      Utils.showSuccess("User status updated successfully");
      this.loadStudents();
    } catch (error) {
      Utils.showErrorNotification(error.message);
    }
  }

  // Reset user password
  static async resetUserPassword(userId) {
    if (
      !confirm(
        "Reset password for this user? They will receive a temporary password.",
      )
    ) {
      return;
    }

    try {
      const result = await API.admin.resetPassword(userId);
      Utils.showSuccess(
        `Password reset. New temporary password: ${result.newPassword}`,
      );
      alert(
        `Temporary Password: ${result.newPassword}\n\nPlease share this with the user securely.`,
      );
      this.loadStudents();
    } catch (error) {
      Utils.showErrorNotification(error.message);
    }
  }

  // Show Subjects Management Page
  static async showSubjectsPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("admin-subjects-page-template");
      contentArea.appendChild(template);

      // Load subjects
      const subjects = await API.subjects.getAll();
      const tbody = document.getElementById("subjects-tbody");
      tbody.innerHTML = "";

      subjects.forEach((subject) => {
        const row = tbody.insertRow();
        row.innerHTML = `
          <td>${subject.code}</td>
          <td>${subject.name}</td>
          <td>${subject.semester}</td>
          <td>${subject.units}</td>
          <td>${subject.assignedTeacher ? `${subject.assignedTeacher.firstName} ${subject.assignedTeacher.lastName}` : "Unassigned"}</td>
          <td>${subject.enrolledStudents.length}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.editSubject('${subject._id}')">Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.assignTeacherModal('${subject._id}')">Assign Teacher</button>
          </td>
        `;
      });

      if (subjects.length === 0) {
        tbody.insertRow().innerHTML =
          '<td colspan="7" class="text-center">No subjects found.</td>';
      }

      // Setup create button
      document
        .getElementById("create-subject-btn")
        .addEventListener("click", () => this.showCreateSubjectModal());
    } catch (error) {
      console.error("Error loading subjects:", error);
      Utils.showErrorNotification("Failed to load subjects");
    }
  }

  // Show Payments Management Page
  static async showPaymentsPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("admin-payments-page-template");
      contentArea.appendChild(template);

      // Load payments
      const payments = await API.payments.getAll();
      const tbody = document.getElementById("admin-payment-tbody");
      tbody.innerHTML = "";

      payments.forEach((payment) => {
        const row = tbody.insertRow();
        const statusClass = Utils.getStatusClass(payment.status);
        row.innerHTML = `
          <td>${payment.student.firstName} ${payment.student.lastName}</td>
          <td>${payment.student.studentID}</td>
          <td>${payment.academicYear}</td>
          <td>${payment.semester}</td>
          <td>${Utils.formatCurrency(payment.totalAmount)}</td>
          <td>${Utils.formatCurrency(payment.amountPaid)}</td>
          <td>${Utils.formatCurrency(payment.balance)}</td>
          <td><span class="status-badge ${statusClass}">${payment.status}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="AdminDashboard.editPayment('${payment._id}')">Update</button>
          </td>
        `;
      });

      if (payments.length === 0) {
        tbody.insertRow().innerHTML =
          '<td colspan="9" class="text-center">No payment records found.</td>';
      }

      // Setup create button
      document
        .getElementById("create-payment-btn")
        .addEventListener("click", () => this.showCreatePaymentModal());
    } catch (error) {
      console.error("Error loading payments:", error);
      Utils.showErrorNotification("Failed to load payments");
    }
  }

  // Show Announcements Page
  static async showAnnouncementsPage() {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML =
      '<p class="text-center">Announcement management coming soon.</p>';
  }

  // Show subjects page
  static showCreateSubjectModal() {
    alert("Create subject form - To be implemented");
  }

  // Edit subject
  static editSubject(subjectId) {
    alert("Edit subject form - To be implemented");
  }

  // Assign teacher modal
  static assignTeacherModal(subjectId) {
    alert("Assign teacher form - To be implemented");
  }

  // Edit user
  static editUser(userId, userType) {
    alert(`Edit ${userType} form - To be implemented`);
  }

  // Edit payment
  static editPayment(paymentId) {
    alert("Edit payment form - To be implemented");
  }

  // Show create payment modal
  static showCreatePaymentModal() {
    alert("Create payment form - To be implemented");
  }

  // Logout
  static logout() {
    if (confirm("Are you sure you want to logout?")) {
      Auth.logout();
      window.location.hash = "#login";
    }
  }
}
