import { Section } from "@/ui/layout";
import { Heading, Text } from "@/ui/typography";
import {
	CalculatorIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	InfoIcon,
	PlusCircleIcon,
} from "lucide-react";
import { useReducer } from "react";
import { DrawCalcForm } from "./form";

export const DrawCalcPage = () => {
	return (
		<div className="flex flex-col items-center min-h-screen p-4 bg-slate-900 text-slate-100 selection:bg-sky-500 selection:text-white">
			<div className="w-full max-w-xl p-6 md:p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl mb-8">
				<AppHeader />
				<AppDescription />
				<UsageGuide />
				<DrawCalcForm />
			</div>
			<AppFooter />
		</div>
	);
};

const AppHeader: React.FC = () => (
	<header className="text-center">
		<Heading level={1}>ドロー確率計算機</Heading>
		<Text className="text-slate-400 mt-1">トレーディングカードゲーム用</Text>
	</header>
);

const AppDescription: React.FC = () => (
	<Section className="bg-slate-700/50">
		<Heading level={2} className="text-lg">
			このアプリについて
		</Heading>
		<Text>
			このツールは、トレーディングカードゲーム（TCG）において、特定のカードを初期手札に引く確率を計算するためのアプリケーションです。デッキの枚数、初期手札の枚数、デッキ内の特定カードの枚数、そしてそのうち何枚引きたいか、といった情報を入力することで、超幾何分布に基づいた確率を計算します。複数のカードについて同時に計算することも可能です。
		</Text>
	</Section>
);

const UsageGuide: React.FC = () => {
	const [isOpen, toggle] = useReducer((state) => !state, false);
	return (
		<Section className="bg-slate-700/50">
			<div
				className="flex justify-between items-center cursor-pointer py-2"
				onClick={toggle}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						toggle();
					}
				}}
			>
				<Heading level={2} className="text-lg mb-0 text-sky-300">
					使い方
				</Heading>
				{isOpen ? (
					<ChevronUpIcon className="text-sky-300" />
				) : (
					<ChevronDownIcon className="text-sky-300" />
				)}
			</div>
			{isOpen && (
				<div className="mt-2">
					<ol className="usage-text list-decimal list-inside space-y-2">
						<li>
							<strong>ゲームテンプレートの選択:</strong>
							ドロップダウンメニューから、プレイしているゲームのテンプレートを選択します。「カスタム」を選択すると、全ての値を自由に設定できます。各テンプレートには、一般的なデッキ枚数や初期手札枚数がプリセットされています。情報アイコン（
							<InfoIcon size={16} className="inline-block text-blue-400" />
							）で詳細を確認できます。
						</li>
						<li>
							<strong>基本情報の入力:</strong>
							「デッキの総枚数(N)」と「基本初期手札枚数」を入力します。テンプレート選択時に自動で入力されますが、変更も可能です。
						</li>
						<li>
							<strong>先行 / 後攻の選択:</strong>
							「先行」または「後攻」ボタンを選択します。これにより、ゲームごとのターン開始時追加ドローが考慮され、「計算上の初期手札(n)」が自動で更新されます。
						</li>
						<li>
							<strong>特定カード情報の設定:</strong>
							「特定カードを追加」ボタン（
							<PlusCircleIcon size={16} className="inline-block" />
							）で、確率を知りたいカードの情報を入力します（最大3種類まで）。
							<ul className="list-disc list-inside ml-4 text-xs">
								<li>
									<strong>カード名:</strong>
									どのカードか識別するための名前です（計算には影響しません）。
								</li>
								<li>
									<strong>デッキ内の枚数(K):</strong>
									そのカードがデッキに何枚入っているか。
								</li>
								<li>
									<strong>引きたい枚数(k):</strong>
									初期手札にそのカードを何枚引きたいか。
								</li>
							</ul>
						</li>
						<li>
							<strong>確率の計算と確認:</strong> 「確率を計算」ボタン（
							<CalculatorIcon size={16} className="inline-block" />
							）を押すと、結果が表示されます。「ちょうど指定枚数引く確率」と「それぞれ指定枚数以上引く確率」の2種類が表示されます。
						</li>
					</ol>
				</div>
			)}
		</Section>
	);
};

const AppFooter: React.FC = () => (
	<footer className="mt-8 text-center pb-8">
		<Text className="text-xs text-slate-500">
			&copy; 2025 TCG Draw Calculator. All rights reserved.
		</Text>
	</footer>
);
