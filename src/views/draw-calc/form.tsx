import { Button, InputNumber, Select } from "@/ui/form";
import { Section } from "@/ui/layout";
import { Tooltip } from "@/ui/overlay";
import { Heading, Text } from "@/ui/typography";
import {
	Calculator,
	PlusCircle,
	Trash2,
	User,
	UserCheck,
} from "lucide-react";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { type GameTemplateKey, MAX_CARD_GROUPS, gameTemplates } from "./const";

// --- Pure Calculation Logic ---
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

interface TargetCard {
	id: number;
	name: string;
	K_in_deck: number | null; // null for empty input
	k_desired: number | null; // null for empty input
	defaultSet?: boolean; // To track if K_in_deck was set by template default
}

interface CalculationResult {
	probExactly: number | null;
	probAtLeast: number | null;
	desiredString: string;
}

export const DrawSettingsForm: React.FC = () => {
	const [deckSize, setDeckSize] = useState<number | null>(
		gameTemplates.custom.deckSize,
	);
	const [initialHandSize, setInitialHandSize] = useState<number | null>(
		gameTemplates.custom.baseInitialHandSize,
	);
	const [isFirstPlayer, setIsFirstPlayer] = useState<boolean>(true);
	const [currentTemplateKey, setCurrentTemplateKey] =
		useState<GameTemplateKey>("custom");

	const [targetCards, setTargetCards] = useState<TargetCard[]>([]);

	const [result, setResult] = useState<CalculationResult>({
		probExactly: null,
		probAtLeast: null,
		desiredString: "",
	});
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isCalculating, setIsCalculating] = useState<boolean>(false);

	const tooltipContent = useMemo<string>(() => {
		return gameTemplates[currentTemplateKey]?.description || "";
	}, [currentTemplateKey]);

	const actualDrawCount = useMemo<number>(() => {
		const base = initialHandSize || 0;
		const template = gameTemplates[currentTemplateKey];
		if (!template) return base;
		const turnDraw = isFirstPlayer
			? template.firstPlayerTurnDraw
			: template.secondPlayerTurnDraw;
		return base + turnDraw;
	}, [initialHandSize, isFirstPlayer, currentTemplateKey]);

	// Initialize with one card group
	useEffect(() => {
		if (targetCards.length === 0) {
			const template = gameTemplates[currentTemplateKey];
			setTargetCards([
				{
					id: Date.now(),
					name: "",
					K_in_deck: template ? template.maxCopiesInDeck : 1,
					k_desired: 1,
					defaultSet: true,
				},
			]);
		}
	}, [targetCards.length, currentTemplateKey]); // Only re-run if targetCards.length or currentTemplateKey changes

	const handleCalculate = useCallback(async (): Promise<void> => {
		setErrorMessage("");
		setResult({ probExactly: null, probAtLeast: null, desiredString: "" });
		setIsCalculating(true);
		await new Promise((resolve) => setTimeout(resolve, 50));

		const N = deckSize;
		const n = actualDrawCount;

		if (N === null || Number.isNaN(N) || N <= 0) {
			setErrorMessage("デッキの総枚数に有効な数値を入力してください。");
			setIsCalculating(false);
			return;
		}
		if (Number.isNaN(n) || n < 0) {
			setErrorMessage("計算上の初期手札枚数が不正です。");
			setIsCalculating(false);
			return;
		}

		if (targetCards.length === 0) {
			setErrorMessage("最低1種類の特定カード情報を入力してください。");
			setIsCalculating(false);
			return;
		}

		let sumTotalKInDeck = 0;
		let sumMinDesiredK = 0;
		for (const group of targetCards) {
			const K_val = group.K_in_deck;
			const k_val = group.k_desired;

			if (K_val === null || k_val === null || K_val < 0 || k_val < 0) {
				setErrorMessage("全ての特定カード情報に有効な数値を入力してください。");
				setIsCalculating(false);
				return;
			}
			if (k_val > K_val) {
				setErrorMessage(
					`「${group.name || `カード${targetCards.indexOf(group) + 1}`}」の「引きたい枚数」(${k_val})は「デッキ内の枚数」(${K_val})以下にしてください。`,
				);
				setIsCalculating(false);
				return;
			}
			if (k_val > n) {
				setErrorMessage(
					`「${group.name || `カード${targetCards.indexOf(group) + 1}`}」の「引きたい枚数」(${k_val})は「計算上の初期手札」(${n})以下にしてください。`,
				);
				setIsCalculating(false);
				return;
			}
			sumTotalKInDeck += K_val;
			sumMinDesiredK += k_val;
		}

		if (sumTotalKInDeck > N) {
			setErrorMessage(
				`特定カードのデッキ内枚数の合計(${sumTotalKInDeck})が、デッキ総枚数(${N})を超えています。`,
			);
			setIsCalculating(false);
			return;
		}
		if (sumMinDesiredK > n) {
			setErrorMessage(
				`引きたいカード枚数の合計(${sumMinDesiredK})が、初期手札枚数(${n})を超えています。`,
			);
			setIsCalculating(false);
			return;
		}

		const calculateProbabilityExactly = (
			N_deck: number,
			n_hand: number,
			groups: TargetCard[],
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
					const current_sum_k = current_k_values_array.reduce(
						(a, b) => a + b,
						0,
					);
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

		const desiredString = targetCards
			.map(
				(g) =>
					`「${g.name || `カード${targetCards.indexOf(g) + 1}`}」を${g.k_desired}枚`,
			)
			.join("、");
		setResult({ probExactly, probAtLeast, desiredString });
		setIsCalculating(false);
	}, [deckSize, actualDrawCount, targetCards]);

	const handleTemplateChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>): void => {
			const newKey = e.target.value as GameTemplateKey;
			setCurrentTemplateKey(newKey);
			const template = gameTemplates[newKey];
			if (template) {
				setDeckSize(template.deckSize);
				setInitialHandSize(template.baseInitialHandSize);
				// Adjust existing target cards K_in_deck based on new template's maxCopiesInDeck
				setTargetCards((prevCards) =>
					prevCards.map((card) => ({
						...card,
						K_in_deck:
							card.K_in_deck !== null
								? Math.min(card.K_in_deck, template.maxCopiesInDeck)
								: template.maxCopiesInDeck,
					})),
				);
			}
		},
		[]
	);

	const handleAddCardGroup = useCallback((): void => {
		if (targetCards.length < MAX_CARD_GROUPS) {
			const template = gameTemplates[currentTemplateKey];
			setTargetCards((prev) => [
				...prev,
				{
					id: Date.now(),
					name: "",
					K_in_deck: template ? template.maxCopiesInDeck : 1,
					k_desired: 1,
					defaultSet: true,
				},
			]);
		}
	}, [targetCards.length, currentTemplateKey]);

	const handleRemoveCardGroup = useCallback(
		(id: number): void => {
			setTargetCards((prev) => {
				const updatedCards = prev.filter((card) => card.id !== id);
				if (updatedCards.length === 0) {
					// If all cards are removed, add a default one back
					const template = gameTemplates[currentTemplateKey];
					return [
						{
							id: Date.now(),
							name: "",
							K_in_deck: template ? template.maxCopiesInDeck : 1,
							k_desired: 1,
							defaultSet: true,
						},
					];
				}
				return updatedCards;
			});
		},
		[currentTemplateKey],
	);

	const handleTargetCardChange = useCallback(
		(
			id: number,
			field: keyof Omit<TargetCard, "id" | "defaultSet">,
			value: string | number | null,
		): void => {
			setTargetCards((prev) =>
				prev.map((card) =>
					card.id === id
						? {
								...card,
								[field]: value,
								...(field === "K_in_deck" && { defaultSet: false }),
							}
						: card,
				),
			);
		},
		[],
	);

	// Effect to ensure there's always at least one card group if the list becomes empty
	// This was previously in App, moved here as it's form logic.
	// However, this is a direct state manipulation based on another state, which is an anti-pattern if not handled carefully.
	// The logic in handleRemoveCardGroup now handles this.
	// useEffect(() => {
	//    if (targetCards.length === 0) {
	//        const template = gameTemplates[currentTemplateKey];
	//        setTargetCards([{
	//            id: Date.now(), name: '',
	//            K_in_deck: template ? template.maxCopiesInDeck : 1,
	//            k_desired: 1, defaultSet: true
	//        }]);
	//    }
	// }, [targetCards.length, currentTemplateKey, setTargetCards]);

	return (
		<>
			<GameSettings
				currentTemplateKey={currentTemplateKey}
				onTemplateChange={handleTemplateChange}
				tooltipContent={tooltipContent}
				deckSize={deckSize}
				onDeckSizeChange={setDeckSize}
				initialHandSize={initialHandSize}
				onInitialHandSizeChange={setInitialHandSize}
				isFirstPlayer={isFirstPlayer}
				onPlayerOrderChange={setIsFirstPlayer}
				actualDrawCount={actualDrawCount}
			/>
			<TargetCardsManager
				cards={targetCards}
				onAdd={handleAddCardGroup}
				onRemove={handleRemoveCardGroup}
				onChange={handleTargetCardChange}
				currentTemplateMaxCopies={
					gameTemplates[currentTemplateKey]?.maxCopiesInDeck
				}
			/>
			<CalculationControls
				onCalculate={handleCalculate}
				isCalculating={isCalculating}
				errorMessage={errorMessage}
			/>
			<FormulaDisplay />
			<ResultsDisplay result={result} />
		</>
	);
};

