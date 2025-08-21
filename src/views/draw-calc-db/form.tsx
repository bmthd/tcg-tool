import { Button } from "@/ui/form";
import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import { cx } from "@/utils/cx";
import { type GameTemplateKey, gameTemplates } from "@/views/draw-calc/const";
import { calc } from "@/views/draw-calc/logic";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { createDrawCalc, drawCalcCollection } from "./collection";
import type { TargetCard } from "./db-schema";
import { RecentCalculations } from "./recent-calculations";

export const DrawCalcDBForm = () => {
	// フォーム状態
	const [gameTemplate, setGameTemplate] = useState<GameTemplateKey>("yugioh");
	const [isFirstPlayer, setIsFirstPlayer] = useState(true);
	const [deckSize, setDeckSize] = useState<number>(
		gameTemplates[gameTemplate].deckSize,
	);
	const [initialHandSize, setInitialHandSize] = useState(
		gameTemplates[gameTemplate].baseInitialHandSize +
			(isFirstPlayer
				? gameTemplates[gameTemplate].firstPlayerTurnDraw
				: gameTemplates[gameTemplate].secondPlayerTurnDraw),
	);
	const [targetCards, setTargetCards] = useState<TargetCard[]>([
		{ id: "1", name: "", K_in_deck: 3, k_desired: 1 },
	]);

	// 計算結果
	const [result, setResult] = useState<{
		probExactly: number;
		probAtLeast: number;
	} | null>(null);

	// ゲームテンプレート変更時の処理
	const handleGameTemplateChange = (template: GameTemplateKey) => {
		setGameTemplate(template);
		const templateData = gameTemplates[template];
		setDeckSize(templateData.deckSize);
		setInitialHandSize(
			templateData.baseInitialHandSize +
				(isFirstPlayer
					? templateData.firstPlayerTurnDraw
					: templateData.secondPlayerTurnDraw),
		);
	};

	// 先攻後攻変更時の処理
	const handlePlayerOrderChange = (first: boolean) => {
		setIsFirstPlayer(first);
		const templateData = gameTemplates[gameTemplate];
		setInitialHandSize(
			templateData.baseInitialHandSize +
				(first
					? templateData.firstPlayerTurnDraw
					: templateData.secondPlayerTurnDraw),
		);
	};

	// カード追加
	const addTargetCard = () => {
		const newId = (
			Math.max(...targetCards.map((card) => Number.parseInt(card.id, 10))) + 1
		).toString();
		setTargetCards([
			...targetCards,
			{ id: newId, name: "", K_in_deck: 3, k_desired: 1 },
		]);
	};

	// カード削除
	const removeTargetCard = (id: string) => {
		if (targetCards.length > 1) {
			setTargetCards(targetCards.filter((card) => card.id !== id));
		}
	};

	// カード更新
	const updateTargetCard = (
		id: string,
		field: keyof TargetCard,
		value: string | number,
	) => {
		setTargetCards(
			targetCards.map((card) =>
				card.id === id ? { ...card, [field]: value } : card,
			),
		);
	};

	// 確率計算（自動保存付き）
	const handleCalculate = () => {
		if (targetCards.some((card) => !card.name.trim())) return;

		const calcResult = calc({
			deckSize,
			initialHandSize,
			targetCards: targetCards.map((card) => ({
				K_in_deck: card.K_in_deck,
				k_desired: card.k_desired,
			})),
		});

		setResult(calcResult);

		// 計算結果を自動保存
		try {
			const data = createDrawCalc({
				deckSize,
				initialHandSize,
				gameTemplate,
				isFirstPlayer,
				targetCards,
				result: calcResult,
			});

			drawCalcCollection.insert(data);
			console.log("計算結果を自動保存しました");
		} catch (error) {
			console.error("自動保存に失敗しました:", error);
		}
	};

	return (
		<div className="space-y-6">
			{/* ゲーム設定 */}
			<Section>
				<Heading level={2}>ゲーム設定</Heading>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="game-template"
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							ゲームテンプレート
						</label>
						<select
							id="game-template"
							value={gameTemplate}
							onChange={(e) =>
								handleGameTemplateChange(e.target.value as GameTemplateKey)
							}
							className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
						>
							{Object.entries(gameTemplates).map(([key, template]) => (
								<option key={key} value={key}>
									{template.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<span className="block text-sm font-medium text-slate-300 mb-2">
							プレイヤー順
						</span>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => handlePlayerOrderChange(true)}
								className={cx(
									"px-4 py-2 rounded-md text-sm font-medium transition-colors",
									isFirstPlayer
										? "bg-sky-600 text-white"
										: "bg-slate-700 text-slate-300 hover:bg-slate-600",
								)}
							>
								先攻
							</button>
							<button
								type="button"
								onClick={() => handlePlayerOrderChange(false)}
								className={cx(
									"px-4 py-2 rounded-md text-sm font-medium transition-colors",
									!isFirstPlayer
										? "bg-sky-600 text-white"
										: "bg-slate-700 text-slate-300 hover:bg-slate-600",
								)}
							>
								後攻
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<div>
						<label
							htmlFor="deck-size"
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							デッキサイズ
						</label>
						<input
							id="deck-size"
							type="number"
							value={deckSize}
							onChange={(e) => {
								const value = Number(e.target.value);
								if (value > 0) setDeckSize(value);
							}}
							className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
							min={1}
						/>
					</div>

					<div>
						<label
							htmlFor="initial-hand-size"
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							初期手札枚数
						</label>
						<input
							id="initial-hand-size"
							type="number"
							value={initialHandSize}
							onChange={(e) => setInitialHandSize(Number(e.target.value))}
							className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
							min={0}
						/>
					</div>
				</div>
			</Section>

			{/* 対象カード */}
			<Section>
				<div className="flex items-center justify-between mb-4">
					<Heading level={2}>対象カード</Heading>
					<Button
						onClick={addTargetCard}
						variant="secondary"
						className="flex items-center gap-2"
					>
						<PlusCircleIcon className="h-4 w-4" />
						カード追加
					</Button>
				</div>

				<div className="space-y-4">
					{targetCards.map((card) => (
						<div
							key={card.id}
							className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-700 rounded-lg"
						>
							<div>
								<label
									htmlFor={`card-name-${card.id}`}
									className="block text-sm font-medium text-slate-300 mb-2"
								>
									カード名
								</label>
								<input
									id={`card-name-${card.id}`}
									type="text"
									value={card.name}
									onChange={(e) =>
										updateTargetCard(card.id, "name", e.target.value)
									}
									className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
									placeholder="カード名を入力"
								/>
							</div>

							<div>
								<label
									htmlFor={`card-deck-count-${card.id}`}
									className="block text-sm font-medium text-slate-300 mb-2"
								>
									デッキ内枚数
								</label>
								<input
									id={`card-deck-count-${card.id}`}
									type="number"
									value={card.K_in_deck}
									onChange={(e) =>
										updateTargetCard(
											card.id,
											"K_in_deck",
											Number(e.target.value),
										)
									}
									className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
									min={1}
									max={gameTemplates[gameTemplate].maxCopiesInDeck}
								/>
							</div>

							<div>
								<label
									htmlFor={`card-desired-count-${card.id}`}
									className="block text-sm font-medium text-slate-300 mb-2"
								>
									引きたい枚数
								</label>
								<input
									id={`card-desired-count-${card.id}`}
									type="number"
									value={card.k_desired}
									onChange={(e) =>
										updateTargetCard(
											card.id,
											"k_desired",
											Number(e.target.value),
										)
									}
									className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
									min={1}
									max={card.K_in_deck}
								/>
							</div>

							<div className="flex items-end">
								<Button
									onClick={() => removeTargetCard(card.id)}
									variant="danger"
									disabled={targetCards.length === 1}
									className="w-full flex items-center justify-center gap-2"
								>
									<TrashIcon className="h-4 w-4" />
									削除
								</Button>
							</div>
						</div>
					))}
				</div>
			</Section>

			{/* 計算ボタン */}
			<div className="flex justify-center">
				<Button
					onClick={handleCalculate}
					disabled={targetCards.some((card) => !card.name.trim())}
					className="px-8 py-3 text-lg"
				>
					確率を計算する
				</Button>
			</div>

			{/* 結果表示 */}
			{result && (
				<Section>
					<Heading level={2}>計算結果</Heading>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="text-center p-6 bg-gradient-to-br from-sky-600/20 to-sky-700/20 rounded-lg border border-sky-500/30">
							<Text className="text-sm text-sky-300 mb-2">
								ちょうど引く確率
							</Text>
							<Text className="text-3xl font-bold text-sky-100">
								{(result.probExactly * 100).toFixed(2)}%
							</Text>
						</div>
						<div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-lg border border-green-500/30">
							<Text className="text-sm text-green-300 mb-2">
								少なくとも1枚引く確率
							</Text>
							<Text className="text-3xl font-bold text-green-100">
								{(result.probAtLeast * 100).toFixed(2)}%
							</Text>
						</div>
					</div>

					<div className="text-center mt-6">
						<Text className="text-sm text-green-300">
							✓ 計算結果は自動的に履歴に保存されました
						</Text>
					</div>
				</Section>
			)}

			{/* 最近の計算セクション */}
			<RecentCalculations />
		</div>
	);
};
