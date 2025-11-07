import {
  IIndex,
  Index,
  KanjiDocument,
} from "@davidbucodes/gengo-view-database";
import * as fs from "fs";
import { optimize } from "svgo";
import kanjiIndexRaw from "./node_modules/@davidbucodes/gengo-view-indices/kanji.index.json";
import { JSDOM } from "jsdom";
import {
  KanjiComponentTreeDict,
  KanjiComponentTreeNode,
  SvgByLetterDictionary,
} from "./src";

const hiragana = `あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉっゃゅょがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゝ`;
const katakana = `アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポーヽヾ`;

export function bundle() {
  const kanjiIndex = Index.from(kanjiIndexRaw as IIndex<KanjiDocument>);

  const allKanjis = kanjiIndex.documents.map((doc) => doc.kanji);
  const kanjisAndLetters = [...allKanjis, ...hiragana, ...katakana];

  const { svgByLetter, kanjiComponentsTreeByKanji } =
    getSvgByLetter(kanjisAndLetters);

  const outputFolderPath = "./output";
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }
  const outputs: [string, unknown][] = [
    // ["svgByLetter.json", svgByLetter],
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

function getSvgByLetter(kanjisAndLetters: string[]) {
  const svgByLetter: SvgByLetterDictionary = {};
  const kanjiComponentsTreeByKanji: KanjiComponentTreeDict = {};

  for (const kanji of kanjisAndLetters) {
    const path = `./assets/kanjiSvgs/${kanji
      .charCodeAt(0)
      .toString(16)
      .padStart(5, "0")}.svg`;
    if (fs.existsSync(path)) {
      const svg = fs.readFileSync(path, { encoding: "utf8" });
      const parsed = new JSDOM(svg).window.document;
      const parentElement = parsed.querySelector("[kvg:element]");
      kanjiComponentsTreeByKanji[kanji] = getTree(parentElement);

      // const { data: optimizedSvg } = optimize(replaceKVGAttrs(svg));
      // svgByLetter[kanji] = optimizedSvg;
    }
  }
  return { svgByLetter, kanjiComponentsTreeByKanji };
}

function getTree(element: Element): KanjiComponentTreeNode {
  const component = element.getAttribute("kvg:element");
  if (element.children.length === 0) {
    return {
      component,
    };
  }

  const relevantChildElements = [...element.children].filter((el) =>
    el.hasAttribute("kvg:element")
  );
  if (relevantChildElements.length === 0) {
    return {
      component,
    };
  }

  return {
    component,
    childNodes: relevantChildElements.map((el) => getTree(el)),
  };
}

bundle();
