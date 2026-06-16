export const HOME = {
  emergentLink: "emergent-link",
  heroStartBtn: "hero-start-quiz-btn",
  navLogo: "nav-logo",
  navAdminLink: "nav-admin-link",
  ctaBookBtn: "cta-book-appointment-btn",
};

export const LEAD = {
  name: "input-name",
  email: "input-email",
  dob: "input-dob",
  dobTrigger: "input-dob-trigger",
  age: "input-age",
  genderTrigger: "input-gender-trigger",
  location: "input-location",
  submit: "lead-submit-btn",
};

export const QUIZ = {
  progress: "quiz-progress",
  option: (qid, idx) => `quiz-option-${qid}-${idx}`,
  next: "quiz-next-btn",
  back: "quiz-back-btn",
  restart: "quiz-restart-btn",
  shareWa: "share-whatsapp-btn",
  shareTwitter: "share-twitter-btn",
  shareCopy: "share-copy-btn",
  bookAppointment: "result-book-appointment-btn",
};

export const ADMIN = {
  email: "admin-email",
  password: "admin-password",
  loginBtn: "admin-login-btn",
  logoutBtn: "admin-logout-btn",
  tableRow: (id) => `admin-row-${id}`,
};
