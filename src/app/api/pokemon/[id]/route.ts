import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await prisma.pokemon.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      stats: true,
    },
  });

  return NextResponse.json(result);
}
