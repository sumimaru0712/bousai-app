"use client";

import { useRef, useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import {
  WEEKDAY_LABEL,
  WEEKDAY_ORDER,
  WEEKDAY_TOPIC,
  getTodayWeekday,
  type Weekday,
} from "@/lib/types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VoicePage() {
  const { state } = useAppState();
  const today = getTodayWeekday();

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h1 className="text-xl font-extrabold text-zinc-900">
          曜日ごとの孫からのボイス
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          曜日ごとに、孫からの声のメッセージがきけます
        </p>
      </section>

      <section className="rounded-3xl bg-orange-600 p-6 text-white shadow-sm">
        <p className="text-xs font-bold text-orange-100">
          きょう・{WEEKDAY_LABEL[today]}
        </p>
        <VoicePlayer
          weekday={today}
          highlighted
        />
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <h2 className="text-lg font-extrabold text-zinc-900">
          {state.currentRole === "grandchild"
            ? "曜日ごとにボイスを録音する"
            : "曜日ごとのメッセージ一覧"}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {WEEKDAY_ORDER.map((weekday) => (
            <li
              key={weekday}
              className="rounded-2xl border border-orange-100 p-4"
            >
              <p className="text-sm font-extrabold text-zinc-900">
                {WEEKDAY_LABEL[weekday]}
                {weekday === today && (
                  <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                    きょう
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                話題のヒント：{WEEKDAY_TOPIC[weekday]}
              </p>
              <div className="mt-3">
                {state.currentRole === "grandchild" ? (
                  <VoiceRecorder weekday={weekday} />
                ) : (
                  <VoicePlayer weekday={weekday} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function VoicePlayer({
  weekday,
  highlighted,
}: {
  weekday: Weekday;
  highlighted?: boolean;
}) {
  const { state } = useAppState();
  const message = state.voice.messages[weekday];

  if (!message) {
    return (
      <p
        className={`text-sm ${
          highlighted ? "text-orange-100" : "text-zinc-500"
        }`}
      >
        まだメッセージが録音されていません
      </p>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <audio controls src={message.dataUrl} className="w-full" />
      <p
        className={`text-xs ${
          highlighted ? "text-orange-100" : "text-zinc-400"
        }`}
      >
        {formatTime(message.recordedAt)}に録音
      </p>
    </div>
  );
}

function VoiceRecorder({ weekday }: { weekday: Weekday }) {
  const { state, recordVoiceMessage, deleteVoiceMessage } = useAppState();
  const message = state.voice.messages[weekday];
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            recordVoiceMessage(weekday, reader.result);
          }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("マイクを使えませんでした。マイクの許可を確認してください。");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {message && (
        <div className="flex flex-col gap-2">
          <audio controls src={message.dataUrl} className="w-full" />
          <p className="text-xs text-zinc-400">
            {formatTime(message.recordedAt)}に録音
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`flex-1 rounded-full py-3 text-sm font-extrabold text-white shadow-md transition-colors ${
            recording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {recording ? "⏹ 録音をやめる" : message ? "🎙️ 録音しなおす" : "🎙️ 録音する"}
        </button>
        {message && !recording && (
          <button
            type="button"
            onClick={() => deleteVoiceMessage(weekday)}
            className="rounded-full border border-orange-200 px-4 text-sm font-bold text-orange-600 hover:bg-orange-50"
          >
            削除
          </button>
        )}
      </div>

      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}
