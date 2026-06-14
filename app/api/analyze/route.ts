import { NextResponse } from "next/server";
import { analyzeBrief } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { brief?: string };
    const brief = body.brief?.trim();
    if (!brief || brief.length < 80) {
      return NextResponse.json(
        { error: "Please add a little more of the competition brief before analyzing." },
        { status: 400 },
      );
    }
    return NextResponse.json(await analyzeBrief(brief));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
