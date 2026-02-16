// Utility Functions

class Utils {
  // Format date
  static formatDate(date) {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Format currency
  static formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return "₱ " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Show error message
  static showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = "block";
    }
  }

  // Clear error message
  static clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = "";
      element.style.display = "none";
    }
  }

  // Show success notification
  static showSuccess(message) {
    const notification = document.createElement("div");
    notification.className = "notification success-notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--color-success);
      color: white;
      padding: 15px 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Show error notification
  static showErrorNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification error-notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--color-error);
      color: white;
      padding: 15px 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Get initials from name
  static getInitials(firstName, lastName) {
    return (
      (firstName ? firstName.charAt(0) : "") +
      (lastName ? lastName.charAt(0) : "")
    );
  }

  // Get status color/class
  static getStatusClass(status) {
    const statusLower = status ? status.toLowerCase() : "";
    if (statusLower === "active") return "status-active";
    if (statusLower === "inactive") return "status-inactive";
    if (statusLower === "paid") return "status-paid";
    if (statusLower === "partial") return "status-partial";
    if (statusLower === "unpaid") return "status-unpaid";
    return "";
  }

  // Validate email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Clone template element
  static cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template ${templateId} not found`);
      return null;
    }
    return template.content.cloneNode(true);
  }

  // Set modal form fields
  static setFormField(form, name, value) {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.value = value;
    }
  }

  // Get form data as object
  static getFormData(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData);
  }

  // Clear form
  static clearForm(form) {
    form.reset();
  }

  // Disable button
  static disableButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = true;
      button.style.opacity = "0.6";
    }
  }

  // Enable button
  static enableButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = false;
      button.style.opacity = "1";
    }
  }

  // Add CSS animation
  static addSlideInAnimation() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize animations
Utils.addSlideInAnimation();
