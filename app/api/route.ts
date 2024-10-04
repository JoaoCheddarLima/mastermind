import { aiEmpowerCard } from "@/lib/ai";
import connectToDb from "@/lib/db";
import { randomId } from "@/lib/random";
import { FlashCard, IFlashCard } from "@/model/card";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectToDb();
    const { question, answer, userId } = await request.json();

    const id = randomId() + userId;

    if (!question || !answer) {
        return NextResponse.error();
    }

    await FlashCard.create({
        id,
        question,
        answer,
        userId,
        createdAt: Date.now(),
    });

    aiEmpowerCard({ id, question, answer } as IFlashCard);

    return NextResponse.json({ id, ok: true });
}

export async function GET(request: NextRequest) {
    await connectToDb();

    const url = new URL(request.url);

    const userId = url.searchParams.get("userId");

    if (!userId) {
        return NextResponse.error();
    }

    const card = await FlashCard.findOne({
        userId,
        aiEmpowered: true,
    })

    return NextResponse.json(card);
}