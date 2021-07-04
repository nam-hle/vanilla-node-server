import { RequestListener } from "http";
import { ProjectRequest } from "./types";
import {
  lastIndex,
  processData,
  readData,
  respondError,
  respondSuccess,
} from "./utils";
import { URL } from "url";
import { baseURL } from "./server";

export const readProject: RequestListener = (_, res) => {
  readData(res).then((projects = []) => respondSuccess(res, projects));
};

export const addTitle: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", async () => {
    const { title } = JSON.parse(body) as ProjectRequest;

    if (!title) {
      return respondError(res, 400, "no title in body request");
    }

    const newProjects = await processData(res, (projects) => [
      ...projects,
      { id: lastIndex(projects) + 1, title, tasks: [] },
    ]);

    respondSuccess(res, newProjects);
  });
};

export const addTasks: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", async () => {
    const url = new URL(req.url ?? "", baseURL);
    const id = url.searchParams.get("id");

    if (!id) {
      return respondError(res, 500, "no query parameter!");
    }

    const { task } = JSON.parse(body) as ProjectRequest;

    if (!task) {
      return respondError(res, 400, "no task found in body request!");
    }

    const newProjects = await processData(res, (projects) =>
      projects.map((project) => {
        if (String(project.id) !== id) {
          return project;
        }

        return { ...project, tasks: [...project.tasks, task] };
      })
    );

    respondSuccess(res, newProjects);
  });
};

export const editTitle: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", async () => {
    const url = new URL(req.url ?? "", baseURL);
    const id = url.searchParams.get("id");

    if (!id) {
      return respondError(res, 500, "no query parameter!");
    }

    const { title } = JSON.parse(body) as ProjectRequest;

    if (!title) {
      return respondError(res, 400, "no title found in body request!");
    }

    const newProjects = await processData(res, (projects = []) => {
      return projects.map((project) => {
        if (String(project.id) === id) {
          return { ...project, title };
        } else {
          return project;
        }
      });
    });

    respondSuccess(res, newProjects);
  });
};

export const deleteProject: RequestListener = (req, res) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk;
  });

  req.on("end", async () => {
    const url = new URL(req.url ?? "", baseURL);
    const id = url.searchParams.get("id");

    if (!id) {
      return respondError(res, 500, "no query parameter!");
    }

    const newProjects = await processData(res, (projects) =>
      projects?.filter((project) => String(project.id) !== id)
    );

    respondSuccess(res, newProjects);
  });
};
