import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await prisma.pokemon.findMany({
    include: {
      stats: true,
    },
  });

  return NextResponse.json(result);
}
