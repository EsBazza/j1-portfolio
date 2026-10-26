import type { MDXComponents } from "mdx/types";

// Case-study prose styles; content comes from content/projects/*.mdx.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 mb-5 font-display text-title font-bold text-balance first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 font-display text-xl font-semibold" {...props} />
  ),
  p: (props) => <p className="my-4 text-muted" {...props} />,
  ul: (props) => (
    <ul className="my-4 flex list-none flex-col gap-3 pl-0" {...props} />
  ),
  ol: (props) => (
    <ol
      className="my-4 flex list-decimal flex-col gap-3 pl-5 text-muted marker:font-mono marker:text-faint"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="text-muted [ul>&]:relative [ul>&]:pl-6 [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:font-mono [ul>&]:before:text-faint [ul>&]:before:content-['—']"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  em: (props) => <em className="text-fg" {...props} />,
  a: (props) => (
    <a
      className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-sm border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-fg"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
