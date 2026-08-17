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
    reportHealth: store.reportHealth,
    setGrowthEnabled: store.setGrowthEnabled,
    setGrowthSpecies: store.setGrowthSpecies,
    setMinigamesEnabled: store.setMinigamesEnabled,
    awardPoints: store.awardPoints,
    addActivity: store.addActivity,
    recordVoiceMessage: store.recordVoiceMessage,
    deleteVoiceMessage: store.deleteVoiceMessage,
    resetState: store.resetState,
  };
}
