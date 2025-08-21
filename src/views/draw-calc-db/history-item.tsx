import { Button } from "@/ui/form";
import { Section } from "@/ui/layout";
import { Text } from "@/ui/typography";
import { gameTemplates } from "@/views/draw-calc/const";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { CalculatorIcon, TrashIcon } from "lucide-react";
import { drawCalcCollection } from "./collection";
import { useDeleteDrawCalc } from "./hooks";

interface HistoryItemProps {
	calculationId: string;
}

export const HistoryItem = ({ calculationId }: HistoryItemProps) => {
	// 単一アイテムを取得するクエリ
	const {
		data: calc,
		isLoading,
		isError,
	} = useLiveQuery((q) =>
		q
			.from({ calculations: drawCalcCollection })
			.where(({ calculations }) => eq(calculations.id, calculationId)),
	);
	const { deleteCalc } = useDeleteDrawCalc();

	const handleDelete = () => {
		const result = deleteCalc(calculationId);
		if (!result.success) {
			// エラーハンドリングは必要に応じて追加
		}
	};

	if (isLoading) {
		return (
			<Section className="border border-slate-600 animate-pulse">
				<div className="space-y-3">
					<div className="h-4 bg-slate-600 rounded w-3/4" />
					<div className="h-4 bg-slate-600 rounded w-1/2" />
					<div className="h-16 bg-slate-600 rounded" />
				</div>
			</Section>
		);
	}

	if (isError || !calc || calc.length === 0) {
		return (
			<Section className="border border-red-600">
				<Text className="text-red-300 text-center">
					計算データの読み込みに失敗しました
				</Text>
			</Section>
		);
	}

	const calculation = calc[0]; // 単一のアイテム

	return (
		<Section className="border border-slate-600">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					{/* ゲーム情報 */}
					<div className="flex items-center gap-2 mb-3">
						<CalculatorIcon className="h-4 w-4 text-sky-400" />
						<Text className="font-medium text-slate-200">
							{gameTemplates[calculation.gameTemplate]?.name ||
								calculation.gameTemplate}{" "}
							({calculation.isFirstPlayer ? "先攻" : "後攻"})
						</Text>
						<Text className="text-sm text-slate-400">
							デッキ{calculation.deckSize}枚 / 手札{calculation.initialHandSize}
							枚
						</Text>
					</div>

					{/* 対象カード */}
					<div className="mb-3">
						<Text className="text-sm text-slate-300 mb-2">対象カード:</Text>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							{calculation.targetCards?.map((card) => (
								<div key={card.id} className="flex items-center gap-2 text-sm">
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
					{calculation.result && (
						<div className="grid grid-cols-2 gap-4 mb-3">
							<div className="bg-slate-700/50 rounded p-3 text-center">
								<Text className="text-xs text-sky-300 mb-1">
									ちょうど引く確率
								</Text>
								<Text className="font-bold text-sky-100">
									{((calculation.result?.probExactly || 0) * 100).toFixed(2)}%
								</Text>
							</div>
							<div className="bg-slate-700/50 rounded p-3 text-center">
								<Text className="text-xs text-green-300 mb-1">
									少なくとも1枚引く確率
								</Text>
								<Text className="font-bold text-green-100">
									{((calculation.result?.probAtLeast || 0) * 100).toFixed(2)}%
								</Text>
							</div>
						</div>
					)}

					{/* 日時 */}
					<div className="flex items-center gap-4 text-xs text-slate-400">
						{calculation.createdAt && (
							<span>
								作成: {new Date(calculation.createdAt).toLocaleString("ja-JP")}
							</span>
						)}
						{calculation.updatedAt && (
							<span>
								更新: {new Date(calculation.updatedAt).toLocaleString("ja-JP")}
							</span>
						)}
					</div>
				</div>

				{/* 削除ボタン */}
				<Button
					onClick={handleDelete}
					variant="danger"
					className="ml-4 flex items-center gap-1 px-3 py-1 text-sm"
				>
					<TrashIcon className="h-3 w-3" />
					削除
				</Button>
			</div>
		</Section>
	);
};
