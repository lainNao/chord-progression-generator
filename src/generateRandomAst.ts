import { Range } from "./util/Range";
import { arrayBy } from "./util/arrayBy";
import { getRandomElement } from "./util/getRandomElement";
import { getRandomEnum } from "./util/getRandomEnum";
import { randomBetween } from "./util/randomBetween";
import {
  Accidental,
  ChordType,
  Extension,
  ChordExpression,
  Base,
  ChordInfoMeta,
  Key,
  ChordBlock,
  SectionMeta,
  Ast,
  Section,
} from "@lainnao/chord-progression-parser-node/generatedTypes";

type GenerateRandomChordInfoArgs = generateRandomChordMetaInfoArgs & {
  chordInfoCountRange: Range;
  extensionCountRange: Range;
};

type generateRandomChordMetaInfoArgs = {
  chordMetaInfoCountRange: Range;
};

type GenerateRandomSectionArgs = GenerateRandomChordInfoArgs & {
  chordBlockCountRange: Range;
  chordMetaInfoCountRange: Range;
};

type GenerateRandomAstArgs = GenerateRandomSectionArgs & {
  sectionCountRange: Range;
};

function generateRandomExtension(): Extension {
  return getRandomEnum(Extension);
}

function generateRandomDenominator(): string | undefined {
  if (randomBetween({ min: 0, max: 10 }) !== 0) {
    return undefined;
  }
  return (
    getRandomElement(["C", "D", "E", "F", "G", "A", "B"]) +
    getRandomElement(["", "", "", "", "m"]) +
    getRandomElement(["", "", "", "", `(${generateRandomExtension()})`])
  );
}

function generateRandomChordExpression(
  args: GenerateRandomChordInfoArgs,
  option?: {
    noSame?: boolean;
  }
): ChordExpression {
  switch (randomBetween({ min: 1, max: 20 })) {
    case 1:
      return {
        type: "noChord",
      };
    case 2:
      return {
        type: "unIdentified",
      };
    case 3: {
      if (!option?.noSame) {
        return {
          type: "same",
        };
      }
    }
    default: {
      const extensions = arrayBy(randomBetween(args.extensionCountRange)).map(
        () => generateRandomExtension()
      );

      const chordType: ChordType = getRandomElement([
        ...new Array(10).map(() => ChordType.Major),
        ...new Array(10).map(() => ChordType.Minor),
        ChordType.Augmented,
        ChordType.Diminished,
      ]);
      const chordTypeString = chordType === ChordType.Major ? "" : chordType;

      const accidental = getRandomElement([
        ...new Array(10).fill(undefined).map(() => undefined),
        Accidental.Sharp,
        Accidental.Flat,
      ]);

      const base = getRandomEnum(Base);

      const plain =
        base +
        (accidental ?? "") +
        (chordTypeString ?? "") +
        (extensions.length > 0 ? `(${extensions.join(",")})` : "");

      return {
        type: "chord",
        value: {
          plain,
          detailed: {
            base,
            accidental,
            chordType,
            extensions,
          },
        },
      };
    }
  }
}

function generateRandomChordMetaInfos(
  args: generateRandomChordMetaInfoArgs
): ChordInfoMeta[] {
  if (randomBetween({ min: 0, max: 10 }) !== 0) {
    return [];
  }

  return arrayBy(randomBetween(args.chordMetaInfoCountRange)).map(() => ({
    type: "key",
    value: getRandomEnum(Key),
  }));
}

function generateRandomChordBlock(
  args: GenerateRandomSectionArgs,
  option?: {
    noSame?: boolean;
  }
): ChordBlock {
  return arrayBy(randomBetween(args.chordInfoCountRange)).map(() => ({
    metaInfos: generateRandomChordMetaInfos(args),
    chordExpression: generateRandomChordExpression(args, {
      noSame: option?.noSame,
    }),
    denominator: generateRandomDenominator(),
  }));
}

function generateRandomSectionInfoMeta(): SectionMeta {
  // get 1 or 0 by random
  const oneOrZero = randomBetween({ min: 0, max: 5 });
  if (oneOrZero > 0) {
    return {
      type: "section",
      value: getRandomElement(["A", "B", "C"]),
    };
  } else {
    return {
      type: "repeat",
      value: randomBetween({ min: 1, max: 2 }),
    };
  }
}

function generateRandomSection(args: GenerateRandomSectionArgs): Section {
  return {
    metaInfos: arrayBy(randomBetween(args.chordMetaInfoCountRange)).map(() =>
      generateRandomSectionInfoMeta()
    ),
    chordBlocks: arrayBy(randomBetween(args.chordBlockCountRange)).map((_, i) =>
      generateRandomChordBlock(args, i === 0 ? { noSame: true } : undefined)
    ),
  };
}

export function generateRandomAst(args: GenerateRandomAstArgs): Ast {
  return arrayBy(randomBetween(args.sectionCountRange)).map(() =>
    generateRandomSection(args)
  );
}
