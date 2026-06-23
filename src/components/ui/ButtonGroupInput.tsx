"use client";
import { Button } from "@/src/components/ui/button";
import { ButtonGroup } from "@/src/components/ui/button-group";
import { Input } from "@/src/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
};
export function ButtonGroupInput({ value, onChange, onSearch }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //全体画面のページリロードを防ぐ
    onSearch(value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <ButtonGroup>
        <Input
          placeholder="図鑑番号を入力"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          variant="outline"
          aria-label="Search"
        >
          <SearchIcon />
        </Button>
      </ButtonGroup>
    </form>
  );
}
