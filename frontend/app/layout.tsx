import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { UserProfile } from "@/components";
import { StoreProvider, StoreSetupProvider } from "@/redux";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[375px]`}
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
