Feature: Study a deck (authenticated)
  As a signed-in learner
  I want to play a deck and self-grade each card
  So that spaced repetition focuses my future study on what I find hard

  # Honest e2e + ADR-0004 guard: the study queue reads the deck's cards (public)
  # and the user's own UserCardReview rows (owner/userPool). This journey signs
  # in, opens a seeded deck, reveals an answer and grades it — asserting on real
  # rendered card data and a real progress advance, not just navigation.
  # Skips automatically when TEST_USERNAME / TEST_PASSWORD are unset.

  Scenario: A signed-in user studies a deck and grades a card
    Given the study test user signs in
    When the user starts studying the "Top Spanish Phrases" deck
    Then the study session shows progress "1 /"
    When the user reveals the answer
    Then the card answer is shown
    When the user grades the card "Good"
    Then the study session advances past the first card
