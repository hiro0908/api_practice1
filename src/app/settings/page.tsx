"use client";
import { useState } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { ToggleSwitch } from "@/src/components/ui/ToggleSwitch";
export default function TestJotaiLibrary() {
  const [darkMode, setDarkMode] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  return (
    <div>
      <PageHeader />
      <div>
        <div>設定</div>
        <div>
          <div className="flex items-center gap-3">
            ダークモード設定
            <ToggleSwitch
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
            />
          </div>

          <div className="flex items-center gap-3">
            カメラ許可設定
            <ToggleSwitch
              checked={cameraAccess}
              onChange={() => setCameraAccess((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
