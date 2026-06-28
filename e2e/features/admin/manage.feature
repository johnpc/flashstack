Feature: Admin deck management (editor)
  As an editor
  I want to create a deck, add cards, and publish it
  So that learners can discover and study it

  # Honest e2e: drives the real editors-group write path (userPool authz) end to
  # end — create a DRAFT deck, add a card, publish, then confirm it surfaces in
  # the public Discover read. Skips when TEST_USERNAME / TEST_PASSWORD are unset.

  Scenario: An editor creates, fills, and publishes a deck
    Given the editor signs in
    When the editor opens deck management
    And the editor creates a deck named "E2E Roman Numerals"
    And the editor opens the deck "E2E Roman Numerals"
    And the editor adds a card with front "I" and back "One"
    Then the deck editor lists 1 card
    When the editor publishes the deck "E2E Roman Numerals"
    Then the deck "E2E Roman Numerals" shows status "PUBLISHED"
