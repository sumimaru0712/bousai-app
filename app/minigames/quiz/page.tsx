"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { QUIZ_QUESTIONS } from "@/lib/minigames";

const POINTS_PER_CORRECT = 2;

export default function QuizGamePage() {
  const { state, awardPoints, addActivity } = useAppState();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!state.minigames.enabled) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
        <p className="text-zinc-600">ミニゲームはOFFになっています。</p>
        <Link href="/minigames" className="mt-4 inline-block font-bold text-orange-600">
          ← ミニゲームにもどる
        </Link>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[index];
  const isLast = index === QUIZ_QUESTIONS.length - 1;

  function handleChoice(choiceIndex: number) {
    if (selected !== null) return;
    setSelected(choiceIndex);
    const correct = choiceIndex === question.correctIndex;
    if (correct) setScore((s) => s + 1);
    if (isLast) {
      const finalScore = score + (correct ? 1 : 0);
      awardPoints(finalScore * POINTS_PER_CORRECT);
      addActivity(
        `防災クイズで${finalScore}/${QUIZ_QUESTIONS.length}問正解したよ！`
      );
    }
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function handleRestart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/minigames" className="text-sm font-bold text-orange-600">
          ← ミニゲームにもどる
        </Link>
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
          <h1 className="text-xl font-extrabold text-zinc-900">けっか発表！</h1>
          <p className="mt-4 text-5xl font-extrabold text-orange-600">
            {score} / {QUIZ_QUESTIONS.length}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            +{score * POINTS_PER_CORRECT}pt が育成キャラクターに入りました
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-6 w-full rounded-full bg-orange-600 py-4 text-lg font-extrabold text-white shadow-md transition-colors hover:bg-orange-700"
          >
            もう一度あそぶ
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/minigames" className="text-sm font-bold text-orange-600">
        ← ミニゲームにもどる
      </Link>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <p className="text-xs font-bold text-orange-600">
          もんだい {index + 1} / {QUIZ_QUESTIONS.length}
        </p>
        <h1 className="mt-2 text-lg font-extrabold text-zinc-900">
          {question.question}
        </h1>

        <div className="mt-5 flex flex-col gap-3">
          {question.choices.map((choice, choiceIndex) => {
            const answered = selected !== null;
            const isCorrect = choiceIndex === question.correctIndex;
            const isSelected = choiceIndex === selected;
            let style =
              "border-orange-100 text-zinc-700 hover:border-orange-300";
            if (answered && isCorrect) {
              style = "border-green-500 bg-green-50 text-green-700";
            } else if (answered && isSelected && !isCorrect) {
              style = "border-red-500 bg-red-50 text-red-700";
            }
            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleChoice(choiceIndex)}
                disabled={answered}
                className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-colors ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-2xl bg-orange-50 p-4">
            <p className="text-sm text-zinc-700">{question.explanation}</p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-4 w-full rounded-full bg-orange-600 py-3 text-base font-extrabold text-white shadow-md transition-colors hover:bg-orange-700"
            >
              {isLast ? "けっかを見る" : "つぎへ"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
