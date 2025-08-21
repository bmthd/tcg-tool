import { HistoryList } from "./history-list";
import { HistoryStats } from "./history-stats";

export const DrawCalcDBHistory = () => {
	return (
		<div className="space-y-6">
			{/* 統計情報セクション */}
			<HistoryStats />

			{/* 履歴一覧セクション */}
			<HistoryList />
		</div>
	);
};
