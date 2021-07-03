export interface Project {
  readonly id: number;
  title?: string;
  tasks: string[];
}

export interface ProjectRequest {
  readonly title?: string;
  readonly task?: string;
}
