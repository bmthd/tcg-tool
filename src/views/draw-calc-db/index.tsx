import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import { cx } from "@/utils/cx";
import {
	CalculatorIcon,
	DatabaseIcon,
	HistoryIcon,
	PlusCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { DrawCalcDBForm } from "./form";
import { DrawCalcDBHistory } from "./history";

type ViewMode = "form" | "history";

export const DrawCalcDBPage = () => {
	const [viewMode, setViewMode] = useState<ViewMode>("form");

	return (
		<div className="flex flex-col items-center min-h-screen p-4 bg-slate-900 text-slate-100 selection:bg-sky-500 selection:text-white">
			<div className="w-full max-w-4xl p-6 md:p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl mb-8">
				<AppHeader />
				<AppDescription />
				<ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
				{viewMode === "form" ? <DrawCalcDBForm /> : <DrawCalcDBHistory />}
			</div>
			<AppFooter />
		</div>
	);
};

const AppHeader: React.FC = () => (
	<header className="text-center">
		<div className="flex items-center justify-center gap-2 mb-2">
			<DatabaseIcon className="h-8 w-8 text-sky-400" />
			<Heading level={1}>ドロー確率計算機 (DB版)</Heading>
		</div>
		<Text className="text-slate-400 mt-1">
			TanStack DBでローカルストレージに保存
		</Text>
	</header>
);

const AppDescription: React.FC = () => (
	<Section className="bg-slate-700 border border-slate-600">
		<div className="flex items-start gap-3">
			<CalculatorIcon className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
			<div className="space-y-2">
				<Text className="font-medium text-slate-200">TanStack DB版の特徴</Text>
				<ul className="text-sm text-slate-300 space-y-1 ml-4 list-disc">
					<li>計算実行時に結果を自動保存</li>
					<li>保存ボタン不要で履歴管理が簡単</li>
					<li>過去の計算履歴を参照・再利用可能</li>
					<li>リアルタイムな更新と同期</li>
				</ul>
			</div>
		</div>
	</Section>
);

interface ViewToggleProps {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => (
	<div className="flex gap-2 p-1 bg-slate-700 rounded-lg">
		<button
			type="button"
			onClick={() => setViewMode("form")}
			className={cx(
				"flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
				viewMode === "form"
					? "bg-sky-600 text-white"
					: "text-slate-300 hover:text-white hover:bg-slate-600",
			)}
		>
			<PlusCircleIcon className="h-4 w-4" />
			新規計算
		</button>
		<button
			type="button"
			onClick={() => setViewMode("history")}
			className={cx(
				"flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
				viewMode === "history"
					? "bg-sky-600 text-white"
					: "text-slate-300 hover:text-white hover:bg-slate-600",
			)}
		>
			<HistoryIcon className="h-4 w-4" />
			計算履歴
		</button>
	</div>
);

const AppFooter: React.FC = () => (
	<footer className="text-center text-slate-400 text-sm">
		<Text>
			このツールはTanStack
			DBを使用してローカルストレージでデータを管理しています
		</Text>
	</footer>
);
