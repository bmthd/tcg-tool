import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import { gameTemplates } from "@/views/draw-calc/const";
import { useLiveQuery } from "@tanstack/react-db";
import { BarChartIcon, CalendarIcon, TrendingUpIcon } from "lucide-react";
import { drawCalcStatsCollection } from "./collection";

export const HistoryStats = () => {
	// 軽量なクエリで統計データを取得（IDと基本情報のみ）
	const { data: statsData, isLoading } = useLiveQuery(drawCalcStatsCollection);

	// クライアント側で統計を計算
	const stats = statsData 
		? {
				totalCount: statsData.length,
				gamesCount: statsData.reduce(
					(acc, item) => {
						acc[item.gameTemplate] = (acc[item.gameTemplate] || 0) + 1;
						return acc;
					},
					{} as Record<string, number>,
				),
				latestCalculation: statsData[0] || null, // 既にソート済みなので最初が最新
			}
		: {
				totalCount: 0,
				gamesCount: {},
				latestCalculation: null,
			};

	const { totalCount, gamesCount, latestCalculation } = stats;

	if (isLoading) {
		return (
			<Section className="bg-slate-700/30 border border-slate-600">
				<div className="animate-pulse">
					<div className="h-6 bg-slate-600 rounded w-32 mb-4" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="h-16 bg-slate-600 rounded" />
						<div className="h-16 bg-slate-600 rounded" />
						<div className="h-16 bg-slate-600 rounded" />
					</div>
				</div>
			</Section>
		);
	}

	return (
		<Section className="bg-slate-700/30 border border-slate-600">
			<div className="flex items-center gap-2 mb-4">
				<BarChartIcon className="h-5 w-5 text-sky-400" />
				<Heading level={3} className="text-slate-200">
					統計情報
				</Heading>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* 総計算回数 */}
				<div className="bg-slate-800/50 rounded-lg p-4 text-center">
					<TrendingUpIcon className="h-6 w-6 text-green-400 mx-auto mb-2" />
					<Text className="text-2xl font-bold text-green-100">
						{totalCount}
					</Text>
					<Text className="text-sm text-slate-400">総計算回数</Text>
				</div>

				{/* 最新計算日 */}
				<div className="bg-slate-800/50 rounded-lg p-4 text-center">
					<CalendarIcon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
					<Text className="text-sm font-medium text-blue-100">
						{latestCalculation
							? new Date(latestCalculation.updatedAt).toLocaleDateString(
									"ja-JP",
								)
							: "なし"}
					</Text>
					<Text className="text-sm text-slate-400">最新計算日</Text>
				</div>

				{/* ゲーム別集計 */}
				<div className="bg-slate-800/50 rounded-lg p-4">
					<Text className="text-sm font-medium text-slate-200 mb-2 text-center">
						ゲーム別
					</Text>
					<div className="space-y-1">
						{Object.entries(gamesCount).map(([gameTemplate, count]) => (
							<div
								key={gameTemplate}
								className="flex justify-between items-center"
							>
								<Text className="text-xs text-slate-300">
									{gameTemplates[gameTemplate as keyof typeof gameTemplates]
										?.name || gameTemplate}
								</Text>
								<Text className="text-xs font-medium text-sky-200">
									{count}回
								</Text>
							</div>
						))}
						{Object.keys(gamesCount).length === 0 && (
							<Text className="text-xs text-slate-400 text-center">
								データなし
							</Text>
						)}
					</div>
				</div>
			</div>
		</Section>
	);
};
