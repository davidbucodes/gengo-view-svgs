export type SvgByLetterDictionary = Record<string, string>;

export type KanjiComponentTreeDict = Record<string, KanjiComponentTreeNode>;

export type KanjiComponentTreeNode = {
  component: string;
  childNodes?: KanjiComponentTreeNode[];
};
