import {
	createCollection,
	localStorageCollectionOptions,
} from "@tanstack/react-db";
import type { DrawCalcData } from "./db-schema";

// TanStack DB Collection設定
export const drawCalcCollection = createCollection(
	localStorageCollectionOptions<DrawCalcData>({
		storageKey: "tcg-tool-draw-calculations",
		id: "draw-calculations",
		getKey: (item) => item.id,
	}),
);

// データベース操作のヘルパー関数
export const createDrawCalc = (
	data: Omit<DrawCalcData, "id" | "createdAt" | "updatedAt">,
): DrawCalcData => ({
	...data,
	id: crypto.randomUUID(),
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
});

export const updateDrawCalc = (
	existing: DrawCalcData,
	updates: Partial<DrawCalcData>,
): DrawCalcData => ({
	...existing,
	...updates,
	updatedAt: new Date().toISOString(),
});
