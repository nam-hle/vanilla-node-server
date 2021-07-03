import { server } from "./controller";

const hostname = "127.0.0.1";
const port = 3000;
export const baseURL = `http://${hostname}:${port}/`;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
