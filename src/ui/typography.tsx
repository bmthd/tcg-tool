import { cx } from "@/utils/cx";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const Text: React.FC<TextProps> = ({ className, ...props }) => (
	<p
		className={cx("text-slate-300 text-sm leading-relaxed", className)}
		{...props}
	/>
);

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}
export const Heading: React.FC<HeadingProps> = ({
	className,
	level = 2,
	...props
}) => {
	const Tag = `h${level}` as React.ElementType;
	return (
		<Tag
			className={cx(
				"font-semibold text-sky-400 mb-2",
				level === 1 ? "text-3xl" : level === 2 ? "text-xl" : "text-lg",
				className,
			)}
			{...props}
		/>
	);
};
