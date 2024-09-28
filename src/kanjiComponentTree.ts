import { SvgByLetterDictionary } from "./types";

export class KanjiComponentTreeNode {
  constructor(
    private _component: string,
    private _childComponents: KanjiComponentTreeNode[] = null
  ) {}

  get component() {
    return this._component;
  }

  get childComponents() {
    return this._childComponents;
  }
}

export class KanjiComponentTree extends KanjiComponentTreeNode {}
