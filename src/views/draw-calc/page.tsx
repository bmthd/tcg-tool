import { Button } from "@/ui/form";
import { Section } from "@/ui/layout";
import { Tooltip } from "@/ui/overlay";
import { Heading, Text } from "@/ui/typography";
import {
	PlusCircleIcon,
	Trash2Icon,
	UserCheckIcon,
	UserIcon,
} from "lucide-react";
import * as v from "valibot";
import { MAX_CARD_GROUPS, gameTemplateKeys, gameTemplates } from "./const";
import { useAppForm, withForm } from "./draw-calc.form";

v.setSpecificMessage(
	v.minLength,
	({ input }) => `${input.length}以上で入力してください。`,
);

const schema = v.pipe(
	v.object({
		deckSize: v.number(),
		initialHandSize: v.number(),
		gameTemplate: v.picklist(gameTemplateKeys),
		isFirstPlayer: v.boolean(),
		targetCards: v.pipe(
			v.array(
				v.object({
					id: v.number(),
					name: v.string(),
					K_in_deck: v.number(),
					k_desired: v.number(),
				}),
			),
			v.minLength(0),
		),
	}),
	v.forward(
		v.partialCheck(
			[["deckSize"], ["targetCards"]],
			({ deckSize, targetCards }) => !(targetCards.length > deckSize),
			"デッキの枚数以上にすることはできません。",
		),
		["targetCards"],
	),
);

export function DrawCalcPage() {
	const gameTemplate = "custom" as const;
	const { deckSize, baseInitialHandSize: initialHandSize } =
		gameTemplates[gameTemplate];
	const defaultValues = v.parse(schema, {
		deckSize,
		initialHandSize,
		gameTemplate,
		isFirstPlayer: true,
		targetCards: [{ id: 1, name: "", K_in_deck: 4, k_desired: 1 }],
	});
	const form = useAppForm({
		validators: { onChange: schema },
		defaultValues,
	});
	const actualDrawCount = 5; // Placeholder for actual calculation logic
	return (
		<form className="grid gap-4">
			<form.AppField name="gameTemplate">
				{(field) => (
					<field.Select
						label={
							<form.Subscribe selector={(state) => state.values.gameTemplate}>
								{(value) => (
									<p>
										ゲームテンプレート
										<Tooltip content={gameTemplates[value].description} />
									</p>
								)}
							</form.Subscribe>
						}
					>
						{Object.entries(gameTemplates).map(([key, template]) => (
							<option key={key} value={key}>
								{template.name}
							</option>
						))}
					</field.Select>
				)}
			</form.AppField>

			<form.AppField name="deckSize">
				{(field) => <field.InputNumber label="デッキの総枚数 (N)" />}
			</form.AppField>
			<form.AppField name="initialHandSize">
				{(field) => <field.InputNumber label="基本初期手札枚数" />}
			</form.AppField>

			<form.AppField name="isFirstPlayer">
				{(field) => (
					<>
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
											field.state.value === isFirstPlayer
												? "active"
												: "secondary"
										}
										onClick={() => field.setValue(isFirstPlayer)}
									>
										<Icon size={18} />
										{label}
									</Button>
								);
							}}
						/>
						<Text className="text-lg text-slate-400 mt-1">
							計算上の初期手札 (n):{" "}
							<span className="font-semibold text-sky-300">
								{actualDrawCount}
							</span>
							枚
						</Text>
					</>
				)}
			</form.AppField>

			<div>
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
				<label className="block text-sm font-medium text-slate-400">
					特定カード情報 (最大 {MAX_CARD_GROUPS}種類)
				</label>
				<TargetCardFields form={form} />
			</div>

			<form.SubmitButton />
			<FormulaDisplay />
		</form>
	);
}



const TargetCardFields = withForm({
  defaultValues: {} as v.InferOutput<typeof schema>,
  render: ({form}) => {
    return (
      <form.AppField name="targetCards" mode="array">
					{(field) => {
						const isReachedMax = field.state.value.length >= MAX_CARD_GROUPS;
						return (
							<>
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
								<Button
									variant="secondary"
									className="w-full"
									onClick={() =>
										field.pushValue({
											id: Date.now(),
											name: "",
											K_in_deck: 1,
											k_desired: 1,
										})
									}
									disabled={isReachedMax}
								>
									<PlusCircleIcon size={18} />
									特定カードを追加
								</Button>
							</>
						);
					}}
				</form.AppField>
    )
  }
})

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