Feature: Discover shelves
  As a visitor opening Flashstack
  I want to see flashcard decks organized into category shelves
  So that I can browse what's available to learn

  # Honest e2e (stoop rule): assert on REAL seeded data (a named category from
  # the seed), not just that the page rendered. The seed creates these
  # categories; this proves the guest read path returns them.

  Scenario: A visitor lands on Discover and sees the seeded category shelves
    Given a visitor opens the app at the root
    Then they are taken to the Discover tab
    And a category shelf "Languages" is visible
    And a category shelf "Myths & Legends" is visible

  Scenario: Opening a shelf shows its published decks
    Given a visitor opens the app at the root
    When they open the "Languages" shelf
    Then a deck titled "Top Spanish Phrases" is visible
    And that deck shows its card count
