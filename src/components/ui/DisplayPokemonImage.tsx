"use client";
import { useState } from "react";
import Image from "next/image";
type Props = {
  data: {
    name: string;
    imageUrl: string | null;
    difImageUrl?: string | null;
  };
  form: string;
};
export function DisplayPokemonImage({ data, form }: Props) {
  const [erroredImageSrc, setErroredImageSrc] = useState<string | null>(null);
  const currentImageSrc = form === "Normal" ? data.imageUrl : data.difImageUrl;
  return currentImageSrc && currentImageSrc !== erroredImageSrc ? (
    <>
      <Image
        src={currentImageSrc}
        alt={data.name}
        width={220}
        height={220}
        className="drop-shadow-lg"
        onError={() => setErroredImageSrc(currentImageSrc)}
      />
    </>
  ) : (
    <div className="flex h-[220px] w-[220px] items-center justify-center text-sm text-muted-foreground">
      no image
    </div>
  );
}
