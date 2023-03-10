type VttGame = {
  user: VttUser;
};
type VttUser = {
  _id: string;
  character: Pf2eCharacter;
};
type Pf2eCharacter = {
  inventory: {
    contents: Array<Pf2eItem>;
  };
};
type Pf2eItemSystem = {
  damage: {
    damageType: string;
  };
};
type Pf2eItem = {
  _source: {
    system: Pf2eItemSystem;
  };
  type: string;
  traits: Set<string>;
  name: string;
  system: Pf2eItemSystem;
};

type VttUI = {
  notifications: {
    warn: (message: string) => void;
    error: (message: string) => void;
  };
};

type DialogOptions = {
  title: string;
  content: string;
  buttons?: {
    [buttonName: string]: {
      label: string;
      callback: (dialogHtml: { find: (v: string) => Array<{ value: number }> }) => void;
    };
  };
};

type Speaker = {};

declare const game: VttGame;
declare const ui: VttUI;
declare class Dialog {
  constructor(options: DialogOptions);
  render(bool: boolean): void;
  static prompt(options: DialogOptions): void;
}
declare class ChatMessage {
  static getSpeaker(options: { token: typeof actor }): Speaker;
  static create(options: { user: string; speaker: Speaker; content: string }): void;
}
declare const actor: {};
