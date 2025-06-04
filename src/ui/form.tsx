import { cx } from "@/utils/cx";
import type { ChangeEvent } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "active";
	size?: "sm" | "md" | "lg";
	ref?: React.Ref<HTMLButtonElement>; // React 19: ref is a normal prop
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

interface InputNumberProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "onChange"
	> {
	label?: string;
	id?: string;
	value: number | null;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	labelClassName?: string;
}

export const InputNumber: React.FC<InputNumberProps> = ({
	label,
	id,
	value,
	onChange,
	min,
	max,
	className,
	labelClassName,
	...props
}) => (
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
			id={id}
			value={value === null || Number.isNaN(value) ? "" : value}
			onChange={onChange}
			min={min}
			max={max}
			className={cx(
				"block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm transition duration-150",
				className,
			)}
			{...props}
		/>
	</div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	id?: string;
	labelClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
	label,
	id,
	value,
	onChange,
	children,
	className,
	labelClassName,
	...props
}) => (
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
			value={value}
			onChange={onChange}
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