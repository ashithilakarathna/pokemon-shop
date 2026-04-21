# Requirements Analysis Documents

This folder stores requirement analysis artifacts written in behavior-driven development (BDD) style.

## Filename convention

Use:

`feature-<short-feature-slug>.md`

Example:

`feature-gallery-search.md`

## Required structure

Every requirements analysis document must include:

1. **Feature**: High-level software capability.
2. **User Story (Narrative)**:
   - `As a [role], I want to [action], so that [value]`.
3. **Scenario (Acceptance Criteria)**:
   - `Given` initial context or state
   - `When` action or trigger
   - `Then` expected observable outcome

## BDD best practices

- Focus on behavior, not implementation.
- Avoid UI mechanics (for example, "click button" or "open dropdown").
- Keep scenarios independent so each can be tested in isolation.
- Keep language concise and natural; scenarios should stay under 10 steps.
- Add both positive and negative scenarios when relevant.
- Use `Scenario Outline` with `Examples` for data-driven variations.

## Template

```md
# Feature: <high-level capability>

## User Story (Narrative)
As a <role>, I want to <action>, so that <value>.

## Scenario (Acceptance Criteria)
### Scenario: <positive behavior>
Given <initial context>
And <optional additional context>
When <trigger/action>
Then <expected outcome>
And <optional additional expected outcome>

### Scenario: <negative or edge behavior>
Given <initial context>
When <trigger/action or invalid condition>
Then <expected rejection, error handling, or safe behavior>

### Scenario Outline: <behavior with variable data>
Given <context with <placeholder>>
When <action with <placeholder>>
Then <outcome with <placeholder>>

Examples:
| input | condition | expected |
|-------|-----------|----------|
| ...   | ...       | ...      |
```
