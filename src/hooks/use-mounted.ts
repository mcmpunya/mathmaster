"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns `false` on the server and on the first client render, then
 * `true` after hydration completes. Use this to gate access to
 * persisted client-only state (localStorage, sessionStorage) so that
 * the first client render matches the server render — preventing
 * hydration mismatches.
 *
 * Uses `useSyncExternalStore` under the hood, which is the React 18
 * way to safely read client-only state without hydration errors.
 * The `getServerSnapshot` returns `false` during SSR AND the initial
 * client render, then React re-renders with `getSnapshot` (`true`)
 * after hydration.
 */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}
