<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git Commit Recommendations
When asked to suggest commit messages or break down pending changes:
- Group changes into logical, atomic commits (e.g., DB, Auth logic, UI components, Layout, Dev scripts).
- For each commit, provide a Conventional Commit title (`feat(...)`, `chore(...)`, etc.), list of affected files, and exact `git add` / `git commit` commands.
- Provide a single-commit alternative at the end.
