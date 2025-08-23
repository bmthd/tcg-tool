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
export type DrawCalcData = v.InferInput<typeof drawCalcSchema> 

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
