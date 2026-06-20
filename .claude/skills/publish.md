# Publish Skill

Document and log decisions for the current project.

## Steps

### 1. Analyze the Project

- Read key source files to understand current state
- Identify the tech stack, features, and architecture
- Note any recent changes or additions

### 2. Update README.md

Create or update with:
- Project name and tagline
- Current feature list
- Tech stack
- Quick start / usage instructions
- Any relevant links or deployment info

### 3. Update CHANGELOG.md

Append new entries using Keep a Changelog format:
```markdown
## [Unreleased] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Fixed
- Bug fixes

### Removed
- Removed features
```

### 4. Update DECISIONS.md

Log architectural and product decisions using ADR format:
```markdown
## ADR-XXX: Decision Title

**Date**: YYYY-MM-DD

**Context**: Why was this decision needed?

**Decision**: What was decided?

**Consequences**: What are the tradeoffs?
```

### 5. Commit and Push

After updating docs:
- Stage all changes with `git add -A`
- Commit with descriptive message summarizing the changes
- Push to remote

### 6. Summarize

After pushing:
- List what was documented
- Confirm commit and push succeeded
- Note any technical debt or future considerations

## Usage

Invoke this skill after completing a feature, making a significant decision, or before sharing/deploying the project.
