// ============================================
// SITE CONFIGURATION
// ============================================

const siteConfig = {
  // Personal Information
  name: "Mahesh Patil",

  // Contact Information
  email: "mspatil551@gmail.com",
  phone: "+91 9422830152",
  location: "Maharashtra, India",

  // Location
  locationUrl:
    "https://www.google.com/maps/search/?api=1&query=Maharashtra%2C%20India",

  // Professional Links
  resume: "#",

  social: {
    linkedin: {
      url: "https://www.linkedin.com/in/mspatil551/",
      label: "linkedin.com/in/mspatil551",
    },

    github: {
      url: "https://github.com/mspatil551",
      label: "github.com/mspatil551",
    },

    instagram: {
      url: "https://www.instagram.com/mspatil551/",
      label: "instagram.com/mspatil551",
    },

    twitter: {
      url: "https://x.com/mspatil551",
      label: "x.com/mspatil551",
    },
  },
};

// ============================================
// APPLY SITE CONFIGURATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------
  // Site Name
  // --------------------------------------------

  document.querySelectorAll("[data-site-name]").forEach((element) => {
    element.textContent = siteConfig.name;
  });

  // --------------------------------------------
  // Email
  // --------------------------------------------

  document.querySelectorAll("[data-email]").forEach((element) => {
    element.textContent = siteConfig.email;
    element.href = `mailto:${siteConfig.email}`;
  });

  // --------------------------------------------
  // Phone
  // --------------------------------------------

  document.querySelectorAll("[data-phone]").forEach((element) => {
    element.textContent = siteConfig.phone;

    // Remove spaces and formatting for tel link
    const phoneNumber = siteConfig.phone.replace(/[^\d+]/g, "");

    element.href = `tel:${phoneNumber}`;
  });

  // --------------------------------------------
  // Location
  // --------------------------------------------

  document.querySelectorAll("[data-location]").forEach((element) => {
    element.textContent = siteConfig.location;
    element.href = siteConfig.locationUrl;
  });

  // --------------------------------------------
  // Resume
  // --------------------------------------------

  document.querySelectorAll("[data-resume]").forEach((element) => {
    element.href = siteConfig.resume;
  });

  // --------------------------------------------
  // Social Links
  // --------------------------------------------

  document.querySelectorAll("[data-social]").forEach((link) => {
    const social = link.dataset.social;
    const socialData = siteConfig.social[social];

    if (!socialData) {
      return;
    }

    link.href = socialData.url;

    // Update visible text if the element doesn't
    // contain another element such as an icon.
    if (link.dataset.socialText !== "false") {
      const textElement = link.querySelector("[data-social-label]");

      if (textElement) {
        textElement.textContent = socialData.label;
      }
    }
  });
});
