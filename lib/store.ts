import { createDefaultState, STORAGE_KEY } from "./defaultState";
import { createId } from "./id";
import { generateDiagnosis } from "./roomDiagnosis";
import type { GrowthSpecies } from "./growth";
import { WEEKDAY_LABEL } from "./types";
import type {
  ActivityEntry,
  ActivityState,
  AppState,
  DangerMark,
  GrowthState,
  HealthStatus,
  MinigamesState,
  Role,
  RoomComment,
  RoomPhoto,
  VoiceState,
  Weekday,
} from "./types";

type Listener = () => void;

const DIAGNOSIS_DELAY_MS = 1400;

let state: AppState = createDefaultState();
let initialized = false;
const listeners = new Set<Listener>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitizeMark(mark: DangerMark): DangerMark {
  return {
    ...mark,
    detail: mark.detail ?? mark.description ?? "",
    fixes: mark.fixes ?? [],
    resolved: mark.resolved ?? false,
  };
}

function sanitizeRoomPhoto(photo: RoomPhoto): RoomPhoto {
  return {
    ...photo,
    comments: photo.comments ?? [],
    diagnosisStatus: photo.diagnosisStatus ?? "done",
    marks: (photo.marks ?? []).map(sanitizeMark),
  };
}

function sanitizeGrowth(growth: GrowthState): GrowthState {
  return {
    enabled: growth.enabled ?? true,
    species: growth.species ?? null,
    points: growth.points ?? 0,
  };
}

function sanitizeMinigames(minigames: MinigamesState): MinigamesState {
  return {
    enabled: minigames?.enabled ?? true,
  };
}

function sanitizeVoice(voice: VoiceState): VoiceState {
  return {
    messages: voice?.messages ?? {},
  };
}

function sanitizeActivity(activity: ActivityState): ActivityState {
  return {
    entries: activity?.entries ?? [],
  };
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const loaded = { ...createDefaultState(), ...(JSON.parse(raw) as AppState) };
      state = {
        ...loaded,
        roomPhotos: loaded.roomPhotos.map(sanitizeRoomPhoto),
        growth: sanitizeGrowth(loaded.growth),
        minigames: sanitizeMinigames(loaded.minigames),
        voice: sanitizeVoice(loaded.voice),
        activity: sanitizeActivity(loaded.activity),
      };
    }
  } catch {
    state = createDefaultState();
  }
}

function update(next: AppState) {
  state = next;
  try {
    persist();
  } catch {
    // Storage can fail (e.g. quota exceeded from large photos/audio) —
    // keep the in-memory state usable and still notify listeners.
  }
  listeners.forEach((listener) => listener());
}

function withPoints(next: AppState, delta: number): AppState {
  return {
    ...next,
    growth: {
      ...next.growth,
      points: Math.max(0, next.growth.points + delta),
    },
  };
}

const MAX_ACTIVITY_ENTRIES = 30;

function withActivity(
  next: AppState,
  message: string,
  actor: Role = next.currentRole
): AppState {
  const entry: ActivityEntry = {
    id: createId(),
    actor,
    message,
    createdAt: new Date().toISOString(),
  };
  return {
    ...next,
    activity: {
      entries: [entry, ...next.activity.entries].slice(0, MAX_ACTIVITY_ENTRIES),
    },
  };
}

