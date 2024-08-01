import "dotenv/config";

export default {
  email: process.env.SUPER_USER_EMAIL || "admin@admin.com",
  password: process.env.SUPER_USER_PASSWORD || "admin123",
};
