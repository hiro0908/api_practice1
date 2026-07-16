"use client";
import { Button } from "@/src/components/ui/button";
import { ButtonGroup } from "@/src/components/ui/button-group";
import { Input } from "@/src/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  value: string;
  onChange: (value: string) => void;
};
export function ButtonGroupInput({ value, onChange }: Props) {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //全体画面のページリロードを防ぐ
    if (!value) return;
    router.push(`/pokemon/${value}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-full bg-card dark:bg-neutral-700 "
    >
      <ButtonGroup>
        <Input
          className="!rounded-l-full !rounded-r-none bg-card pl-4 dark:bg-neutral-700"
          placeholder="図鑑番号を入力"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          variant="outline"
          aria-label="Search"
          className="!rounded-l-none !rounded-r-full pr-4 cursor-pointer"
        >
          <SearchIcon />
        </Button>
      </ButtonGroup>
    </form>
  );
}
