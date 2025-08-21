# TCG Tool - 開発ドキュメント

## TanStack DBライブラリの使い方

このプロジェクトではTanStack DBを使用してlocalStorageでのデータ永続化を実装しています。

### 基本的な設定

#### 1. インストール
```bash
bun add @tanstack/react-db @tanstack/db
```

#### 2. コレクションの定義（collection.ts）
```typescript
import { createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import type { DrawCalcData } from "./db-schema";

export const drawCalcCollection = createCollection(
	localStorageCollectionOptions<DrawCalcData>({
		storageKey: "tcg-tool-draw-calculations", // localStorageのキー
		id: "draw-calculations", // コレクションID
		getKey: (item) => item.id, // 各アイテムの一意キーを取得
	}),
);
```

#### 3. データスキーマの定義（db-schema.ts）
```typescript
// 型定義
export interface DrawCalcData {
	id: string;
	deckSize: number;
	initialHandSize: number;
	gameTemplate: string;
	isFirstPlayer: boolean;
	targetCards: TargetCard[];
	result?: {
		probExactly: number;
		probAtLeast: number;
	};
	createdAt: string; // ISO string for localStorage compatibility
	updatedAt: string;
}

// ヘルパー関数
export const createDrawCalc = (
	data: Omit<DrawCalcData, "id" | "createdAt" | "updatedAt">
): DrawCalcData => ({
	...data,
	id: crypto.randomUUID(),
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
});
```

### データ操作

#### データの自動保存
```typescript
// 計算実行時に自動保存
const handleCalculate = () => {
	// 確率計算
	const calcResult = calc({...});
	setResult(calcResult);

	// 計算結果を自動保存
	try {
		const data = createDrawCalc({
			deckSize,
			initialHandSize,
			gameTemplate,
			isFirstPlayer,
			targetCards,
			result: calcResult,
		});

		drawCalcCollection.insert(data);
		console.log("計算結果を自動保存しました");
	} catch (error) {
		console.error("自動保存に失敗しました:", error);
	}
};
```

#### データの削除
```typescript
// IDでデータを削除
drawCalcCollection.delete(itemId);
```

#### ライブクエリでデータを取得
```typescript
import { useLiveQuery } from "@tanstack/react-db";

const MyComponent = () => {
	const { data: calculations } = useLiveQuery((q) =>
		q
			.from({ calc: drawCalcCollection })
			.select(({ calc }) => calc)
			.orderBy(({ calc }) => calc.updatedAt, "desc")
	);

	// calculationsがリアルタイムで更新される
	return <div>{/* データを表示 */}</div>;
};
```

### 特徴

1. **自動保存**: 計算実行時に結果が自動的にlocalStorageに保存される
2. **リアルタイム更新**: `useLiveQuery`でデータの変更をリアルタイムに監視
3. **型安全**: TypeScriptで型定義をすることで型安全な操作が可能
4. **保存ボタン不要**: ユーザーが明示的に保存操作をする必要がない
5. **タブ間同期**: Storage Eventを通じてタブ間でデータが同期される（設定による）

### 注意点

- `createdAt`や`updatedAt`はlocalStorageとの互換性のためISO string形式で保存
- TanStack DBはBETA版のため、APIが変更される可能性がある
- 複雑なクエリや更新はトランザクション機能を使用（現在の実装では単純操作のみ）

### 参考リンク
- [TanStack DB公式ドキュメント](https://tanstack.com/db/latest)
- [localStorage Collection Options](https://tanstack.com/db/latest/docs/reference/functions/localstoragecollectionoptions)

## 実装例

このプロジェクトでは以下のファイルでTanStack DBを使用しています：
- `src/views/draw-calc-db/collection.ts` - コレクション定義
- `src/views/draw-calc-db/db-schema.ts` - スキーマとヘルパー関数
- `src/views/draw-calc-db/form.tsx` - データ挿入の実装
- `src/views/draw-calc-db/history.tsx` - ライブクエリとデータ削除の実装

## 開発時のコマンド

```bash
# 開発サーバー起動
bun run dev

# コード品質チェック
bun run check:all

# フォーマット
bun run format

# 型チェック
bun run type:check
```