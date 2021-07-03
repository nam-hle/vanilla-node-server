import { RequestListener } from "http";
import { ProjectRequest } from "./types";
import {
  lastIndex,
  readData,
  respondError,
  respondSuccess,
  updateData,
} from "./utils";
import { URL } from "url";
import { baseURL } from "./server";

export const readProject: RequestListener = (_, res) => {
  respondSuccess(res);
};

export const addTitle: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", () => {
    const { title } = JSON.parse(body) as ProjectRequest;

    if (title) {
      const projects = readData();
      projects.push({ id: lastIndex(projects) + 1, title, tasks: [] });

      updateData(res, projects);
    } else {
      respondError(res, 400, "no title in body request");
    }
  });
};

export const addTasks: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", () => {
    const url = new URL(req.url ?? "", baseURL);
    const id = url.searchParams.get("id");

    if (id) {
      const { task } = JSON.parse(body) as ProjectRequest;

      if (!task) {
        respondError(res, 400, "no task found in body request!");
      } else {
        const projects = readData();
        projects.forEach((project, projectIndex) => {
          if (String(project.id) === id) {
            project.tasks.push(task);
          }
        });

        updateData(res, projects);
      }
    } else {
      respondError(res, 500, "no query parameter!");
    }
  });
};

export const editTitle: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", () => {
    const url = new URL(req.url ?? "", baseURL);
    const id = url.searchParams.get("id");

    if (id) {
      const { title } = JSON.parse(body) as ProjectRequest;

      if (!title) {
        respondError(res, 400, "no title found in body request!");
      } else {
        const projects = readData();

        projects.forEach((project, projectIndex) => {
          if (String(project.id) === id) {
            project.title = title;
          }
        });

        updateData(res, projects);
      }
    } else {
      respondError(res, 500, "no query parameter!");
    }
  });
};

export const deleteProject: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", () => {
    const url = new URL(req.url ?? "", baseURL);
    const id = url.searchParams.get("id");

    if (id) {
      const projects = readData().filter(
        (project) => String(project.id) !== id
      );
      updateData(res, projects);
    } else {
      respondError(res, 500, "no query parameter!");
    }
  });
};
