import type { AppState } from "./types";

export const STORAGE_KEY = "bousai-app-state";

export function createDefaultState(): AppState {
  return {
    currentRole: "grandchild",
    anpi: {
      grandchild: { status: "unknown", updatedAt: null },
      grandparent: { status: "unknown", updatedAt: null },
    },
    checklist: [
      { id: "water", label: "飲料水（3日分）", checked: false, addedBy: "grandchild" },
      { id: "food", label: "食料（3日分）", checked: false, addedBy: "grandchild" },
      { id: "flashlight", label: "懐中電灯", checked: false, addedBy: "grandchild" },
      { id: "radio", label: "携帯ラジオ", checked: false, addedBy: "grandchild" },
      { id: "firstaid", label: "救急セット", checked: false, addedBy: "grandchild" },
      { id: "medicine", label: "常備薬・お薬手帳", checked: false, addedBy: "grandparent" },
      { id: "battery", label: "モバイルバッテリー・乾電池", checked: false, addedBy: "grandchild" },
      { id: "cash", label: "現金（小銭も）", checked: false, addedBy: "grandparent" },
    ],
    roomPhotos: [],
  };
}
