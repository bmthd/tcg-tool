import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import { useLiveQuery } from "@tanstack/react-db";
import { ClockIcon } from "lucide-react";
import { drawCalcHistoryCollection } from "./collection";
import { HistoryItem } from "./history-item";

export const HistoryList = () => {
	const {
		data: calculations,
		isLoading,
		isError,
	} = useLiveQuery((q) =>
		q
			.from({ calculations: drawCalcHistoryCollection })
			.select(({ calculations }) => ({
				id: calculations.id,
				createdAt: calculations.createdAt,
				updatedAt: calculations.updatedAt,
			})),
	);

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

	if (!calculations || calculations.length === 0) {
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
				<Heading level={2}>計算履歴 ({calculations.length}件)</Heading>
			</Section>

			{calculations.map((calc) => (
				<HistoryItem key={calc.id} calculationId={calc.id} />
			))}
		</div>
	);
};
