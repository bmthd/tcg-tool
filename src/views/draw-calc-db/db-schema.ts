import { gameTemplateKeys } from "@/views/draw-calc/const";
import * as v from "valibot";

// 対象カードの型定義
export interface TargetCard {
	id: string;
	name: string;
	K_in_deck: number;
	k_desired: number;
}

// 計算データの型定義
export interface DrawCalcData {
	/** unique id for this calculation */
	id: string;
	/** size of the deck */
	deckSize: number;
	/** size of the initial hand */
	initialHandSize: number;
	/** game title from supported templates */
	gameTemplate: (typeof gameTemplateKeys)[number];
	/** whether the player is the first player */
	isFirstPlayer: boolean;
	/** cards to calculate the draw probabilities for */
	targetCards: TargetCard[];
	/** calculated probability results */
	result?: {
		probExactly: number;
		probAtLeast: number;
	};
	/** when this calculation was created */
	createdAt: string; // ISO string for localStorage compatibility
	/** when this calculation was last updated */
	updatedAt: string; // ISO string for localStorage compatibility
}

// バリデーション用のスキーマ（オプション）
export const targetCardSchema = v.object({
	id: v.string(),
	name: v.string(),
	K_in_deck: v.number(),
	k_desired: v.number(),
});

export const drawCalcSchema = v.pipe(
	v.object({
		id: v.string(),
		deckSize: v.number(),
		initialHandSize: v.number(),
		gameTemplate: v.picklist(gameTemplateKeys),
		isFirstPlayer: v.boolean(),
		targetCards: v.pipe(
			v.array(targetCardSchema),
			v.minLength(1, "最低1種類のカードを指定してください。"),
		),
		result: v.optional(
			v.object({
				probExactly: v.number(),
				probAtLeast: v.number(),
			}),
		),
		createdAt: v.string(),
		updatedAt: v.string(),
	}),
	v.forward(
		v.partialCheck(
			[["deckSize"], ["targetCards"]],
			({ deckSize, targetCards }) => !(targetCards.length > deckSize),
			"デッキの枚数以上にすることはできません。",
		),
		["targetCards"],
	),
);
