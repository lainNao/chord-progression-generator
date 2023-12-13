import { Range } from "./util/Range";
import { Ast } from "@lainnao/chord-progression-parser-node/generatedTypes";
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
export declare function generateRandomAst(args: GenerateRandomAstArgs): Ast;
export {};
