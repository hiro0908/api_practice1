"use client";
import {useAtom} from "jotai";
import { useEffect } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { ToggleSwitch } from "@/src/components/ui/ToggleSwitch";
import {darkModeAtom,cameraAccessAtom} from "@/src/state/settingsAtom";
export default function TestJotaiLibrary() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [cameraAccess, setCameraAccess] = useAtom(cameraAccessAtom);
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