interface CalculationControlsProps {
	onCalculate: () => Promise<void>;
	isCalculating: boolean;
	errorMessage: string;
}
export const CalculationControls: React.FC<CalculationControlsProps> = ({
	onCalculate,
	isCalculating,
	errorMessage,
}) => (
	<>
		<Button
			onClick={onCalculate}
			disabled={isCalculating}
			size="lg"
			className="w-full hover:scale-105"
		>
			<Calculator size={20} />
			{isCalculating ? "計算中..." : "確率を計算"}
		</Button>
		{errorMessage && (
			<div className="my-3 p-3 bg-red-900/50 border border-red-700 rounded-md">
				<Text className="text-red-400 text-sm font-medium text-center">
					{errorMessage}
				</Text>
			</div>
		)}
		{isCalculating && !errorMessage && (
			<Text className="text-center text-sky-400 text-sm mt-2">計算中...</Text>
		)}
	</>
);

export interface ResultsDisplayProps {
	result: CalculationResult;
}
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
	if (result.probExactly === null) return null;
	return (
		<div className="pt-4 text-center">
			<Heading level={3} className="text-lg text-sky-300">
				{`全カードを「ちょうど」指定枚数(${result.desiredString})引く確率: ${(result.probExactly * 100).toFixed(2)}%`}
			</Heading>
			{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
			{Math.abs(result.probAtLeast! - result.probExactly) > 0.000001 &&
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			result.probAtLeast! > result.probExactly ? (
				<Text className="text-sm text-slate-400">
					{`全カードを「それぞれ指定枚数以上」で引く確率: ${
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						(result.probAtLeast! * 100).toFixed(2)
					}%`}
				</Text>
			) : result.probExactly > 0 &&
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				Math.abs(result.probAtLeast! - result.probExactly) <= 0.000001 ? (
				<Text className="text-sm text-slate-400">
					(これが指定枚数以上引く場合の唯一のパターン、またはそれに非常に近いです)
				</Text>
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
			) : result.probExactly === 0 && result.probAtLeast! > 0 ? (
				<Text className="text-sm text-slate-400">
					{`全カードを「それぞれ指定枚数以上」で引く確率: ${
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						(result.probAtLeast! * 100).toFixed(2)
					}%`}
				</Text>
			) : null}
		</div>
	);
};

