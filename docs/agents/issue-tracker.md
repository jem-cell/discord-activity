# Issue tracker

**Local markdown.** Issues live as files under `.scratch/<feature>/` in this repo.

## Wayfinding operations

- **Create an issue**: write a markdown file under `.scratch/<feature>/`. The filename is the issue's identity (slug). The file's first line is its title (a `# ` heading); the body follows.
- **Labels**: a `wayfinder:map` label is expressed as a `labels:` line in the file frontmatter; `wayfinder:<type>` similarly.
- **Child-of / blocking**: expressed as `parent:` and `blocks:`/`blocked-by:` lines in frontmatter, referencing other issue filenames.
- **Open vs closed**: a closed issue is moved to `.scratch/<feature>/closed/` (or its filename prefixed `closed-`). An open, unassigned ticket is unclaimed.
- **Assignment**: an `assignee:` line in frontmatter.
- **Frontier query**: open, unblocked, unassigned children of the map.
