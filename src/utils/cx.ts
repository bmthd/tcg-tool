import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges them with tailwind-merge.
 * @param args - Class names to combine.
 * @returns Merged class names.
 */
export const cx = (...inputs: (string | undefined | false | null)[]) => {
	return twMerge(clsx(...inputs));
};