export const store = {
  subscribe(listener: Listener) {
    ensureInitialized();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): AppState {
    ensureInitialized();
    return state;
  },

  getServerSnapshot(): AppState {
    return state;
  },

  setRole(role: Role) {
    update({ ...state, currentRole: role });
  },

  markSafe(role: Role) {
    update(
      withPoints(
        {
          ...state,
          anpi: {
            ...state.anpi,
            [role]: { status: "safe", updatedAt: new Date().toISOString() },
          },
        },
        2
      )
    );
  },

  toggleChecklistItem(id: string) {
    const item = state.checklist.find((entry) => entry.id === id);
    const willBeChecked = item ? !item.checked : false;
    const nextChecklist = state.checklist.map((entry) =>
      entry.id === id ? { ...entry, checked: !entry.checked } : entry
    );
    const wasComplete = state.checklist.every((entry) => entry.checked);
    const isComplete = nextChecklist.every((entry) => entry.checked);

    let next = withPoints(
      { ...state, checklist: nextChecklist },
      willBeChecked ? 5 : -5
    );
    if (!wasComplete && isComplete) {
      next = withActivity(next, "防災チェックリストをぜんぶクリアしたよ！");
    }
    update(next);
  },

  addChecklistItem(label: string) {
    update({
      ...state,
      checklist: [
        ...state.checklist,
        {
          id: createId(),
          label,
          checked: false,
          addedBy: state.currentRole,
        },
      ],
    });
  },

  addRoomPhoto(dataUrl: string) {
    const photoId = createId();
    update(
      withPoints(
        {
          ...state,
          roomPhotos: [
            {
              id: photoId,
              dataUrl,
              uploadedAt: new Date().toISOString(),
              uploadedBy: state.currentRole,
              comments: [],
              diagnosisStatus: "analyzing",
              marks: [],
            },
            ...state.roomPhotos,
          ],
        },
        3
      )
    );

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        update({
          ...state,
          roomPhotos: state.roomPhotos.map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  diagnosisStatus: "done",
                  marks: generateDiagnosis(),
                }
              : photo
          ),
        });
      }, DIAGNOSIS_DELAY_MS);
    }
  },

  addRoomComment(photoId: string, text: string) {
    update({
      ...state,
      roomPhotos: state.roomPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              comments: [
                ...photo.comments,
                {
                  id: createId(),
                  author: state.currentRole,
                  text,
                  createdAt: new Date().toISOString(),
                } satisfies RoomComment,
              ],
            }
          : photo
      ),
    });
  },

  toggleMarkResolved(photoId: string, markId: string) {
    const photo = state.roomPhotos.find((entry) => entry.id === photoId);
    const mark = photo?.marks.find((entry) => entry.id === markId);
    const willResolve = mark ? !mark.resolved : false;
    let next = withPoints(
      {
        ...state,
        roomPhotos: state.roomPhotos.map((entry) =>
          entry.id === photoId
            ? {
                ...entry,
                marks: entry.marks.map((mark) =>
                  mark.id === markId
                    ? { ...mark, resolved: !mark.resolved }
                    : mark
                ),
              }
            : entry
        ),
      },
      willResolve ? 8 : -8
    );
    if (willResolve && mark) {
      next = withActivity(next, `お部屋の危険「${mark.title}」をなおしたよ！`);
    }
    update(next);
  },

  setGrowthEnabled(enabled: boolean) {
    update({
      ...state,
      growth: { ...state.growth, enabled },
    });
  },

  setGrowthSpecies(species: GrowthSpecies) {
    update({
      ...state,
      growth: { ...state.growth, species },
    });
  },

  setMinigamesEnabled(enabled: boolean) {
    update({
      ...state,
      minigames: { ...state.minigames, enabled },
    });
  },

  awardPoints(delta: number) {
    update(withPoints(state, delta));
  },

  addActivity(message: string) {
    update(withActivity(state, message));
  },

  reportHealth(status: HealthStatus) {
    const log = {
      id: createId(),
      status,
      createdAt: new Date().toISOString(),
    };
    update(
      withPoints(
        {
          ...state,
          health: {
            latest: log,
            history: [log, ...state.health.history],
          },
        },
        2
      )
    );
  },

  recordVoiceMessage(weekday: Weekday, dataUrl: string) {
    update(
      withActivity(
        {
          ...state,
          voice: {
            messages: {
              ...state.voice.messages,
              [weekday]: { dataUrl, recordedAt: new Date().toISOString() },
            },
          },
        },
        `${WEEKDAY_LABEL[weekday]}のボイスメッセージをとどけたよ！`
      )
    );
  },

  deleteVoiceMessage(weekday: Weekday) {
    const nextMessages = { ...state.voice.messages };
    delete nextMessages[weekday];
    update({
      ...state,
      voice: { messages: nextMessages },
    });
  },

  resetState() {
    update(createDefaultState());
  },
};
