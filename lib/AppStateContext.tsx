"use client";

import { useSyncExternalStore } from "react";
import { store } from "./store";

export function useAppState() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  return {
    state,
    setRole: store.setRole,
    markSafe: store.markSafe,
    toggleChecklistItem: store.toggleChecklistItem,
    addChecklistItem: store.addChecklistItem,
    addRoomPhoto: store.addRoomPhoto,
    addRoomComment: store.addRoomComment,
    toggleMarkResolved: store.toggleMarkResolved,
    resetState: store.resetState,
  };
}
