import type { CompetitionAnalysis, ConceptDirection } from "@/lib/types";

function extractDeadline(brief: string) {
  const match = brief.match(
    /(?:deadline[:\s-]*)([A-Z][a-z]+ \d{1,2},? \d{4}(?: at [\d:]+ [A-Z]+)?)/i,
  );
  return match?.[1] ?? "Confirm in the official competition portal";
}

function inferTitle(brief: string) {
  const first = brief
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 8);
  return first?.replace(/brief|call for entries/gi, "").trim() ?? "Untitled Design Competition";
}

const concepts: ConceptDirection[] = [
  {
    title: "The Daily Fold",
    tagline: "One calm object that choreographs three distinct moments in a small day.",
    strategy:
      "A slim freestanding cabinet opens in stages: a focused desk surface, a low shared table, and a soft leaning perch. Each movement is mechanical and legible, making transformation feel like a small daily ritual rather than a technical trick.",
    visualMood: "Quiet choreography, warm morning light, precise folds, lived-in calm.",
    materialPalette: ["FSC birch ply", "cork linoleum", "woven wool", "brass pin joints"],
    juryAppeal:
      "Balances genuine spatial utility with a memorable transformation sequence that is easy to explain on one board.",
    prompts: [
      "Editorial interior render of a compact Copenhagen apartment, elegant folding birch furniture transitioning from desk to dinner table, warm cream walls, soft daylight, human-scale, design magazine photography",
      "Exploded axonometric product drawing, transformable birch plywood cabinet, brass pin joints, cork surfaces, clear assembly logic, restrained architectural graphic style, cream background",
      "Triptych showing morning work, evening meal, nighttime rest around one transforming furniture object, consistent camera angle, warm muted palette, competition board quality",
    ],
    statement:
      "The Daily Fold treats limited space as a changing rhythm rather than a fixed constraint. A single freestanding object supports focused work, shared meals, and restorative downtime through three intuitive movements. The cabinet opens first into a compact desk, extends into a low social table, then closes to become a soft leaning perch and storage wall. No electronics, wall anchors, or specialist hardware are required. Flat birch components nest efficiently for transport and can be replaced individually, while cork and wool surfaces add warmth at the points the body touches. Visible brass pins celebrate repair instead of hiding it. By giving each transition a clear physical gesture, The Daily Fold helps residents mark the boundary between parts of the day, even when those activities happen in one room. It is less about fitting more functions into an apartment and more about helping a small home feel different when life needs it to.",
    boardLayout: [
      "Top 20%: hero transformation triptych with the title and one-line idea",
      "Middle left: daily routine timeline and three user scenarios",
      "Middle right: exploded axonometric with numbered movement sequence",
      "Bottom: material lifecycle, flat-pack diagram, and key dimensions",
    ],
    checklist: [
      { label: "A1 board", detail: "Landscape PDF under 15 MB with 10 mm safe margin." },
      { label: "Three renders", detail: "Export hero, transformation, and detail views as high-resolution JPGs." },
      { label: "Axonometric", detail: "Show all replaceable parts and standard fasteners." },
      { label: "Statement", detail: "Use the refined 150-word competition version." },
    ],
  },
  {
    title: "Soft Orbit",
    tagline: "A family of lightweight pieces that gathers close, then drifts apart.",
    strategy:
      "Three upholstered volumes nest as one side table and separate into a laptop perch, floor seat, and shared tray. Handles and curved edges make daily rearrangement inviting, with no single correct configuration.",
    visualMood: "Playful restraint, soft geometry, dusk colors, tactile close-ups.",
    materialPalette: ["Recycled felt", "molded cork", "hemp webbing", "bio-resin tray"],
    juryAppeal:
      "Offers flexible social behavior without the visual noise or engineering burden common to multifunctional furniture.",
    prompts: [
      "Soft modular furniture trio nested as a sculptural side table in a 32 square meter apartment, recycled felt and cork, muted ochre and plum, gentle evening light, premium product visualization",
      "Overhead lifestyle composition showing three residents using modular floor seat, laptop perch, and serving tray, compact urban home, candid but refined, warm material detail",
      "Material macro photography of recycled felt, molded cork and hemp pull straps, soft shadows, circular repair details, sustainable furniture concept board",
    ],
    statement:
      "Soft Orbit begins with a simple observation: small homes rarely need every piece of furniture at the same time. Three lightweight volumes nest into a quiet side table, then separate as the day expands. A cork shell becomes a laptop perch, a felt form settles into a floor seat, and a shallow bio-resin surface lifts away as a shared tray. Their curved footprints overlap without locking, so residents can improvise arrangements for work, conversation, or rest. Hemp handles make each move visible and effortless. The construction avoids foam adhesives: stitched felt sleeves unzip for cleaning, molded cork bodies can be reground, and the tray uses a single-material casting. Instead of disguising compact living with a complex machine, Soft Orbit gives people a small cast of useful companions. Together they read as one composed object; apart they create the loose social landscape that a small room often struggles to hold.",
    boardLayout: [
      "Top: nested hero object with separated silhouettes ghosted behind it",
      "Center: overhead orbit diagram with six possible arrangements",
      "Right rail: tactile material details and repair sequence",
      "Bottom: user scale, nesting dimensions, and circularity story",
    ],
    checklist: [
      { label: "Hero render", detail: "Show nested and separated states in one controlled composition." },
      { label: "Use cases", detail: "Include work, solo rest, and two-person hosting." },
      { label: "Materials", detail: "Verify supplier claims before final board copy." },
      { label: "Animation", detail: "Optional 30-second stop-motion nesting sequence." },
    ],
  },
  {
    title: "Threshold",
    tagline: "A movable room edge that creates focus without closing life away.",
    strategy:
      "A wheeled timber frame combines a translucent screen, narrow desk, and acoustic pocket. It pivots to mark a workspace, then rolls aside to reopen the room for rest or guests.",
    visualMood: "Architectural, luminous, slender, shadows through woven paper.",
    materialPalette: ["Ash battens", "cellulose textile", "recycled PET felt", "castor modules"],
    juryAppeal:
      "Addresses the emotional need for boundaries in studio living while remaining feasible, repairable, and independent of the building.",
    prompts: [
      "Slender movable room divider desk in a tiny apartment, ash frame, translucent cellulose textile, gentle shadow, focused home working scene, Scandinavian editorial interior",
      "Architectural sequence diagram of a wheeled screen pivoting to define work, sleep and social zones, clean black linework, warm yellow highlights, competition presentation",
      "Close-up product render of replaceable acoustic felt pocket and demountable ash joinery, beautiful soft light, material honesty, high-end design prototype",
    ],
    statement:
      "Threshold creates a room inside a room without demanding a second room. A slender ash frame carries a narrow work surface, translucent screen, and acoustic storage pocket on four lockable castors. During work, the frame turns across the apartment to soften visual distraction and form a clear edge around concentration. At the end of the day it rolls against the wall, returning the floor to rest, exercise, or guests. The woven cellulose screen admits daylight and silhouettes movement, preserving connection without exposure. Components attach with dry mechanical joints: damaged battens can be replaced, the PET acoustic liner lifts out, and the textile panel can be renewed like a curtain. Threshold responds to small-space living not by multiplying functions, but by making transitions visible. Its value is psychological as well as spatial: one deliberate movement says that work has begun, and another lets the home become a home again.",
    boardLayout: [
      "Top half: luminous hero view with before-and-after room states",
      "Middle: floor-plan sequence showing three threshold positions",
      "Lower left: frame assembly and standard castor detail",
      "Lower right: light, privacy, and acoustic performance diagrams",
    ],
    checklist: [
      { label: "Plan sequence", detail: "Use the same apartment footprint in all three diagrams." },
      { label: "Feasibility", detail: "Dimension wheelbase and test anti-tip proportions." },
      { label: "Render set", detail: "Include work mode, open-room mode, and joinery close-up." },
      { label: "Restrictions", detail: "State clearly that no wall fixing or electronics are used." },
    ],
  },
];

