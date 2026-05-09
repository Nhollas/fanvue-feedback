import isEqual from "lodash.isequal";
import type { HttpResponseResolver } from "msw";
import { setupWorker } from "msw/browser";

export const browserWorker = setupWorker();

/**
 * Higher-order resolver: only fires when the request JSON body
 * deeply equals `expected`.
 */
export function withJsonBody(
  expected: Record<string, unknown>,
  resolver: HttpResponseResolver,
): HttpResponseResolver {
  return async (args) => {
    const actual = await args.request.clone().json();
    if (!isEqual(actual, expected)) return;
    return resolver(args);
  };
}
