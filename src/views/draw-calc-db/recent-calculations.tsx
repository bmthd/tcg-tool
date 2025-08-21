import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import { gameTemplates } from "@/views/draw-calc/const";
import { useLiveQuery } from "@tanstack/react-db";
import { ClockIcon, TrendingUpIcon } from "lucide-react";
import { recentDrawCalcCollection } from "./collection";

export const RecentCalculations = () => {
	const { data: recentCalcs, isLoading } = useLiveQuery(
		recentDrawCalcCollection,
	);

	if (isLoading) {
		return (
			<Section className="bg-slate-700/20 border border-slate-600">
				<div className="animate-pulse">
					<div className="h-6 bg-slate-600 rounded w-32 mb-4" />
					<div className="space-y-3">
						<div className="h-4 bg-slate-600 rounded w-full" />
						<div className="h-4 bg-slate-600 rounded w-3/4" />
						<div className="h-4 bg-slate-600 rounded w-1/2" />
					</div>
				</div>
			</Section>
		);
	}

	if (!recentCalcs || recentCalcs.length === 0) {
		return (
			<Section className="bg-slate-700/20 border border-slate-600">
				<div className="flex items-center gap-2 mb-4">
					<TrendingUpIcon className="h-5 w-5 text-sky-400" />
					<Heading level={3} className="text-slate-200">
						最近の計算
					</Heading>
				</div>
				<Text className="text-slate-400 text-center py-4">
					まだ計算履歴がありません
				</Text>
			</Section>
		);
	}

	return (
		<Section className="bg-slate-700/20 border border-slate-600">
			<div className="flex items-center gap-2 mb-4">
				<TrendingUpIcon className="h-5 w-5 text-sky-400" />
				<Heading level={3} className="text-slate-200">
					最近の計算
				</Heading>
			</div>

			<div className="space-y-3">
				{recentCalcs.map((calc) => (
					<div
						key={calc.id}
						className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/50"
					>
						<div className="flex items-center justify-between mb-2">
							<Text className="text-sm font-medium text-slate-200">
								{gameTemplates[calc.gameTemplate]?.name || calc.gameTemplate}
							</Text>
							<div className="flex items-center gap-1 text-xs text-slate-400">
								<ClockIcon className="h-3 w-3" />
								{new Date(calc.updatedAt).toLocaleString("ja-JP", {
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>

						<div className="flex items-center justify-between text-xs">
							<Text className="text-slate-400">
								{calc.isFirstPlayer ? "先攻" : "後攻"} • デッキ{calc.deckSize}枚
								•{calc.targetCards?.length || 0}種類
							</Text>
							{calc.result && (
								<Text className="text-green-300 font-medium">
									{((calc.result.probAtLeast || 0) * 100).toFixed(1)}%
								</Text>
							)}
						</div>
					</div>
				))}
			</div>
		</Section>
	);
};
