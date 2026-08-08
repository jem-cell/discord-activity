# Issue tracker

**GitHub Issues** on `jem-cell/discord-activity` (https://github.com/jem-cell/discord-activity/issues).

## Wayfinding operations

- **Create an issue**: `gh issue create --repo jem-cell/discord-activity ...`
- **Labels**: `wayfinder:map`, `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task` (created).
- **Child-of / blocking**: GitHub Issues has no native dependency relationship, so blocking uses a **body convention** — a `**Blocked by:** #<id> (<name>)` line in the ticket body. A ticket is unblocked when every issue it names is closed.
- **Open vs closed**: `gh issue close`. An open, unassigned ticket is unclaimed.
- **Assignment**: `gh issue edit <n> --add-assignee jem-cell`.
- **Frontier query**: open, unblocked, unassigned children of the map (issues with a `wayfinder:*` label other than `wayfinder:map`).
- **Resolution**: post a resolution comment, close the issue, append a context pointer to the map's Decisions-so-far.
