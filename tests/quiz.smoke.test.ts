import { describe, expect, it } from 'vitest';
import { encounters } from '../src/data/encounters';

describe('quiz encounters smoke test', () => {
  const quizEncounters = encounters.filter((e) => e.isQuiz);

  it('has quiz encounters for all four problem-statement locations', () => {
    const hotspotIds = quizEncounters.map((e) => e.hotspotId);
    expect(hotspotIds).toContain('sari-sari');
    expect(hotspotIds).toContain('barangay-hall');
    expect(hotspotIds).toContain('basketball-court');
    expect(hotspotIds).toContain('market-stall');
  });

  it('each quiz encounter has exactly one correct choice', () => {
    quizEncounters.forEach((encounter) => {
      const correctChoices = encounter.choices.filter((c) => c.isCorrect === true);
      expect(correctChoices.length).toBe(1);
    });
  });

  it('each quiz encounter has a positive points value', () => {
    quizEncounters.forEach((encounter) => {
      expect(encounter.points).toBeGreaterThan(0);
    });
  });

  it('each quiz encounter has at least two choices', () => {
    quizEncounters.forEach((encounter) => {
      expect(encounter.choices.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('all quiz choices have bilingual text and result', () => {
    quizEncounters.forEach((encounter) => {
      encounter.choices.forEach((choice) => {
        expect(choice.text.en).toBeTruthy();
        expect(choice.text.tl).toBeTruthy();
        expect(choice.result.en).toBeTruthy();
        expect(choice.result.tl).toBeTruthy();
      });
    });
  });
});
