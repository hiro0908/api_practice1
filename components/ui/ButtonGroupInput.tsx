"use client"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch : (value:string) => void
}
export function ButtonGroupInput({value,onChange,onSearch}:Props) {
  return (
    <ButtonGroup>
      <Input 
        placeholder="図鑑番号を入力"
        value = {value}
        onChange={(e) => onChange(e.target.value)}
        />
      <Button 
        variant="outline" 
        aria-label="Search"
        onClick={()=>onSearch(value)}
      >
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
