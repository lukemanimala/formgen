# Close Skill

Wrap up a working session by documenting changes, committing everything, and saying goodbye.

## Steps

### 1. Review Session Changes

- Run `git status` and `git diff` to see all modifications
- Identify what was built, fixed, or changed during the session
- Note any significant decisions made

### 2. Update Documentation

If changes warrant documentation updates:

**CHANGELOG.md** - Add new entries for features/fixes:
```markdown
## [Unreleased] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Fixed
- Bug fixes
```

**DECISIONS.md** - Log architectural decisions if any were made:
```markdown
## ADR-XXX: Decision Title

**Date**: YYYY-MM-DD

**Context**: Why was this decision needed?

**Decision**: What was decided?

**Consequences**: What are the tradeoffs?
```

### 3. Commit and Push

- Stage all changes: `git add -A`
- Commit with clear message summarizing the session's work
- Push to remote: `git push`

### 4. Confirm Success

- Verify push succeeded
- Note the commit hash for reference

### 5. Warm Closing

End with a friendly goodbye:

```
bye 👋
```

## Usage

Invoke `/close` at the end of a working session to cleanly wrap up and document the work.
