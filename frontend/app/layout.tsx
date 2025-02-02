import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { UserProfile } from "@/components";
import { StoreProvider, StoreSetupProvider } from "@/redux";

const geistSansFont = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMonoFont = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Graph App",
	description:
		"Make project section and manage impacts that makes your team and you.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${geistSansFont.variable} ${geistMonoFont.variable} antialiased min-w-[575px] overflow-y-auto`}
			>
				<StoreProvider>
					<StoreSetupProvider>
						<UserProfile />
						{children}
					</StoreSetupProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
