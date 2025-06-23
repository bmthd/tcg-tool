import * as v from "valibot";
import { gameTemplateKeys } from "./const";

v.setSpecificMessage(
	v.minLength,
	({ input }) => `${input.length}以上で入力してください。`,
);

export const schema = v.pipe(
	v.object({
		/** size of the deck */
		deckSize: v.number(),
		/** size of the initial hand */
		initialHandSize: v.number(),
		/** game title from supported templates */
		gameTemplate: v.picklist(gameTemplateKeys),
		/** whether the player is the first player */
		isFirstPlayer: v.boolean(),
		/** cards to calculate the draw probabilities for */
		targetCards: v.pipe(
			v.array(
				v.object({
					id: v.string(),
					name: v.string(),
					K_in_deck: v.number(),
					k_desired: v.number(),
				}),
			),
			v.minLength(1, "最低1種類のカードを指定してください。"),
		),
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

export type Output = v.InferOutput<typeof schema>;
export type Input = v.InferInput<typeof schema>;
