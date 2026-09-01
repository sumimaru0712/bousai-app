import type { DangerMark, RoomPhoto } from "./types";

export function isMarkResolved(mark: DangerMark): boolean {
  return mark.checkedBy.grandchild && mark.checkedBy.grandparent;
}

export function getCheckCount(mark: DangerMark): 0 | 1 | 2 {
  const count = Number(mark.checkedBy.grandchild) + Number(mark.checkedBy.grandparent);
  return count as 0 | 1 | 2;
}

export function getPhotoProgress(photo: RoomPhoto): {
  done: number;
  total: number;
} {
  return {
    done: photo.marks.filter(isMarkResolved).length,
    total: photo.marks.length,
  };
}
