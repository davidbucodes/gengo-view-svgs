import { SvgByLetterDictionary } from "./types";

export class SvgByLetter {
  private static svgByLetter: SvgByLetterDictionary = {};

  static async load(url: string) {
    return new Promise<void>(async (res) => {
      this.svgByLetter = (await (
        await fetch(url)
      ).json()) as SvgByLetterDictionary;
      return res();
    });
  }

  static get(kanji: string) {
    return this.svgByLetter[kanji];
  }
}
