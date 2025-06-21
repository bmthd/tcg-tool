
import { cx } from "@/utils/cx";
import { useFieldContext } from "@/views/draw-calc/draw-calc.form-context";
import type { FieldApi } from "@tanstack/react-form";
import type React from "react";
import { type ReactNode, useId } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "active";
	size?: "sm" | "md" | "lg";
	ref?: React.Ref<HTMLButtonElement>; 
}

export const Button: React.FC<ButtonProps> = ({
	className,
	variant = "primary",
	size = "md",
	children,
	...props
}) => {
	const baseStyle =
		"inline-flex items-center justify-center gap-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 transform disabled:opacity-50 disabled:cursor-not-allowed";
	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		secondary:
			"bg-slate-600 text-slate-100 hover:bg-slate-500 focus:ring-slate-400",
		danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
		active: "bg-blue-700 text-white ring-2 ring-blue-400 shadow-lg",
	};
	const sizeStyles = {
		sm: "px-3 py-1.5 text-xs",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base font-semibold",
	};

	return (
		<button
			type="button"
			className={cx(
				baseStyle,
				variantStyles[variant],
				sizeStyles[size],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export const TextField: React.FC<
	React.InputHTMLAttributes<HTMLInputElement> & {
		label?: ReactNode;
		labelClassName?: string;
	}
> = ({ label, labelClassName, className, ...props }) => {
	const id = useId();
	const field = useFieldContext<string>();
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className={cx(
						"block text-sm font-medium text-slate-400 mb-1",
						labelClassName,
					)}
				>
					{label}
				</label>
			)}
			<input
				id={id}
				{...getFieldProps(field)}
				className={cx(
					"block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm transition duration-150",
					className,
				)}
				{...props}
			/>
		</div>
	);
};

interface InputNumberProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
	label?: ReactNode;
	labelClassName?: string;
}

export const InputNumber: React.FC<InputNumberProps> = ({
	label,
	className,
	labelClassName,
	...props
}) => {
	const id = useId();
	const field = useFieldContext<number>();
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className={cx(
						"block text-sm font-medium text-slate-400 mb-1",
						labelClassName,
					)}
				>
					{label}
				</label>
			)}
			<input
				type="number"
				inputMode="numeric"
				id={id}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.valueAsNumber)}
				className={cx(
					"block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm transition duration-150",
					className,
				)}
				{...props}
			/>
		</div>
	);
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: ReactNode;
	labelClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
	label,
	children,
	className,
	labelClassName,
	...props
}) => {
	const id = useId();
	const field = useFieldContext<string>();
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className={cx(
						"block text-sm font-medium text-slate-400 mb-1",
						labelClassName,
					)}
				>
					{label}
				</label>
			)}
			<select
				id={id}
				name={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				className={cx(
					"block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm transition duration-150",
					className,
				)}
				{...props}
			>
				{children}
			</select>
		</div>
	);
};

export interface RadioGroupProps {
	items?: { label: string; value: string }[];
	renderItem?: (item: { label: string; value: string }) => React.ReactNode;
	label?: ReactNode;
	labelClassName?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
	items = [],
	renderItem,
	label,
	labelClassName,
}) => {
	const id = useId();
	const field = useFieldContext<string>();
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className={cx(
						"block text-sm font-medium text-slate-400 mb-1",
						labelClassName,
					)}
				>
					{label}
				</label>
			)}
			<fieldset
				className="flex gap-2 justify-center"
				role="radiogroup"
				aria-labelledby={id}
			>
				{items.map((item) => (
					<label
						key={item.value}
						htmlFor={`${id}-${item.value}`}
						className="flex items-center w-full"
					>
						<input
							type="radio"
							id={`${id}-${item.value}`}
							name={id}
							value={item.value}
							checked={field.state.value === item.value}
							onChange={() => field.handleChange(item.value)}
							className={cx(
								"h-4 w-4 text-sky-500 border-slate-600 focus:ring-sky-500",
								renderItem ? "hidden" : "block",
							)}
						/>
						{renderItem ? (
							renderItem(item)
						) : (
							<span className="ml-2 text-sm text-slate-300">{item.label}</span>
						)}
					</label>
				))}
			</fieldset>
		</div>
	);
};

const getFieldProps = (
	field: FieldApi<
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any, // biome-ignore lint/suspicious/noExplicitAny: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any, // biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		any
	>,
): React.InputHTMLAttributes<HTMLInputElement> => {
	return {
		name: field.name,
		value: field.state.value,
		onChange: (e) => field.handleChange(e.target.value),
		onBlur: field.handleBlur,
		"aria-invalid":
			field.state.meta.isTouched && field.state.meta.errors.length > 0,
	};
};
