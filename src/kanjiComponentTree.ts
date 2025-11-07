import { KanjiComponentTreeDict, SvgByLetterDictionary } from "./types";

export class KanjiComponentTree {
  private static kanjiComponentTreeDict: KanjiComponentTreeDict = {};

  static async load(url: string) {
    return new Promise<void>(async (res) => {
      this.kanjiComponentTreeDict = (await (
        await fetch(url)
      ).json()) as KanjiComponentTreeDict;
      return res();
    });
  }

  static get(kanji: string) {
    return this.kanjiComponentTreeDict[kanji];
  }
}
