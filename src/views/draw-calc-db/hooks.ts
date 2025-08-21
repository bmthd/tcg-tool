import { drawCalcCollection } from "./collection";

/**
 * 計算データの削除
 */
export const useDeleteDrawCalc = () => {
	const deleteCalc = (id: string) => {
		try {
			drawCalcCollection.delete(id);
			return { success: true };
		} catch (error) {
			console.error("削除に失敗しました:", error);
			return { success: false, error };
		}
	};

	return { deleteCalc };
};
