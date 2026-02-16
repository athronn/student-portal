// Student Dashboard Functions

class StudentDashboard {
  static currentUser = null;

  // Initialize student dashboard
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

      // Update header with user name
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName}`;
      }

      // Check if must change password
      if (Auth.mustChangePassword()) {
        this.showChangePasswordPage();
      } else {
        // Load default page
        this.navigateTo("profile");
      }
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

    // Load page content
    switch (page) {
      case "profile":
        this.showProfilePage();
        break;
      case "subjects":
        this.showSubjectsPage();
        break;
      case "grades":
        this.showGradesPage();
        break;
      case "announcements":
        this.showAnnouncementsPage();
        break;
      case "materials":
        this.showMaterialsPage();
        break;
      case "tuition":
        this.showTuitionPage();
        break;
      default:
        this.showProfilePage();
    }
  }

  // Show Profile Page
  static async showProfilePage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("profile-page-template");
      contentArea.appendChild(template);

      // Load user data
      const user = await API.auth.getCurrentUser();

      // Populate profile
      document.getElementById("avatar-initials").textContent =
        Utils.getInitials(user.firstName, user.lastName);
      document.getElementById("profile-name").textContent =
        `${user.firstName} ${user.lastName}`;
      document.getElementById("profile-student-id").textContent =
        user.studentID;
      document.getElementById("profile-email").textContent = user.email;
      document.getElementById("profile-contact").textContent =
        user.contact || "Not provided";
      document.getElementById("profile-address").textContent =
        user.address || "Not provided";
      document.getElementById("profile-dob").textContent = user.dateOfBirth
        ? Utils.formatDate(user.dateOfBirth)
        : "Not provided";

      // Setup edit button
      document
        .getElementById("edit-profile-btn")
        .addEventListener("click", () => {
          this.showEditProfileForm(user);
        });

      // Setup cancel button
      const cancelBtn = document.getElementById("cancel-edit-btn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          document.getElementById("edit-profile-form").style.display = "none";
        });
      }

      // Setup form submission
      const profileEditForm = document.getElementById("profile-edit-form");
      if (profileEditForm) {
        profileEditForm.addEventListener("submit", (e) =>
          this.handleProfileUpdate(e, user),
        );
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Utils.showErrorNotification("Failed to load profile");
    }
  }

  // Show edit profile form
  static showEditProfileForm(user) {
    Utils.setFormField(
      document.getElementById("profile-edit-form"),
      "firstName",
      user.firstName,
    );
    Utils.setFormField(
      document.getElementById("profile-edit-form"),
      "lastName",
      user.lastName,
    );
    Utils.setFormField(
      document.getElementById("profile-edit-form"),
      "contact",
      user.contact,
    );
    Utils.setFormField(
      document.getElementById("profile-edit-form"),
      "address",
      user.address,
    );
    document.getElementById("edit-profile-form").style.display = "block";
  }

  // Handle profile update
  static async handleProfileUpdate(e, user) {
    e.preventDefault();
    Utils.clearError("profile-edit-error");

    const form = e.target;
    const data = Utils.getFormData(form);

    try {
      Utils.disableButton(
        form.querySelector('button[type="submit"]').id || "submit-btn",
      );

      await API.auth.updateProfile(data);
      Utils.showSuccess("Profile updated successfully");
      document.getElementById("edit-profile-form").style.display = "none";

      // Reload profile
      this.showProfilePage();
    } catch (error) {
      Utils.showError("profile-edit-error", error.message);
    } finally {
      Utils.enableButton("submit-btn");
    }
  }

  // Show Subjects Page
  static async showSubjectsPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("subjects-page-template");
      contentArea.appendChild(template);

      // Load subjects
      const subjects = await API.subjects.getAll();
      const subjectsGrid = document.getElementById("subjects-grid");
      subjectsGrid.innerHTML = "";

      subjects.forEach((subject) => {
        const card = document.createElement("div");
        card.className = "subject-card";
        card.innerHTML = `
          <span class="subject-code">${subject.code}</span>
          <h3>${subject.name}</h3>
          <p>${subject.description}</p>
          <div class="subject-meta">
            <p><strong>Units:</strong> ${subject.units}</p>
            <p><strong>Semester:</strong> ${subject.semester}</p>
            ${subject.assignedTeacher ? `<p><strong>Teacher:</strong> ${subject.assignedTeacher.firstName} ${subject.assignedTeacher.lastName}</p>` : ""}
          </div>
        `;
        subjectsGrid.appendChild(card);
      });

      if (subjects.length === 0) {
        subjectsGrid.innerHTML =
          '<p class="text-center">No subjects enrolled yet.</p>';
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
      Utils.showErrorNotification("Failed to load subjects");
    }
  }

  // Show Grades Page
  static async showGradesPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("grades-page-template");
      contentArea.appendChild(template);

      // Load grades
      const user = Auth.getCurrentUser();
      const grades = await API.grades.getByStudent(user.id);
      const gradesTbody = document.getElementById("grades-tbody");
      gradesTbody.innerHTML = "";

      grades.forEach((grade) => {
        const row = gradesTbody.insertRow();
        row.innerHTML = `
          <td>${grade.subject.code} - ${grade.subject.name}</td>
          <td>${grade.midterm !== null ? grade.midterm : "N/A"}</td>
          <td>${grade.finals !== null ? grade.finals : "N/A"}</td>
          <td>${grade.projects !== null ? grade.projects : "N/A"}</td>
          <td>${grade.participation !== null ? grade.participation : "N/A"}</td>
          <td><strong>${grade.finalGrade !== null ? grade.finalGrade : "N/A"}</strong></td>
        `;
      });

      if (grades.length === 0) {
        gradesTbody.insertRow().innerHTML =
          '<td colspan="6" class="text-center">No grades available yet.</td>';
      }
    } catch (error) {
      console.error("Error loading grades:", error);
      Utils.showErrorNotification("Failed to load grades");
    }
  }

  // Show Announcements Page
  static async showAnnouncementsPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("announcements-page-template");
      contentArea.appendChild(template);

      // Load announcements
      const announcements = await API.announcements.getAll();
      const announcementsList = document.getElementById("announcements-list");
      announcementsList.innerHTML = "";

      announcements.forEach((announcement) => {
        const card = document.createElement("div");
        card.className = "announcement-card";
        card.innerHTML = `
          <h3>${announcement.title}</h3>
          <div class="announcement-meta">
            <strong>Posted by:</strong> ${announcement.createdBy.firstName} ${announcement.createdBy.lastName} | 
            <strong>Date:</strong> ${Utils.formatDate(announcement.createdAt)}
          </div>
          <div class="announcement-content">
            ${announcement.content}
          </div>
        `;
        announcementsList.appendChild(card);
      });

      if (announcements.length === 0) {
        announcementsList.innerHTML =
          '<p class="text-center">No announcements at this time.</p>';
      }
    } catch (error) {
      console.error("Error loading announcements:", error);
      Utils.showErrorNotification("Failed to load announcements");
    }
  }

  // Show Materials Page
  static showMaterialsPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("materials-page-template");
      contentArea.appendChild(template);

      // Note: Material loading would require additional API endpoint
      const materialsList = document.getElementById("materials-list");
      materialsList.innerHTML =
        '<p class="text-center">Learning materials will be available soon.</p>';
    } catch (error) {
      console.error("Error loading materials:", error);
      Utils.showErrorNotification("Failed to load materials");
    }
  }

  // Show Tuition Page
  static async showTuitionPage() {
    try {
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "";

      const template = Utils.cloneTemplate("tuition-page-template");
      contentArea.appendChild(template);

      // Load payment data
      const user = Auth.getCurrentUser();
      const paymentData = await API.payments.getBalance(user.id);

      // Update summary cards
      document.getElementById("total-balance").textContent =
        Utils.formatCurrency(paymentData.totalBalance);
      document.getElementById("total-paid").textContent = Utils.formatCurrency(
        paymentData.totalPaid,
      );
      document.getElementById("total-amount").textContent =
        Utils.formatCurrency(paymentData.totalAmount);

      // Load payment table
      const paymentTbody = document.getElementById("payment-tbody");
      paymentTbody.innerHTML = "";

      paymentData.details.forEach((payment) => {
        const row = paymentTbody.insertRow();
        const statusClass = Utils.getStatusClass(payment.status);
        row.innerHTML = `
          <td>${payment.academicYear}</td>
          <td>${payment.semester}</td>
          <td>${Utils.formatCurrency(payment.totalAmount)}</td>
          <td>${Utils.formatCurrency(payment.amountPaid)}</td>
          <td>${Utils.formatCurrency(payment.balance)}</td>
          <td><span class="status-badge ${statusClass}">${payment.status}</span></td>
          <td>${Utils.formatDate(payment.dueDate)}</td>
        `;
      });

      if (paymentData.details.length === 0) {
        paymentTbody.insertRow().innerHTML =
          '<td colspan="7" class="text-center">No payment records found.</td>';
      }
    } catch (error) {
      console.error("Error loading tuition:", error);
      Utils.showErrorNotification("Failed to load tuition information");
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

    const form = e.target;
    const data = Utils.getFormData(form);

    if (data.newPassword !== data.confirmPassword) {
      Utils.showError("change-password-error", "Passwords do not match");
      return;
    }

    try {
      await API.auth.changePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmPassword,
      );
      Utils.showSuccess("Password changed successfully");

      // Reload user and show dashboard
      const user = Auth.getCurrentUser();
      user.mustChangePassword = false;
      Auth.setCurrentUser(user);

      // Reload app
      window.location.hash = "#dashboard";
    } catch (error) {
      Utils.showError("change-password-error", error.message);
    }
  }

  // Logout
  static logout() {
    if (confirm("Are you sure you want to logout?")) {
      Auth.logout();
      window.location.hash = "#login";
    }
  }
}
