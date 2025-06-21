import * as v from "valibot"
import { gameTemplateKeys } from "./const";

export const schema = v.pipe(
  v.object({
    deckSize: v.number(),
    initialHandSize: v.number(),
    gameTemplate: v.picklist(gameTemplateKeys),
    isFirstPlayer: v.boolean(),
    targetCards: v.pipe(
      v.array(
        v.object({
          id: v.number(),
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