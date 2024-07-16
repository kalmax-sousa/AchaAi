import "dotenv/config";

export default {
  secret: process.env.APP_SECRET || "das78gf93jlsmbpçx2v939v",
  expiresIn: "90d",
};
