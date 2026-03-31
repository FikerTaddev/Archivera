import app from "./app.ts";
import {env} from "./config/env.ts"

const PORT = env.PORT ? Number(env.PORT) : 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Gracefully Shutting down...");
  server.close(() => process.exit(0));
});