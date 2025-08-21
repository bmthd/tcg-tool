import {
	count,
	createCollection,
	createLiveQueryCollection,
	eq,
	localStorageCollectionOptions,
} from "@tanstack/react-db";
import { type DrawCalcData, drawCalcSchema } from "./db-schema";

// TanStack DB Collection設定
export const drawCalcCollection = createCollection(
	localStorageCollectionOptions({
		storageKey: "tcg-tool-draw-calculations",
		id: "draw-calculations",
		getKey: (item) => item.id,
		schema: drawCalcSchema,
	}),
);

// 全履歴を更新日時降順で取得するクエリコレクション
export const drawCalcHistoryCollection = createLiveQueryCollection((q) =>
	q
		.from({ calculations: drawCalcCollection })
		.orderBy(({ calculations }) => calculations.updatedAt, "desc"),
);

// ゲーム種別でフィルタした履歴を取得するクエリコレクション作成関数
export const createDrawCalcByGameCollection = (gameTemplate: string) =>
	createLiveQueryCollection((q) =>
		q
			.from({ calculations: drawCalcCollection })
			.where(({ calculations }) => eq(calculations.gameTemplate, gameTemplate))
			.orderBy(({ calculations }) => calculations.updatedAt, "desc"),
	);

// 最近の計算を取得するクエリコレクション（上位3件）
export const recentDrawCalcCollection = createLiveQueryCollection((q) =>
	q
		.from({ calculations: drawCalcCollection })
		.orderBy(({ calculations }) => calculations.updatedAt, "desc")
		.limit(3),
);

// 総計算回数を取得するクエリコレクション
export const drawCalcTotalCountCollection = createLiveQueryCollection((q) =>
	q.from({ calculations: drawCalcCollection }).select(() => ({
		totalCount: count("*"),
	})),
);

// ゲーム別計算回数を取得するクエリコレクション
export const drawCalcGameCountCollection = createLiveQueryCollection((q) =>
	q
		.from({ calculations: drawCalcCollection })
		.groupBy(({ calculations }) => calculations.gameTemplate)
		.select(({ calculations }) => ({
			gameTemplate: calculations.gameTemplate,
			count: count(calculations.id),
		})),
);

// 最新計算を取得するクエリコレクション（1件のみ）
export const drawCalcLatestCollection = createLiveQueryCollection((q) =>
	q
		.from({ calculations: drawCalcCollection })
		.orderBy(({ calculations }) => calculations.updatedAt, "desc")
		.limit(1)
		.select(({ calculations }) => ({
			updatedAt: calculations.updatedAt,
		})),
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
