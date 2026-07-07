"use client";
import { PageTitle } from "@/src/components/ui/PageTitle";
import { ButtonGroupInput } from "@/src/components/ui/ButtonGroupInput";
import { useState } from "react";

export function PageHeader() {
  const [inputNumber, setInputNumber] = useState("0");
  return (
    <div className="sticky top-0 z-50 rounded-b-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-4 pb-3 shadow-lg ring-1 ring-black/10 sm:px-8">
      <PageTitle title="ポケモン図鑑" />
      <div className="flex flex-col items-end">
        <div className="shadow-md rounded-full">
          <ButtonGroupInput value={inputNumber} onChange={setInputNumber} />
        </div>
      </div>
    </div>
  );
}
