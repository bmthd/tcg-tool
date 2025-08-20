import { Button } from "@/ui/form";
import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import { gameTemplates } from "@/views/draw-calc/const";
import { useLiveQuery } from "@tanstack/react-db";
import { CalculatorIcon, ClockIcon, TrashIcon } from "lucide-react";
import { drawCalcCollection } from "./collection";
import type { DrawCalcData } from "./db-schema";

export const DrawCalcDBHistory = () => {
	// useLiveQueryでデータを取得（シンプルアプローチ）
	const {
		data: calculations,
		isLoading,
		isError,
	} = useLiveQuery(drawCalcCollection);

	// データを更新日時で降順ソート
	const sortedCalculations = calculations
		? [...calculations]
				.filter(
					(calc): calc is DrawCalcData =>
						calc != null && typeof calc === "object" && "id" in calc,
				)
				.sort(
					(a, b) =>
						new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
				)
		: [];

	const handleDelete = async (id: string) => {
		try {
			drawCalcCollection.delete(id);
		} catch (error) {
			console.error("削除に失敗しました:", error);
		}
	};

	if (isLoading) {
		return (
			<Section>
				<div className="text-center py-12">
					<ClockIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
					<Heading level={2} className="text-slate-300 mb-2">
						読み込み中...
					</Heading>
				</div>
			</Section>
		);
	}

	if (isError) {
		return (
			<Section>
				<div className="text-center py-12">
					<ClockIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
					<Heading level={2} className="text-red-300 mb-2">
						エラーが発生しました
					</Heading>
				</div>
			</Section>
		);
	}

	if (!sortedCalculations || sortedCalculations.length === 0) {
		return (
			<Section>
				<div className="text-center py-12">
					<ClockIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
					<Heading level={2} className="text-slate-300 mb-2">
						計算履歴がありません
					</Heading>
					<Text className="text-slate-400">
						新規計算タブで計算を実行すると、ここに履歴が表示されます
					</Text>
				</div>
			</Section>
		);
	}

	return (
		<div className="space-y-4">
			<Section>
				<Heading level={2}>計算履歴 ({sortedCalculations.length}件)</Heading>
			</Section>

			{sortedCalculations?.map((calc) => (
				<Section key={calc.id} className="border border-slate-600">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							{/* ゲーム情報 */}
							<div className="flex items-center gap-2 mb-3">
								<CalculatorIcon className="h-4 w-4 text-sky-400" />
								<Text className="font-medium text-slate-200">
									{gameTemplates[calc.gameTemplate]?.name || calc.gameTemplate}{" "}
									({calc.isFirstPlayer ? "先攻" : "後攻"})
								</Text>
								<Text className="text-sm text-slate-400">
									デッキ{calc.deckSize}枚 / 手札{calc.initialHandSize}枚
								</Text>
							</div>

							{/* 対象カード */}
							<div className="mb-3">
								<Text className="text-sm text-slate-300 mb-2">対象カード:</Text>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{calc.targetCards?.map((card) => (
										<div
											key={card.id}
											className="flex items-center gap-2 text-sm"
										>
											<span className="text-slate-200 font-medium">
												{card.name || "名前なし"}
											</span>
											<span className="text-slate-400">
												(デッキ{card.K_in_deck || 0}枚中{card.k_desired || 0}
												枚引きたい)
											</span>
										</div>
									)) || []}
								</div>
							</div>

							{/* 結果 */}
							{calc.result && (
								<div className="grid grid-cols-2 gap-4 mb-3">
									<div className="bg-slate-700/50 rounded p-3 text-center">
										<Text className="text-xs text-sky-300 mb-1">
											ちょうど引く確率
										</Text>
										<Text className="font-bold text-sky-100">
											{((calc.result?.probExactly || 0) * 100).toFixed(2)}%
										</Text>
									</div>
									<div className="bg-slate-700/50 rounded p-3 text-center">
										<Text className="text-xs text-green-300 mb-1">
											少なくとも1枚引く確率
										</Text>
										<Text className="font-bold text-green-100">
											{((calc.result?.probAtLeast || 0) * 100).toFixed(2)}%
										</Text>
									</div>
								</div>
							)}

							{/* 日時 */}
							<div className="flex items-center gap-4 text-xs text-slate-400">
								{calc.createdAt && (
									<span>
										作成: {new Date(calc.createdAt).toLocaleString("ja-JP")}
									</span>
								)}
								{calc.updatedAt && (
									<span>
										更新: {new Date(calc.updatedAt).toLocaleString("ja-JP")}
									</span>
								)}
							</div>
						</div>

						{/* 削除ボタン */}
						<Button
							onClick={() => handleDelete(calc.id)}
							variant="danger"
							className="ml-4 flex items-center gap-1 px-3 py-1 text-sm"
						>
							<TrashIcon className="h-3 w-3" />
							削除
						</Button>
					</div>
				</Section>
			))}
		</div>
	);
};