export function generateMockAnalysis(brief: string): CompetitionAnalysis {
  const isFurniture = /furniture|apartment|interior|chair|table/i.test(brief);
  const title = inferTitle(brief);

  return {
    competitionTitle: title,
    summary: isFurniture
      ? "Design a compact, repairable furniture proposal that helps small urban homes transition between work, rest, and social use. The strongest response will pair a genuinely useful transformation with a clear material afterlife and highly legible visual storytelling."
      : "Create a distinctive, feasible design response that translates the competition’s practical constraints into a memorable user experience. The proposal should make its core idea immediately legible while demonstrating thoughtful material and lifecycle decisions.",
    deadline: extractDeadline(brief),
    eligibility: /student/i.test(brief)
      ? "Students and recent graduates; independent designers are also eligible. Teams of up to three are permitted."
      : "Open eligibility appears broad; verify team size and professional-status rules before submission.",
    entryFee: /no entry fee|free to enter/i.test(brief) ? "No entry fee" : "Not clearly stated — verify before registering",
    deliverables: [
      "One A1 landscape presentation board",
      "Three high-resolution concept renders",
      "One exploded axonometric drawing",
      "A concise 150-word concept statement in English",
      "Optional 30-second assembly or transformation animation",
    ],
    formatRequirements: [
      "Main board supplied as PDF",
      "Maximum PDF file size: 15 MB",
      "Supporting renders supplied as JPG",
      "Keep identifying information off anonymous jury materials",
    ],
    judgingCriteria: [
      "Originality and strength of the central idea — 30%",
      "Usefulness in real small-space routines — 25%",
      "Environmental responsibility and repair — 20%",
      "Technical feasibility — 15%",
      "Clarity and quality of visual communication — 10%",
    ],
    hiddenOpportunities: [
      "The brief rewards transitions between activities, not just maximum storage. Show an emotional before-and-after.",
      "The optional animation can make a simple mechanical idea feel unusually resolved.",
      "Prototype invitation suggests the jury will favor standard hardware, credible dimensions, and replaceable parts.",
      "Visual communication is only 10% on paper, but it controls how quickly every other criterion is understood.",
    ],
    risks: [
      "Overcomplicated transformations may undermine feasibility and repairability.",
      "A generic ‘multifunctional’ claim will be weak without a specific daily routine.",
      "Custom electronics and permanent wall fixing are explicitly discouraged.",
      "Sustainability claims need construction evidence, not only a natural-looking palette.",
    ],
    concepts,
    generatedAt: new Date().toISOString(),
  };
}
