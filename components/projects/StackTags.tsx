import type { Project } from "@/content/schema";
import { Tag } from "@/components/ui/Tag";

export function StackTags({ project }: { project: Project }) {
  if (project.stack.length === 0) {
    return <p className="caption text-faint">Stack to be confirmed</p>;
  }
  return (
    <ul aria-label="Stack" className="flex flex-wrap gap-2">
      {project.stack.map((item) => (
        <li key={item}>
          <Tag translate="no">{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
