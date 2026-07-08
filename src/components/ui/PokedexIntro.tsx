"use client";
import { useEffect, useState, useSyncExternalStore } from "react";

const INTRO_SESSION_KEY = "pokedexIntroShown";

function subscribe() {
  return () => {};
}

function getShouldSkipIntroSnapshot() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true"
  );
}

function getShouldSkipIntroServerSnapshot() {
  return false;
}

export function PokedexIntro() {
  const shouldSkipIntro = useSyncExternalStore(
    subscribe,
    getShouldSkipIntroSnapshot,
    getShouldSkipIntroServerSnapshot,
  );
  const [phase, setPhase] = useState<"opening" | "closing" | "done">("opening");

  useEffect(() => {
    if (shouldSkipIntro) return;
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    const closingTimer = setTimeout(() => setPhase("closing"), 900);
    const doneTimer = setTimeout(() => setPhase("done"), 900 + 700);
    return () => {
      clearTimeout(closingTimer);
      clearTimeout(doneTimer);
    };
  }, [shouldSkipIntro]);

  if (shouldSkipIntro || phase === "done") return null;

  const isClosing = phase === "closing";

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* 本体: 下にスライドして退場 */}
      <div
        className={`absolute inset-x-0 top-16 bottom-0 bg-gradient-to-b from-red-500 to-red-700 shadow-2xl transition-transform duration-700 ease-in-out sm:top-20 ${
          isClosing ? "translate-y-full" : "translate-y-0"
        }`}
      />
      {/* ヘッダー: 本体が下がりきるまでその場に残り、最後に消える */}
      <div
        className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-red-600 to-red-700 shadow-2xl transition-all delay-500 duration-500 ease-in-out sm:h-20 ${
          isClosing
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      />
      <div
        className={`absolute inset-x-0 top-16 bottom-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 sm:top-20 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative h-24 w-24 animate-bounce overflow-hidden rounded-full border-4 border-slate-900 bg-white shadow-xl">
          <div className="absolute top-0 left-0 h-1/2 w-full bg-red-500" />
          <div className="absolute bottom-0 left-0 h-1/2 w-full bg-white" />
          <div className="absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 bg-slate-900" />
          <div className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-900 bg-white">
            <div className="absolute inset-1 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="animate-pulse text-lg font-extrabold tracking-widest text-white drop-shadow-sm">
          ポケモン図鑑 起動中...
        </div>
      </div>
    </div>
  );
}
