# Feature: Gallery search for static card catalog

## User Story (Narrative)
As a gallery visitor, I want to search cards by meaningful card text, so that I can quickly find relevant cards without leaving the Home page.

## Scenario (Acceptance Criteria)
### Scenario: Empty or whitespace-only query keeps full catalog behavior
Given I am viewing the Home gallery with the static card catalog loaded
When I provide no effective search text
Then the gallery shows the full unfiltered catalog
And pagination behavior remains equivalent to a normal unfiltered visit

### Scenario Outline: Query matches supported card fields using case-insensitive substring behavior
Given I am viewing the Home gallery with the static card catalog loaded
When I search for "<query>"
Then only cards containing "<queryMeaning>" in supported searchable fields are shown
And matching is case-insensitive and ignores leading or trailing query whitespace

Examples:
| query  | queryMeaning                    |
|--------|---------------------------------|
| zard   | a name substring                |
| BASE   | a set name substring            |
| holo   | a rarity substring              |
|   mew  | a trimmed name substring        |

### Scenario: Missing optional fields do not create false-positive matches
Given I am viewing the Home gallery
And some cards have optional searchable fields missing
When I search using text that would only match a missing optional field
Then those cards are not returned based on missing data
And cards can still match through fields that are present

### Scenario: Query change resets pagination to maintain consistent browsing
Given my current gallery result set spans multiple pages
And I am not on the first page
When I change the search query
Then the gallery resets to page one of the new result set
And page count reflects only the filtered result set

### Scenario: No matching cards returns a clear empty result state
Given I am viewing the Home gallery
When I search with a query that matches no cards
Then I see a clear no-results state
And pagination does not imply additional result pages

### Scenario: Search capability is accessible and understandable
Given I am using assistive technology or keyboard navigation
When I access the gallery search capability
Then the search input has an accessible name that communicates purpose
And the search interaction can be understood without relying on visual-only cues

## Assumptions
- Search is client-side over static in-memory card data and does not require backend/API querying.
- Supported searchable fields are card `name`, optional `setName`, and optional `rarity`.
- URL persistence for query state is out of scope for this requirement.
