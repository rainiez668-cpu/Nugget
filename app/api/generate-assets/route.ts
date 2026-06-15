import { NextResponse } from "next/server";

type GenerateRequest = {
  competitionTitle?: string;
  conceptTitle?: string;
  categories?: string[];
  prompts?: string[];
};

const architectureSamples = [
  "/generation-samples/architecture/hero.png",
  "/generation-samples/architecture/detail.png",
  "/generation-samples/architecture/context.png",
];

const fashionSamples = [
  "/generation-samples/fashion/hero.png",
  "/generation-samples/fashion/variations.png",
  "/generation-samples/fashion/detail.png",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const prompts = body.prompts?.filter(Boolean).slice(0, 3) ?? [];
    const isFashion = body.categories?.some((category) =>
      /时尚|纺织|珠宝|家具|产品/.test(category),
    );

    if (!process.env.OPENAI_API_KEY || prompts.length === 0) {
      return NextResponse.json({
        provider: "mock",
        assets: isFashion ? fashionSamples : architectureSamples,
      });
    }

    const assets = await Promise.all(
      prompts.map(async (prompt) => {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-image-2",
            prompt: `${prompt}\nNo text, no logos, no watermark. Maintain a coherent, physically plausible competition proposal.`,
            size: "1536x1024",
            quality: "medium",
            output_format: "png",
          }),
        });

        if (!response.ok) {
          throw new Error(`Image generation failed with status ${response.status}.`);
        }

        const data = await response.json();
        const encoded = data.data?.[0]?.b64_json;
        if (!encoded) throw new Error("Image generation returned no image.");
        return `data:image/png;base64,${encoded}`;
      }),
    );

    return NextResponse.json({ provider: "openai", assets });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
