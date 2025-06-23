import { Button } from "@/ui/form";
import { Section } from "@/ui/layout";
import { Tooltip } from "@/ui/overlay";
import { Heading, Text } from "@/ui/typography";
import {
	CalculatorIcon,
	PlusCircleIcon,
	Trash2Icon,
	UserCheckIcon,
	UserIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { gameTemplates } from "./const";
import { useAppForm, withForm } from "./form-hook";
import * as logic from "./logic";
import { type Input, type Output, schema } from "./schema";

export function DrawCalcForm() {
	const gameTemplate = "custom" as const;
	const { deckSize, baseInitialHandSize: initialHandSize } =
		gameTemplates[gameTemplate];
	const form = useAppForm({
		validators: { onChange: schema },
		defaultValues: {
			deckSize,
			initialHandSize,
			gameTemplate,
			isFirstPlayer: true,
			targetCards: [
				{ id: crypto.randomUUID(), name: "", K_in_deck: 4, k_desired: 1 },
			],
		} as Input,
	});

	return (
		<form className="grid gap-4">
			<form.AppField name="gameTemplate">
				{(field) => {
					const handleChange = () => {
						const template = gameTemplates[field.state.value];
						form.setFieldValue("deckSize", template.deckSize);
						form.setFieldValue("initialHandSize", template.baseInitialHandSize);
					};
					return (
						<field.Select
							onChange={handleChange}
							label={
								<p>
									ゲームテンプレート
									<form.Subscribe
										selector={(state) => state.values.gameTemplate}
									>
										{(value) => (
											<Tooltip content={gameTemplates[value].description} />
										)}
									</form.Subscribe>
								</p>
							}
						>
							{Object.entries(gameTemplates).map(([key, template]) => (
								<option key={key} value={key}>
									{template.name}
								</option>
							))}
						</field.Select>
					);
				}}
			</form.AppField>

			<form.AppField name="deckSize">
				{(field) => <field.InputNumber label="デッキの総枚数 (N)" />}
			</form.AppField>

			<form.AppField name="initialHandSize">
				{(field) => <field.InputNumber label="基本初期手札枚数" />}
			</form.AppField>

			<form.AppField name="isFirstPlayer">
				{(field) => (
					<field.RadioGroup
						label="先行 / 後攻"
						items={[
							{ label: "先行", value: "true" },
							{ label: "後攻", value: "false" },
						]}
						renderItem={({ label, value }) => {
							const isFirstPlayer = value === "true";
							const Icon = isFirstPlayer ? UserCheckIcon : UserIcon;
							return (
								<Button
									className="w-full"
									variant={
										field.state.value === isFirstPlayer ? "active" : "secondary"
									}
									onClick={() => field.setValue(isFirstPlayer)}
								>
									<Icon size={18} />
									{label}
								</Button>
							);
						}}
					/>
				)}
			</form.AppField>

			<Text className="text-lg text-slate-400 mt-1">
				計算上の初期手札 (n):{" "}
				<span className="font-semibold text-sky-300">
					<form.Subscribe
						selector={(state) =>
							[
								state.values.initialHandSize,
								state.values.isFirstPlayer,
							] as const
						}
					>
						{([initialHandSize, isFirstPlayer]) =>
							`${initialHandSize + (isFirstPlayer ? 1 : 0)}枚`
						}
					</form.Subscribe>
				</span>
			</Text>

			<fieldset className="space-y-2">
				<legend className="block text-sm font-medium text-slate-400">
					特定カード情報 (最大{" "}
					<form.Subscribe selector={(state) => state.values.deckSize}>
						{(deckSize) => deckSize}
					</form.Subscribe>
					)種類
				</legend>
				<TargetCardFields form={form} />
			</fieldset>

			<ResultSubmitButton form={form} />

			<FormulaDisplay />
		</form>
	);
}

const TargetCardFields = withForm({
	defaultValues: {} as Input, // type only
	render: ({ form }) => {
		return (
			<form.AppField name="targetCards" mode="array">
				{(field) => (
					<div className="space-y-4">
						{field.state.value.map((item, index) => (
							<div
								key={item.id}
								className="bg-slate-700/70 p-3 rounded-md space-y-2 border border-slate-600"
							>
								<div className="flex justify-between items-center">
									<Text className="text-sm font-medium text-sky-400">
										特定カード {index + 1}
									</Text>
									<Button
										variant="danger"
										size="sm"
										onClick={() => field.removeValue(index)}
									>
										<Trash2Icon size={14} />
										削除
									</Button>
								</div>
								<form.AppField name={`targetCards[${index}].name`}>
									{(field) => (
										<field.TextField
											label="カード名"
											placeholder="例: エースカード"
											className="px-2 py-1.5"
											labelClassName="text-xs"
										/>
									)}
								</form.AppField>
								<form.AppField name={`targetCards[${index}].K_in_deck`}>
									{(field) => (
										<field.InputNumber
											label="デッキ内の枚数 (K)"
											className="px-2 py-1.5"
											labelClassName="text-xs"
										/>
									)}
								</form.AppField>
								<form.AppField name={`targetCards[${index}].k_desired`}>
									{(field) => (
										<field.InputNumber
											label="引きたい枚数 (k)"
											className="px-2 py-1.5"
											labelClassName="text-xs"
										/>
									)}
								</form.AppField>
							</div>
						))}
						<form.Subscribe selector={(state) => state.values.deckSize}>
							{(deckSize) => {
								const isReachedMax = field.state.value.length >= deckSize;
								const handleClick = () =>
									field.pushValue({
										id: crypto.randomUUID(),
										name: "",
										K_in_deck: 1,
										k_desired: 1,
									});
								return (
									<Button
										variant="secondary"
										className="w-full"
										onClick={handleClick}
										disabled={isReachedMax}
									>
										<PlusCircleIcon size={18} />
										{isReachedMax ? "最大枚数に達しました" : "特定カードを追加"}
									</Button>
								);
							}}
						</form.Subscribe>
					</div>
				)}
			</form.AppField>
		);
	},
});

const ResultSubmitButton = withForm({
	defaultValues: {} as Input, // type only
	render: ({ form }) => {
		const [result, setResult] = useState<
			| (ReturnType<typeof logic.calc> & { targetCards: Output["targetCards"] })
			| null
		>(null);

		const handleCalculate = useCallback(() => {
			const deckSize = form.getFieldValue("deckSize");
			const initialHandSize = form.getFieldValue("initialHandSize");
			const isFirstPlayer = form.getFieldValue("isFirstPlayer");
			const targetCards = form.getFieldValue("targetCards");

			// Calculate the effective hand size
			const effectiveHandSize = initialHandSize + (isFirstPlayer ? 1 : 0);

			const result = logic.calc({
				deckSize,
				initialHandSize: effectiveHandSize,
				targetCards,
			});

			setResult({
				...result,
				targetCards,
			});
		}, [form]);

		return (
			<div className="mt-4">
				<Button
					size="lg"
					className="w-full hover:scale-105"
					onClick={(e) => {
						e.preventDefault();
						handleCalculate();
					}}
				>
					<CalculatorIcon size={16} />
					確率を計算
				</Button>
				{result ? (
					<div className="mt-4 p-4 bg-slate-800 rounded-md">
						{result.targetCards.map((card, index) => {
							const cardName = card.name || `${index + 1}枚目のカード`;
							return (
								<Text key={card.id} className="text-sm text-slate-300">
									{`${cardName}を${card.k_desired}枚以上: `}
								</Text>
							);
						})}
						<Text className="text-lg text-sky-300">{`目的のカードを引ける確率: ${(result.probAtLeast * 100).toFixed(2)}%`}</Text>
					</div>
				) : null}
			</div>
		);
	},
});

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
