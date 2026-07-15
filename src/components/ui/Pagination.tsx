"use client";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const delta = 1;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);
  //ここでページの配列化！！
  const pages: (number | "ellipsis")[] = [1]; //ここは初期値だから最初のページとして1が置かれている。
  //下の処理では現在のページから両隣のページを取得し1ページ目と最後のページから離れている場合に...を追加する処理を行っている
  if (left > 2) {
    pages.push("ellipsis");
  }
  for (let page = left; page <= right; page++) {
    pages.push(page);
  }
  if (right < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages; //現在のページにおける表示するべき情報の配列を返している
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-1"
      aria-label="ページネーション"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(1)}
        aria-label="前のページ"
      >
        <ChevronsLeft />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="前のページ"
      >
        <ChevronLeft />
      </Button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-slate-400"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            type="button"
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="次のページ"
      >
        <ChevronRight />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(totalPages)}
        aria-label="最終ページ"
      >
        <ChevronsRight />
      </Button>
    </nav>
  );
}
