import { cx } from "@/utils/cx";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

export const Section: React.FC<SectionProps> = ({
	className,
	children,
	...props
}) => (
	<section
		className={cx(
			"bg-slate-800 p-4 rounded-lg border border-slate-700 mt-4",
			className,
		)}
		{...props}
	>
		{children}
	</section>
);
