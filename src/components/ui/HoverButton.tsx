import React, { useState } from "react";

export const HoverButton = (text: string) => {
  // ホバー状態を管理するフック
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // ホバー時のスタイル
  const style: React.CSSProperties = {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease", // 滑らかに変化させる
    backgroundColor: isHovered ? "#3b82f6" : "#e5e7eb",
    color: isHovered ? "#ffffff" : "#1f2937",
    border: "none",
  };

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      {text}
    </button>
  );
};
