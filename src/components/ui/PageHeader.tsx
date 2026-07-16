"use client";
import { PageTitle } from "@/src/components/ui/PageTitle";
import { ButtonGroupInput } from "@/src/components/ui/ButtonGroupInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";

export function PageHeader() {
  const [inputNumber, setInputNumber] = useState("0");
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 rounded-b-2xl bg-gradient-to-r from-red-500 via-red-400 to-red-600 px-4 pb-3 shadow-lg ring-1 ring-black/10 sm:px-8 dark:bg-none dark:bg-card dark:ring-border">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="w-full cursor-pointer transition-opacity hover:opacity-80"
      >
        <PageTitle title="ポケモン図鑑" />
      </button>
      <div className="flex flex-row items-end  gap-7 justify-end">
        <div className="shadow-md rounded-full">
          <ButtonGroupInput value={inputNumber} onChange={setInputNumber} />
        </div>
        <Link
          href="/settings"
          className="rounded-full bg-white p-2 shadow-md transition-opacity hover:opacity-80 dark:bg-muted"
        >
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
}
