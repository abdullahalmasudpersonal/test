import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const server: Server = app.listen(3000, () => {
    console.log("Server is running on port", 3000);
  });
}

main();
