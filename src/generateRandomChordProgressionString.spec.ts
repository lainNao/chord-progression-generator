import * as parser from "@lainnao/chord-progression-parser-node";
import { generateRandomChordProgressionString } from "./generateRandomChordProgressionString";

describe("generateRandomChordProgressionString", () => {
  test("should generate a random chord progression string", () => {
    const randomChordProgressionString = generateRandomChordProgressionString();

    expect(randomChordProgressionString).toBeDefined();
  });

  test("can parsee with chord-progression-parser", () => {
    for (let i = 0; i < 10; i++) {
      const randomChordProgressionString =
        generateRandomChordProgressionString();
      const result = parser.parseChordProgressionString(
        randomChordProgressionString
      );

      expect(result.success).toBe(true);

      // for debugging
      if (!result.success) {
        console.log(randomChordProgressionString);
        console.log(result);
        break;
      }
    }
  });
});
