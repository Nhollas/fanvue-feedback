import isEqual from "lodash.isequal";
import type { HttpResponseResolver } from "msw";
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const browserWorker = setupWorker(...handlers);

/**
 * Higher-order resolver: only fires when the request JSON body
 * deeply equals `expected`.
 */
export function withJsonBody(
  expected: Record<string, unknown>,
  resolver: HttpResponseResolver,
): HttpResponseResolver {
  return async (args) => {
    const actual = (await args.request.clone().json()) as Record<
      string,
      unknown
    >;
    if (!isEqual(actual, expected)) return;
    return resolver(args);
  };
}