interface TargetCardsManagerProps {
	cards: TargetCard[];
	onAdd: () => void;
	onRemove: (id: number) => void;
	onChange: (
		id: number,
		field: keyof Omit<TargetCard, "id" | "defaultSet">,
		value: string | number | null,
	) => void;
	currentTemplateMaxCopies?: number;
}
const TargetCardsManager: React.FC<TargetCardsManagerProps> = ({
	cards,
	onAdd,
	onRemove,
	onChange,
	currentTemplateMaxCopies,
}) => (
	<div className="space-y-3">
		{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
		<label className="block text-sm font-medium text-slate-400">
			特定カード情報 (最大 {MAX_CARD_GROUPS}種類)
		</label>
		{cards.map((card, index) => (
			<TargetCardItem
				key={card.id}
				card={card}
				index={index}
				onRemove={onRemove}
				onChange={onChange}
				maxK={currentTemplateMaxCopies}
			/>
		))}
		<Button
			variant="secondary"
			onClick={onAdd}
			disabled={cards.length >= MAX_CARD_GROUPS}
			className="w-full"
		>
			<PlusCircle size={18} />
			<span>
				{cards.length >= MAX_CARD_GROUPS
					? `特定カード (上限 ${MAX_CARD_GROUPS}種類)`
					: "特定カードを追加"}
			</span>
		</Button>
	</div>
);

interface TargetCardItemProps {
	card: TargetCard;
	index: number;
	onRemove: (id: number) => void;
	onChange: (
		id: number,
		field: keyof Omit<TargetCard, "id" | "defaultSet">,
		value: string | number | null,
	) => void;
	maxK?: number;
}
const TargetCardItem: React.FC<TargetCardItemProps> = ({
	card,
	index,
	onRemove,
	onChange,
	maxK,
}) => (
	<div className="bg-slate-700/70 p-3 rounded-md space-y-2 border border-slate-600">
		<div className="flex justify-between items-center">
			<Text className="text-sm font-medium text-sky-400">
				特定カード {index + 1}
			</Text>
			<Button variant="danger" size="sm" onClick={() => onRemove(card.id)}>
				<Trash2 size={14} />
				削除
			</Button>
		</div>
		<div>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
			<label className="text-xs text-slate-400">カード名</label>
			<input
				type="text"
				placeholder="例: エースカード"
				value={card.name}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					onChange(card.id, "name", e.target.value)
				}
				className="mt-0.5 block w-full px-2 py-1.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
			/>
		</div>
		<InputNumber
			label="デッキ内の枚数 (K)"
			value={card.K_in_deck}
			onChange={(e: ChangeEvent<HTMLInputElement>) =>
				onChange(
					card.id,
					"K_in_deck",
					e.target.value === "" ? null : Number.parseInt(e.target.value),
				)
			}
			min={0}
			max={maxK}
			labelClassName="text-xs"
			className="text-sm py-1.5"
		/>
		<InputNumber
			label="引きたい枚数 (k)"
			value={card.k_desired}
			onChange={(e: ChangeEvent<HTMLInputElement>) =>
				onChange(
					card.id,
					"k_desired",
					e.target.value === "" ? null : Number.parseInt(e.target.value),
				)
			}
			min={0}
			labelClassName="text-xs"
			className="text-sm py-1.5"
		/>
	</div>
);

