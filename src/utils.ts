import { ServerResponse } from "http";
import { Project } from "./types";
import Fs from "fs/promises";
import Path from "path";

export function respondError(
  res: ServerResponse,
  statusCode: number,
  message: string
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message }, null, 2));
}

export function respondSuccess(res: ServerResponse, projects: Project[]) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ projects }, null, 2));
}

const DATA_PATH = Path.resolve(__dirname, "..", "resources", "data.json");

export async function readData(
  res: ServerResponse
): Promise<Project[] | undefined> {
  try {
    const projects = await Fs.readFile(DATA_PATH);
    return JSON.parse(projects.toString("utf8"));
  } catch {
    respondError(res, 500, "Can not read the data!");
  }
}

export async function processData(
  res: ServerResponse,
  cb: (projects: Project[]) => Project[]
): Promise<Project[]> {
  const oldData = await readData(res);
  const newData = cb(oldData ?? []);
  await writeData(res, newData);
  return newData;
}

export async function writeData(res: ServerResponse, projects: Project[]) {
  try {
    await Fs.writeFile(DATA_PATH, Buffer.from(JSON.stringify(projects)));
  } catch (err) {
    respondError(res, 500, "could not persist data!");
  }
}

export function lastIndex(projects: Project[]): number {
  return projects.length === 0 ? 0 : projects[projects.length - 1].id;
}
