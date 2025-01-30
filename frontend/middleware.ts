import * as cookie from "cookie";
import { NextRequest, NextResponse } from "next/server";

// Список защищённых маршрутов
const protectedRoutes = ["/dashboard", "/data"];

export function middleware(req: NextRequest) {
	const cookieHeader = req.headers.get("cookie");
	const cookies = cookieHeader ? cookie.parse(cookieHeader) : {};

	if (
		protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route)) &&
		(!cookies.access_token || !cookies.refresh_token)
	) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}
