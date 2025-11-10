import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { i18nMiddleware } from "@/middlewares/i18n";
// import { deviceCheckMiddleware } from '@/middlewares/device-check'

// 顺序处理, 熔断模式
const middlewares: App.Middleware[] = [
  // deviceCheckMiddleware,
  i18nMiddleware,
];

export function middleware(request: NextRequest) {
  for (const mw of middlewares) {
    const response = mw(request);
    if (response) return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|cdn|static|.*\\..*|_next).*)",
};
