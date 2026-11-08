Feature: My Decks (authenticated)
  As a signed-in learner
  I want to save decks to my library
  So that I can come back and study them

  # Honest e2e + ADR-0004 guard: owner-authz rows only return data on the
  # userPool auth path. This journey signs in, adds a deck, and reads it back
  # from "My Decks" — asserting on the real saved row, not just navigation.
  # Skips automatically when TEST_USERNAME / TEST_PASSWORD are unset.
  # Uses "Greek Gods", NOT "Top Spanish Phrases": the study area (a parallel CI
  # job, same test user) answers every Spanish card, which schedules them into
  # the future and empties Due Today mid-run. No other area touches this deck.

  Scenario: A signed-in user adds a deck and sees it in My Decks
    Given the test user signs in
    When the test user opens the "Greek Gods" deck in "mythology"
    And the test user adds the deck to My Decks
    Then the deck button shows it is in My Decks
    When the test user opens the My Decks tab
    Then "Greek Gods" is listed in My Decks
    And the Due Today panel reflects the saved deck's due cards
