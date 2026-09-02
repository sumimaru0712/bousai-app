"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { t } from "@/lib/copy";
import { getCheckCount, getPhotoProgress, isMarkResolved } from "@/lib/markStatus";
import { resizeImageToDataUrl } from "@/lib/resizeImage";
import { ROLE_LABEL, type DangerMark, type Role } from "@/lib/types";

function waitingRoleLabel(mark: DangerMark): string | null {
  const roles: Role[] = ["grandchild", "grandparent"];
  const waiting = roles.find((role) => !mark.checkedBy[role]);
  return waiting ? ROLE_LABEL[waiting] : null;
}

const CHECK_POINTS = [
  "家具が倒れてこないか（突っ張り棒・金具の固定）",
  "窓や食器棚のガラスが飛び散らないか（飛散防止フィルム）",
  "避難経路や出入口の前に物が置かれていないか",
  "背の高い家具の上に、落ちてきそうな物が置かれていないか",
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RoomCheckPage() {
  const { state, addRoomPhoto, addRoomComment, retryDiagnosis } = useAppState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {}
  );

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      addRoomPhoto(dataUrl);
    } catch {
      // Ignore unreadable files; the user can just retake the photo.
    }
  }

  function handleCommentSubmit(photoId: string) {
    const text = (commentDrafts[photoId] ?? "").trim();
    if (!text) return;
    addRoomComment(photoId, text);
    setCommentDrafts((prev) => ({ ...prev, [photoId]: "" }));
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h1 className="text-xl font-extrabold text-zinc-900">
          お部屋防災診断
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          お部屋の写真をとると、AIが危ないところをマークでおしえてくれます
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {CHECK_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-zinc-600">
              <span aria-hidden>✅</span>
              {point}
            </li>
          ))}
        </ul>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="absolute h-px w-px overflow-hidden whitespace-nowrap opacity-0"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 w-full rounded-full bg-orange-600 py-4 text-lg font-extrabold text-white shadow-md transition-colors hover:bg-orange-700"
        >
          📷 お部屋の写真をとる
        </button>
      </section>

      <section className="flex flex-col gap-4">
        {state.roomPhotos.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center text-sm text-zinc-500 shadow-sm ring-1 ring-orange-100">
            まだ写真がありません。上のボタンから撮ってみましょう。
          </p>
        )}

        {state.roomPhotos.map((photo) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100"
          >
            <div className="relative aspect-video w-full bg-zinc-100">
              <Image
                src={photo.dataUrl}
                alt="お部屋の写真"
                fill
                unoptimized
                className="object-contain"
              />

              {photo.diagnosisStatus === "done" &&
                photo.marks.map((mark, index) => {
                  const checkCount = getCheckCount(mark);
                  const markerStyle =
                    checkCount === 2
                      ? "bg-green-600 ring-green-200"
                      : checkCount === 1
                        ? "bg-amber-500 ring-amber-200"
                        : "bg-red-600 ring-red-200 animate-pulse";
                  const markerLabel =
                    checkCount === 2 ? "✓" : checkCount === 1 ? "◐" : index + 1;
                  return (
                    <Link
                      key={mark.id}
                      href={`/room-check/${photo.id}/${mark.id}`}
                      style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
                      className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-lg ring-4 ${markerStyle}`}
                      aria-label={`危険ポイント：${t(mark.title, state.currentRole)}`}
                    >
                      {markerLabel}
                    </Link>
                  );
                })}
            </div>

            {photo.diagnosisStatus === "analyzing" && (
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                <span className="animate-spin" aria-hidden>
                  🔄
                </span>
                AIが診断中です…
              </div>
            )}

            {photo.diagnosisStatus === "error" && (
              <div className="flex items-center justify-between gap-3 bg-red-50 px-4 py-3">
                <p className="text-sm font-bold text-red-700">
                  ⚠️ {photo.diagnosisError ?? "うまく診断できませんでした"}
                </p>
                <button
                  type="button"
                  onClick={() => retryDiagnosis(photo.id)}
                  className="min-h-[var(--tap-min)] shrink-0 rounded-full bg-red-600 px-4 text-xs font-extrabold text-white hover:bg-red-700"
                >
                  もう一度みてもらう
                </button>
              </div>
            )}

            {photo.diagnosisStatus === "done" && photo.marks.length === 0 && (
              <div className="bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                ✅ 危険は見つかりませんでした
              </div>
            )}

            {photo.diagnosisStatus === "done" && photo.marks.length > 0 && (
              <>
                <div className="flex items-center justify-between bg-orange-50/60 px-4 py-2">
                  <p className="text-xs font-bold text-orange-700">
                    対策 {getPhotoProgress(photo).done} / {getPhotoProgress(photo).total} か所
                  </p>
                </div>
                <div className="flex flex-col divide-y divide-orange-100 border-b border-orange-100">
                  {photo.marks.map((mark, index) => {
                    const checkCount = getCheckCount(mark);
                    const resolved = isMarkResolved(mark);
                    const waiting = waitingRoleLabel(mark);
                    const rowStatus = resolved
                      ? "二人で対策ずみ"
                      : checkCount === 1
                        ? `${waiting}のかくにん待ち`
                        : "まだ対策していません";
                    return (
                      <Link
                        key={mark.id}
                        href={`/room-check/${photo.id}/${mark.id}`}
                        className={`flex items-center gap-3 px-4 py-3 ${
                          resolved
                            ? "bg-green-50/60"
                            : checkCount === 1
                              ? "bg-amber-50/60"
                              : "bg-red-50/60"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${
                            resolved
                              ? "bg-green-600"
                              : checkCount === 1
                                ? "bg-amber-500"
                                : "bg-red-600"
                          }`}
                        >
                          {resolved ? "✓" : checkCount === 1 ? "◐" : index + 1}
                        </span>
                        <span className="flex-1">
                          <span
                            className={`block font-bold ${
                              resolved
                                ? "text-zinc-400 line-through"
                                : "text-zinc-900"
                            }`}
                          >
                            {t(mark.title, state.currentRole)}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {rowStatus}
                          </span>
                        </span>
                        <span className="text-zinc-400" aria-hidden>
                          ▶
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            <div className="p-4">
              <p className="text-xs font-bold text-orange-600">
                {ROLE_LABEL[photo.uploadedBy]}が投稿・{formatTime(photo.uploadedAt)}
              </p>

              <ul className="mt-3 flex flex-col gap-2">
                {photo.comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="rounded-2xl bg-orange-50 px-3 py-2 text-sm"
                  >
                    <span className="font-bold text-orange-700">
                      {ROLE_LABEL[comment.author]}：
                    </span>
                    <span className="text-zinc-700">{comment.text}</span>
                  </li>
                ))}
              </ul>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleCommentSubmit(photo.id);
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  type="text"
                  value={commentDrafts[photo.id] ?? ""}
                  onChange={(event) =>
                    setCommentDrafts((prev) => ({
                      ...prev,
                      [photo.id]: event.target.value,
                    }))
                  }
                  placeholder="気づいたことをコメント"
                  className="flex-1 rounded-full border border-orange-200 px-4 py-2 text-sm outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
                >
                  送信
                </button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