interface GameSettingsProps {
	currentTemplateKey: GameTemplateKey;
	onTemplateChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	tooltipContent: string;
	deckSize: number | null;
	onDeckSizeChange: (value: number | null) => void;
	initialHandSize: number | null;
	onInitialHandSizeChange: (value: number | null) => void;
	isFirstPlayer: boolean;
	onPlayerOrderChange: (isFirst: boolean) => void;
	actualDrawCount: number;
}
const GameSettings: React.FC<GameSettingsProps> = ({
	currentTemplateKey,
	onTemplateChange,
	tooltipContent,
	deckSize,
	onDeckSizeChange,
	initialHandSize,
	onInitialHandSizeChange,
	isFirstPlayer,
	onPlayerOrderChange,
	actualDrawCount,
}) => {
	return (
		<div className="space-y-5 mt-6">
			<div>
				<label
					htmlFor="gameTemplate"
					className="block text-sm font-medium text-slate-400 mb-1"
				>
					ゲームテンプレート
					<Tooltip content={tooltipContent} />
				</label>
				<Select
					id="gameTemplate"
					value={currentTemplateKey}
					onChange={onTemplateChange}
				>
					{Object.entries(gameTemplates).map(([key, template]) => (
						<option key={key} value={key}>
							{template.name}
						</option>
					))}
				</Select>
			</div>

			<InputNumber
				label="デッキの総枚数 (N)"
				id="deckSize"
				value={deckSize}
				onChange={(e) =>
					onDeckSizeChange(
						e.target.value === "" ? null : Number.parseInt(e.target.value),
					)
				}
				min={1}
			/>
			<InputNumber
				label="基本初期手札枚数"
				id="initialHandSize"
				value={initialHandSize}
				onChange={(e) =>
					onInitialHandSizeChange(
						e.target.value === "" ? null : Number.parseInt(e.target.value),
					)
				}
				min={0}
			/>

			<div>
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
				<label className="block text-sm font-medium text-slate-400 mb-1">
					先行 / 後攻
				</label>
				<div className="grid grid-cols-2 gap-2">
					<Button
						onClick={() => onPlayerOrderChange(true)}
						variant={isFirstPlayer ? "active" : "secondary"}
						className="w-full"
					>
						<UserCheck size={18} />
						先行
					</Button>
					<Button
						onClick={() => onPlayerOrderChange(false)}
						variant={!isFirstPlayer ? "active" : "secondary"}
						className="w-full"
					>
						<User size={18} />
						後攻
					</Button>
				</div>
				<Text className="text-xs text-slate-400 mt-1">
					計算上の初期手札 (n):
					<span className="font-semibold text-sky-300">{actualDrawCount}</span>
					枚
				</Text>
			</div>
		</div>
	);
};

const FormulaDisplay: React.FC = () => (
	<Section className="bg-slate-700/50">
		<Heading level={3} className="text-base">
			計算式 (超幾何分布)
		</Heading>
		<div className="formula-text text-xs sm:text-sm">
			単一種類: P(X=k) = [C(K,k)*C(N-K,n-k)]/C(N,n)
			<br />
			複数種類: P(X₁=k₁, ...) = [ΠC(Kᵢ,kᵢ) * C(N-ΣKᵢ, n-Σkᵢ)] / C(N,n)
			<br />
			<span className="ml-4">N:デッキ, K:対象, n:手札, k:引きたい枚数</span>
		</div>
	</Section>
);
