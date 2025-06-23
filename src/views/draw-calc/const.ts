import {
	Anchor,
	BookOpen,
	Circle,
	type LucideProps,
	Pocket,
	Settings2,
	Shield,
	Sun,
} from "lucide-react";
import type { UnionToTuple } from "type-fest";

// --- Constants ---
export const MAX_CARD_GROUPS: number = 3;

interface GameTemplate {
	name: string;
	deckSize: number;
	baseInitialHandSize: number;
	firstPlayerTurnDraw: number;
	secondPlayerTurnDraw: number;
	maxCopiesInDeck: number;
	description: string;
	Icon: React.FC<LucideProps>;
}

export const gameTemplates = {
	custom: {
		name: "カスタム",
		deckSize: 40,
		baseInitialHandSize: 5,
		firstPlayerTurnDraw: 0,
		secondPlayerTurnDraw: 1,
		maxCopiesInDeck: 4,
		description:
			"全ての値を自由に設定してください。同名カードの最大枚数も考慮してください。",
		Icon: Settings2,
	},
	yugioh: {
		name: "遊戯王OCG",
		deckSize: 40,
		baseInitialHandSize: 5,
		firstPlayerTurnDraw: 0,
		secondPlayerTurnDraw: 1,
		maxCopiesInDeck: 3,
		description:
			"デッキ: 40-60枚。基本手札5枚。先行ターン開始時ドローなし、後攻はあり。同名カードは3枚まで。",
		Icon: BookOpen,
	},
	pokemon: {
		name: "ポケモンカードゲーム",
		deckSize: 60,
		baseInitialHandSize: 7,
		firstPlayerTurnDraw: 0,
		secondPlayerTurnDraw: 0,
		maxCopiesInDeck: 4,
		description:
			"デッキ: 60枚。初期手札7枚。先行の最初の番はサポート使用不可、ドローもなし。同名カードは4枚まで（基本エネルギー除く）。",
		Icon: Circle,
	},
	pokemonPocket: {
		name: "ポケモンカードゲーム Pocket",
		deckSize: 20,
		baseInitialHandSize: 5,
		firstPlayerTurnDraw: 1,
		secondPlayerTurnDraw: 1,
		maxCopiesInDeck: 4,
		description:
			"デッキ: 20枚。基本手札5枚。先行・後攻ともに自身の最初のターン開始時に1枚ドロー。同名カードは4枚まで（仮）。",
		Icon: Pocket,
	},
	mtg: {
		name: "マジック：ザ・ギャザリング (構築)",
		deckSize: 60,
		baseInitialHandSize: 7,
		firstPlayerTurnDraw: 0,
		secondPlayerTurnDraw: 1,
		maxCopiesInDeck: 4,
		description:
			"デッキ: 最小60枚。初期手札7枚。先行は最初のドローなし、後攻はあり。同名カードは4枚まで（基本土地除く）。",
		Icon: Sun,
	},
	onepiece: {
		name: "ワンピースカードゲーム",
		deckSize: 50,
		baseInitialHandSize: 5,
		firstPlayerTurnDraw: 0,
		secondPlayerTurnDraw: 1,
		maxCopiesInDeck: 4,
		description:
			"デッキ: 50枚。初期手札5枚。先行は最初のターンのドローなし、後攻はあり。同名カードは4枚まで。",
		Icon: Anchor,
	},
	duelmasters: {
		name: "デュエル・マスターズ",
		deckSize: 40,
		baseInitialHandSize: 5,
		firstPlayerTurnDraw: 0,
		secondPlayerTurnDraw: 1,
		maxCopiesInDeck: 4,
		description:
			"デッキ: 40枚。初期手札5枚。先行は最初のターンのドローなし、後攻はあり。同名カードは4枚まで。",
		Icon: Shield,
	},
} as const satisfies Record<string, GameTemplate>;

export type GameTemplateKey = keyof typeof gameTemplates;

export const gameTemplateKeys = Object.keys(
	gameTemplates,
) as UnionToTuple<GameTemplateKey>;
