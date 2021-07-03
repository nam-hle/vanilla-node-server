import http from "http";
import { URL } from "url";
import { baseURL } from "./server";
import {
  addTasks,
  addTitle,
  editTitle,
  readProject,
  deleteProject,
} from "./services";
import { respondError } from "./utils";

export const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "", baseURL);

  console.log("Request Type: " + req.method + " Endpoint: " + url.pathname);
  if (url.pathname === "/projects" && req.method === "GET") {
    readProject(req, res);
  } else if (url.pathname === "/projects" && req.method === "POST") {
    addTitle(req, res);
  } else if (url.pathname === "/projects/tasks" && req.method === "POST") {
    addTasks(req, res);
  } else if (url.pathname === "/projects" && req.method === "PUT") {
    editTitle(req, res);
  } else if (url.pathname === "/projects" && req.method === "DELETE") {
    deleteProject(req, res);
  } else {
    console.log(
      "Request Type: " + req.method + " Invalid Endpoint: " + url.pathname
    );
    respondError(res, 500, "Invalid request");
  }
});
