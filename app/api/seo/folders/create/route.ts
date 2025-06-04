import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.redirect("/login");
  const form = await req.formData();
  const name = form.get("name")?.toString().trim();
  if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  const folder = await prisma.scanFolder.create({
    data: {
      name,
      userId: session.user.id,
    },
  });
  const origin = req.headers.get("origin") || "http://localhost:3000";
  return NextResponse.redirect(`${origin}/scans/folders`);
}
