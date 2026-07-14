import { createDefaultState, STORAGE_KEY } from "./defaultState";
import { createId } from "./id";
import { generateDiagnosis } from "./roomDiagnosis";
import type { AppState, Role, RoomComment } from "./types";

type Listener = () => void;

const DIAGNOSIS_DELAY_MS = 1400;

let state: AppState = createDefaultState();
let initialized = false;
const listeners = new Set<Listener>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...createDefaultState(), ...(JSON.parse(raw) as AppState) };
    }
  } catch {
    state = createDefaultState();
  }
}

function update(next: AppState) {
  state = next;
  persist();
  listeners.forEach((listener) => listener());
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
    update({
      ...state,
      anpi: {
        ...state.anpi,
        [role]: { status: "safe", updatedAt: new Date().toISOString() },
      },
    });
  },

  toggleChecklistItem(id: string) {
    update({
      ...state,
      checklist: state.checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    });
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
    update({
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
    });

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

  resetState() {
    update(createDefaultState());
  },
};
