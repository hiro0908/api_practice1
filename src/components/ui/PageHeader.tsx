"use client";
import { PageTitle } from "@/src/components/ui/PageTitle";
import { ButtonGroupInput } from "@/src/components/ui/ButtonGroupInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PageHeader() {
  const [inputNumber, setInputNumber] = useState("0");
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 rounded-b-2xl bg-gradient-to-r from-red-500 via-red-400 to-red-600 px-4 pb-3 shadow-lg ring-1 ring-black/10 sm:px-8">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="w-full cursor-pointer transition-opacity hover:opacity-80"
      >
        <PageTitle title="ポケモン図鑑" />
      </button>
      <div className="flex flex-col items-end">
        <div className="shadow-md rounded-full">
          <ButtonGroupInput value={inputNumber} onChange={setInputNumber} />
        </div>
      </div>
    </div>
  );
}
