import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";

// import TanStackQueryLayout from './src/integrations/tanstack-query/layout.tsx'

import { useEventListener } from "@/hooks/event-listener";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => {
		useViewport();
		return (
			<>
				<Header />

				<Outlet />
				<TanStackRouterDevtools />

				{/* <TanStackQueryLayout /> */}
			</>
		);
	},
});

/**
 * 画面幅が360px以下の場合にviewportをwidth=360に設定する
 */
const useViewport = () => {
	useEventListener("resize", switchViewport);
};

const switchViewport = () => {
	const viewport = document.querySelector('meta[name="viewport"]');
	if (!viewport) return;
	const value =
		window.outerWidth > 360
			? "width=device-width,initial-scale=1"
			: "width=360";
	if (viewport.getAttribute("content") !== value)
		viewport.setAttribute("content", value);
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
};


