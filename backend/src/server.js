import ora from "ora";
import app from "./app.js";
import "dotenv/config";

app.listen(process.env.PORT || 3333, () => {
  ora("Server running...").succeed();
});
