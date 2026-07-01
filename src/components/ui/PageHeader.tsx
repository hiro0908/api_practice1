"use client";
import {PageTitle} from "@/src/components/ui/PageTitle";
import { ButtonGroupInput } from "@/src/components/ui/ButtonGroupInput";
import {useState} from "react";

export function PageHeader(){
    const [inputNumber, setInputNumber] = useState("0");
    return (
    <>
        <PageTitle title="ポケモン図鑑"/>
        <div className="flex flex-col items-end">
          <ButtonGroupInput value={inputNumber} onChange={setInputNumber} />
        </div>
    </>     
    );
} 