import { DrawCalcPage } from "@/views/draw-calc/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: DrawCalcPage,
});
