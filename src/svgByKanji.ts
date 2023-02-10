import { SvgByKanjiDictionary } from "./types";

export class SvgByKanji {
  private static svgByKanji: SvgByKanjiDictionary = {};

  static async load(url: string) {
    return new Promise<void>(async (res) => {
      this.svgByKanji = (await (
        await fetch(url)
      ).json()) as SvgByKanjiDictionary;
      return res();
    });
  }

  static get(kanji: string) {
    return this.svgByKanji[kanji];
  }
}
