import {
  IIndex,
  Index,
  KanjiDocument,
} from "@davidbucodes/gengo-view-database";
import * as fs from "fs";
import { optimize } from "svgo";
import kanjiIndexRaw from "./node_modules/@davidbucodes/gengo-view-indices/kanji.index.json";

const hiragana = `あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉっゃゅょがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ`;
const katakana = `アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポー`;

export function bundle() {
  const kanjiIndex = Index.from(kanjiIndexRaw as IIndex<KanjiDocument>);

  const allKanjis = kanjiIndex.documents.map((doc) => doc.kanji);
  const kanjisAndLetters = [...allKanjis, ...hiragana, ...katakana];

  const svgByLetter: Record<string, string> = getSvgByLetter(kanjisAndLetters);

  const kanjiComponentsTreeByKanji: Record<string, string> =
    getKanjiComponentsTreeByKanji(kanjisAndLetters);

  const outputFolderPath = "./output";
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }
  const outputs: [string, Record<string, string>][] = [
    ["svgByLetter.json", svgByLetter],
    ["kanjiComponentsTreeByKanji.json", kanjiComponentsTreeByKanji],
  ];

  return outputs.map(([outputFileName, outputJson]) => {
    const outputFilePath = `${outputFolderPath}/${outputFileName}`;
    if (fs.existsSync(outputFilePath)) {
      fs.rmSync(outputFilePath);
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(outputJson), {
      encoding: "utf8",
    });

    return { outputFilePath, outputFileName };
  });
}

function getSvgByLetter(kanjisAndLetters: string[]) {
  const svgByLetter: Record<string, string> = {};

  // Credit: https://github.com/pritulaziah/kanji-react-icons/blob/53c355afecebb45d0d685198cb86c77cea8e0c09/scripts/utils.ts#L4
  const replaceKVGAttrs = (str: string) => {
    const kvgAttrs = [
      "type",
      "element",
      "variant",
      "partial",
      "original",
      "number",
      "tradForm",
      "radicalForm",
      "position",
      "radical",
      "part",
      "phon",
    ];

    for (const kvgAttr of kvgAttrs) {
      str = str.replace(new RegExp(`kvg:${kvgAttr}="[^"]*"`, "g"), "");
    }

    return str;
  };

  for (const kanji of kanjisAndLetters) {
    const path = `./assets/kanjiSvgs/${kanji
      .charCodeAt(0)
      .toString(16)
      .padStart(5, "0")}.svg`;
    if (fs.existsSync(path)) {
      const svg = fs.readFileSync(path, { encoding: "utf8" });
      const { data: optimizedSvg } = optimize(replaceKVGAttrs(svg));
      svgByLetter[kanji] = optimizedSvg;
    }
  }
  return svgByLetter;
}

function getKanjiComponentsTreeByKanji(kanjisAndLetters: string[]) {
  const svgByLetter: Record<string, string> = {};

  // Credit: https://github.com/pritulaziah/kanji-react-icons/blob/53c355afecebb45d0d685198cb86c77cea8e0c09/scripts/utils.ts#L4
  const replaceKVGAttrs = (str: string) => {
    const kvgAttrs = [
      "type",
      "element",
      "variant",
      "partial",
      "original",
      "number",
      "tradForm",
      "radicalForm",
      "position",
      "radical",
      "part",
      "phon",
    ];

    for (const kvgAttr of kvgAttrs) {
      str = str.replace(new RegExp(`kvg:${kvgAttr}="[^"]*"`, "g"), "");
    }

    return str;
  };

  for (const kanji of kanjisAndLetters) {
    const path = `./assets/kanjiSvgs/${kanji
      .charCodeAt(0)
      .toString(16)
      .padStart(5, "0")}.svg`;
    if (fs.existsSync(path)) {
      const svg = fs.readFileSync(path, { encoding: "utf8" });
      const { data: optimizedSvg } = optimize(replaceKVGAttrs(svg));
      svgByLetter[kanji] = optimizedSvg;
    }
  }
  return svgByLetter;
}
