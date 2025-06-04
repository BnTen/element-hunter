import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { url, ...data } = body;

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Créer le scan avec toutes les données dans un seul champ JSON
    const scan = await prisma.seoScan.create({
      data: {
        url,
        data, // Stocker toutes les données dans le champ JSON
        userId: user.id,
      },
    });

    return NextResponse.json(scan);
  } catch (error) {
    console.error("[SEO_SCAN_POST]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const scans = await prisma.seoScan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(scans);
  } catch (error) {
    console.error("[SEO_SCAN_GET]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
