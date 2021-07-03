import { ServerResponse } from "http";
import { Project } from "./types";
import Fs from "fs";
import Path from "path";

export function respondError(
  res: ServerResponse,
  statusCode: number,
  message: string
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message }, null, 2));
}

export function respondSuccess(res: ServerResponse) {
  const projects = readData();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ projects }, null, 2));
}

const DATA_PATH = Path.resolve("resources", "data.json");

export function readData(): Project[] {
  const data = Fs.readFileSync(DATA_PATH);

  return JSON.parse(data.toString("utf8"));
}

export function updateData(res: ServerResponse, projects: Project[]) {
  Fs.writeFile(DATA_PATH, Buffer.from(JSON.stringify(projects)), (err) => {
    if (err) {
      respondError(res, 500, "could not persist data!");
    } else {
      respondSuccess(res);
    }
  });
}

export function lastIndex(projects: Project[]): number {
  return projects.length === 0 ? 0 : projects[projects.length - 1].id;
}
