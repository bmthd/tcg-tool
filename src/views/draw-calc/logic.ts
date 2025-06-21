import type { Output } from "./schema";

const combinations = (n: number, k: number): bigint => {
	if (k < 0 || k > n) return BigInt(0);
	if (k === 0 || k === n) return BigInt(1);
	let kVal = k;
	if (kVal > n / 2) kVal = n - kVal;
	let res = BigInt(1);
	for (let i = 1; i <= kVal; i++) {
		res = (res * BigInt(n - i + 1)) / BigInt(i);
	}
	return res;
};

export const calc = ({
	deckSize,
	initialHandSize,
	targetCards,
}: Pick<Output, "deckSize" | "initialHandSize" | "targetCards">): {
	probExactly: number;
	probAtLeast: number;
} => {
	const N = deckSize;
	const n = initialHandSize;
	const calculateProbabilityExactly = (
		N_deck: number,
		n_hand: number,
		groups: Output["targetCards"],
	): number => {
		let product_C_Ki_ki = BigInt(1);
		let sum_K = 0;
		let sum_k = 0;
		for (const group of groups) {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			product_C_Ki_ki *= combinations(group.K_in_deck!, group.k_desired!); // Not null due to validation
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			sum_K += group.K_in_deck!;
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			sum_k += group.k_desired!;
		}

		if (n_hand < sum_k) return 0;
		if (N_deck < sum_K) return 0;
		if (N_deck - sum_K < n_hand - sum_k) return 0;

		const C_others = combinations(N_deck - sum_K, n_hand - sum_k);
		const C_N_n = combinations(N_deck, n_hand);
		if (C_N_n === BigInt(0)) return 0;
		return Number(product_C_Ki_ki * C_others) / Number(C_N_n);
	};
	const probExactly = calculateProbabilityExactly(N, n, targetCards);

	let probAtLeast = 0;
	const denominator_C_N_n = combinations(N, n);
	if (denominator_C_N_n > BigInt(0)) {
		let totalSumProduct_C_Kk_times_C_Others = BigInt(0);
		const sum_K_of_all_target_cards = targetCards.reduce(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			(acc, g) => acc + g.K_in_deck!,
			0,
		);

		function findCombinationsRecursive(
			groupIndex: number,
			current_k_values_array: number[],
		): void {
			if (groupIndex === targetCards.length) {
				const current_sum_k = current_k_values_array.reduce((a, b) => a + b, 0);
				if (current_sum_k > n) return;
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				if (N! - sum_K_of_all_target_cards < n - current_sum_k) return;

				let product_C_Ki_ki_current_iteration = BigInt(1);
				for (let i = 0; i < targetCards.length; i++) {
					product_C_Ki_ki_current_iteration *= combinations(
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						targetCards[i].K_in_deck!,
						current_k_values_array[i],
					);
				}

				const C_others_current_iteration = combinations(
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					N! - sum_K_of_all_target_cards,
					n - current_sum_k,
				);
				if (C_others_current_iteration >= BigInt(0)) {
					totalSumProduct_C_Kk_times_C_Others +=
						product_C_Ki_ki_current_iteration * C_others_current_iteration;
				}
				return;
			}

			const currentGroup = targetCards[groupIndex];
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const min_k_for_current_group = currentGroup.k_desired!;
			let sum_k_drawn_by_previous_groups = 0;
			for (let i = 0; i < groupIndex; i++)
				sum_k_drawn_by_previous_groups += current_k_values_array[i];
			let sum_min_k_for_remaining_groups_after_current = 0;
			for (let i = groupIndex + 1; i < targetCards.length; i++)
				sum_min_k_for_remaining_groups_after_current +=
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					targetCards[i].k_desired!;

			const max_k_for_current_group = Math.min(
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				currentGroup.K_in_deck!,
				n -
					sum_k_drawn_by_previous_groups -
					sum_min_k_for_remaining_groups_after_current,
			);

			for (
				let k_val = min_k_for_current_group;
				k_val <= max_k_for_current_group;
				k_val++
			) {
				if (k_val < 0) continue;
				current_k_values_array.push(k_val);
				findCombinationsRecursive(groupIndex + 1, current_k_values_array);
				current_k_values_array.pop();
			}
		}
		findCombinationsRecursive(0, []);
		probAtLeast =
			Number(totalSumProduct_C_Kk_times_C_Others) / Number(denominator_C_N_n);
	}
	return { probExactly, probAtLeast };
};
