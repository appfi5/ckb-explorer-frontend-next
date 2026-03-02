/// <reference types="react" />


declare module '*.svg' {
  const content: import('next/dist/shared/lib/image-external').StaticImageData
  export default content
}

declare module '*.svg?component' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

type NextRequest = import("next/server").NextRequest;
type NextResponse<Body = unknown> = import("next/server").NextResponse<Body>;

declare namespace App {
  type Middleware = (request: NextRequest) => NextResponse | void;

  declare type Language = "en" | "zh"; // "zh" |

  // Next.js 15 expects params to be Promise, with string values
  type Params = Promise<{
    locale: string; // Changed from Language to string to match Next.js types
  }>;

  type Entry<P = {}> = React.FC<
    React.PropsWithChildren<P & { params: Params }>
  >;

  declare type Page<P = {}> = Entry<P>;

  declare type Layout<P = {}> = Entry<P>;

  declare type LayoutWithParallel<R> = Layout<Record<R, React.ReactNode>>;
}
