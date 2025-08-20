import { DrawCalcDBPage } from "@/views/draw-calc-db";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/draw-calc-db")({
	component: DrawCalcDBPage,
});
