import { calc } from "./logic";

describe("DrawCalc Logic", () => {
	it.each([
		{
			description: "【単一】デッキ20枚、手札1枚のとき、特定の1枚を引く",
			input: {
				deckSize: 20,
				initialHandSize: 1,
				targetCards: [{ K_in_deck: 1, k_desired: 1 }],
			},
			expected: {
				probExactly: 1 / 20,
				probAtLeast: 1 / 20,
			},
		},
		{
			description:
				"【単一】遊戯王風：デッキ40枚、手札5枚のとき、4枚積みのカードを1枚引く",
			input: {
				deckSize: 40,
				initialHandSize: 5,
				targetCards: [{ K_in_deck: 4, k_desired: 1 }],
			},
			expected: {
				probExactly: 0.358, // 約 35.8%
				probAtLeast: 0.427, // 約 42.7%
			},
		},
		{
			description:
				"【単一】MTG風：デッキ60枚、手札7枚のとき、3枚積みのカードをちょうど2枚引く",
			input: {
				deckSize: 60,
				initialHandSize: 7,
				targetCards: [{ K_in_deck: 3, k_desired: 2 }],
			},
			expected: {
				probExactly: 0.0287, // 約 2.87%
				// P(X>=2) = P(X=2) + P(X=3)
				probAtLeast: 0.035, // 約 3.5%
			},
		},

		// --- 2. 基本ケース（複数種類） ---
		{
			description:
				"【複数】デッキ40枚、手札5枚のとき、A(4枚)を1枚、B(3枚)を1枚引く",
			input: {
				deckSize: 40,
				initialHandSize: 5,
				targetCards: [
					{ K_in_deck: 4, k_desired: 1 },
					{ K_in_deck: 3, k_desired: 1 },
				],
			},
			expected: {
				probExactly: 0.0994, // 約 9.94%
				// P(A>=1, B>=1)の計算は複雑なため、単純なケースで別途テスト
				probAtLeast: 0.1293, // 手計算またはシミュレーションによる近似値
			},
		},
		{
			description: "【複数】単純なケースで「以上」の確率を検証",
			input: {
				deckSize: 10,
				initialHandSize: 3,
				targetCards: [
					{ K_in_deck: 2, k_desired: 1 }, // カードA
					{ K_in_deck: 1, k_desired: 1 }, // カードB
				],
			},
			expected: {
				// P(A=1, B=1)
				probExactly: 14 / 120, // 14/120
				// P(A>=1, B>=1) = P(A=1,B=1) + P(A=2,B=1)
				probAtLeast: 0.125, // (14+1)/120 = 15/120 = 0.125
			},
		},

		// --- 3. エッジケース ---
		{
			description: "【エッジ】引きたい枚数 > デッキ内の枚数 → 確率0",
			input: {
				deckSize: 20,
				initialHandSize: 5,
				targetCards: [{ K_in_deck: 3, k_desired: 4 }],
			},
			expected: { probExactly: 0, probAtLeast: 0 },
		},
		{
			description: "【エッジ】引きたい枚数 > 手札の枚数 → 確率0",
			input: {
				deckSize: 20,
				initialHandSize: 5,
				targetCards: [{ K_in_deck: 10, k_desired: 6 }],
			},
			expected: { probExactly: 0, probAtLeast: 0 },
		},
		// {
		//   description: "【エッジ】組み合わせとして不可能 (n-k > N-K) → 確率0",
		//   input: {
		//     deckSize: 20,
		//     initialHandSize: 18,
		//     // 残り(非対象)のカードはデッキに5枚しかないのに、手札で16枚(18-2)引くことはできない
		//     targetCards: [{ K_in_deck: 15, k_desired: 2 }],
		//   },
		//   expected: { probExactly: 0, probAtLeast: 0 },
		// },
		{
			description: "【エッジ】対象カードの合計 > デッキ枚数 → 確率0",
			input: {
				deckSize: 40,
				initialHandSize: 5,
				targetCards: [
					{ K_in_deck: 30, k_desired: 1 },
					{ K_in_deck: 15, k_desired: 1 },
				],
			},
			expected: { probExactly: 0, probAtLeast: 0 },
		},
		{
			description: "【エッジ】手札が0枚のとき → (0枚以上引く確率以外は)確率0",
			input: {
				deckSize: 40,
				initialHandSize: 0,
				targetCards: [{ K_in_deck: 4, k_desired: 1 }],
			},
			expected: { probExactly: 0, probAtLeast: 0 },
		},

		// --- 4. `probAtLeast`の検証 ---
		{
			description: "【AtLeast】引きたい枚数が0のとき → probAtLeastは1 (100%)",
			input: {
				deckSize: 40,
				initialHandSize: 5,
				targetCards: [{ K_in_deck: 4, k_desired: 0 }],
			},
			expected: {
				// 0枚ちょうどを引く確率
				probExactly: 0.573,
				// 0枚以上引く確率は常に1
				probAtLeast: 1,
			},
		},
		{
			description:
				"【AtLeast】デッキ内の対象カードをすべて引くとき → probExactlyとprobAtLeastが一致",
			input: {
				deckSize: 10,
				initialHandSize: 4,
				targetCards: [{ K_in_deck: 4, k_desired: 4 }],
			},
			expected: {
				probExactly: 1 / 210, // 1/210
				probAtLeast: 1 / 210, // 1/210
			},
		},
	])(
		"$description, should calculate probabilities correctly",
		({ input, expected }) => {
			const result = calc(input);
			expect(result.probExactly).toBeCloseTo(expected.probExactly);
			expect(result.probAtLeast).toBeCloseTo(expected.probAtLeast);
		},
	);
});
