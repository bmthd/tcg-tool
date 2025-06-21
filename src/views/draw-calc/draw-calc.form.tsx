import { Button, InputNumber, RadioGroup, Select, TextField } from "@/ui/form";
import { createFormHook } from "@tanstack/react-form";
import { CalculatorIcon } from "lucide-react";
import { fieldContext, formContext } from "./draw-calc.form-context";

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
		InputNumber,
		Select,
		RadioGroup,
	},
	formComponents: {
		SubmitButton: () => (
			<Button size="lg" className="w-full hover:scale-105">
				<CalculatorIcon size={20} />
				確率を計算
			</Button>
		),
	},
	fieldContext,
	formContext,
});
