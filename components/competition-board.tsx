"use client";

import Image from "next/image";
import type { BoardLayout, ProductionConcept } from "@/lib/production";

type CompetitionBoardProps = {
  assets: string[];
  competitionTitle: string;
  concept: ProductionConcept;
  deliverables: string[];
  layout: BoardLayout;
};

function BoardImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#d8d4ca] ${className}`}>
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={src.startsWith("data:")}
          className="object-cover"
        />
      )}
    </div>
  );
}

export function CompetitionBoard({
  assets,
  competitionTitle,
  concept,
  deliverables,
  layout,
}: CompetitionBoardProps) {
  if (layout.id === "editorial-impact") {
    return (
      <div className="relative aspect-[1.414/1] overflow-hidden bg-[#181713] text-white">
        <BoardImage src={assets[0]} alt="Editorial hero" className="absolute inset-y-0 right-0 w-[68%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181713] via-[#181713]/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 z-10 flex w-[48%] flex-col justify-between p-[5%]">
          <p className="max-w-[80%] text-[clamp(5px,.65vw,10px)] font-black uppercase tracking-[.16em] text-[#f6bd3a]">
            {competitionTitle}
          </p>
          <div>
            <p className="text-[clamp(6px,.7vw,11px)] uppercase tracking-[.28em] text-white/45">Selected direction</p>
            <h3 className="mt-2 font-serif text-[clamp(28px,5vw,76px)] font-semibold leading-[.82] tracking-[-.07em]">
              {concept.title}
            </h3>
            <p className="mt-4 max-w-[80%] text-[clamp(6px,.75vw,12px)] leading-relaxed text-white/60">{concept.tagline}</p>
          </div>
          <div className="flex gap-2">
            {[assets[1], assets[2]].map((src, index) => (
              <BoardImage key={index} src={src} alt={`Editorial detail ${index + 1}`} className="aspect-[4/3] w-[38%] border border-white/20" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-[4%] right-[3%] z-10 text-[clamp(5px,.55vw,9px)] font-black tracking-[.14em] text-white/55">
          01 / 03 · VISUAL PROPOSITION
        </div>
      </div>
    );
  }

  if (layout.id === "narrative-strip") {
    return (
      <div className="aspect-[1.414/1] overflow-hidden bg-[#e9e5db] p-[3%]">
        <div className="flex h-[18%] items-end justify-between border-b-2 border-[#201d17] pb-[2%]">
          <div>
            <p className="text-[clamp(5px,.55vw,9px)] font-black uppercase tracking-[.18em]">A three-act proposal</p>
            <h3 className="mt-1 font-serif text-[clamp(18px,3vw,48px)] leading-none">{concept.title}</h3>
          </div>
          <p className="max-w-[38%] text-right text-[clamp(5px,.62vw,10px)] leading-relaxed">{concept.strategy}</p>
        </div>
        <div className="grid h-[68%] grid-cols-3 gap-[1.5%] pt-[2%]">
          {assets.slice(0, 3).map((src, index) => (
            <div key={index} className="grid grid-rows-[1fr_auto] overflow-hidden bg-white">
              <BoardImage src={src} alt={`Narrative act ${index + 1}`} />
              <div className="flex items-center justify-between p-[5%]">
                <span className="font-serif text-[clamp(14px,2vw,30px)]">0{index + 1}</span>
                <span className="text-[clamp(5px,.55vw,9px)] font-black uppercase tracking-[.12em]">
                  {["Premise", "Transformation", "Resolution"][index]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[1.5%] flex items-center justify-between text-[clamp(5px,.55vw,9px)] font-bold uppercase tracking-[.12em]">
          <span>{competitionTitle}</span><span>{concept.tagline}</span>
        </div>
      </div>
    );
  }

  if (layout.id === "object-system") {
    return (
      <div className="grid aspect-[1.414/1] grid-cols-[22%_56%_22%] overflow-hidden bg-[#f2eee5]">
        <div className="flex flex-col justify-between bg-[#23352f] p-[12%] text-white">
          <div>
            <p className="text-[clamp(5px,.55vw,9px)] font-black uppercase tracking-[.15em] text-[#d5b85b]">Object study</p>
            <h3 className="mt-[12%] font-serif text-[clamp(18px,2.7vw,42px)] leading-[.9]">{concept.title}</h3>
          </div>
          <div className="space-y-[8%]">
            {concept.palette.map((color, index) => (
              <div key={color} className="border-t border-white/20 pt-[5%] text-[clamp(5px,.55vw,9px)]">
                0{index + 1} · {color}
              </div>
            ))}
          </div>
        </div>
        <div className="relative border-x-4 border-[#f2eee5]">
          <BoardImage src={assets[0]} alt="Object hero" className="h-full" />
          <div className="absolute bottom-[4%] left-[5%] rounded-full bg-white/90 px-[4%] py-[1.5%] text-[clamp(5px,.55vw,9px)] font-black">
            COMPLETE OBJECT / PRIMARY CONFIGURATION
          </div>
        </div>
        <div className="grid grid-rows-2">
          {[assets[1], assets[2]].map((src, index) => (
            <div key={index} className="grid grid-rows-[1fr_auto] border-b-4 border-[#f2eee5] last:border-0">
              <BoardImage src={src} alt={`Object evidence ${index + 1}`} />
              <p className="bg-white p-[6%] text-[clamp(5px,.55vw,9px)] font-black uppercase tracking-[.1em]">
                {index === 0 ? "Variation logic" : "Material junction"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid aspect-[1.414/1] grid-cols-12 grid-rows-8 gap-[.35%] overflow-hidden bg-[#ece8df] p-[.45%]">
      <div className="col-span-9 row-span-5">
        <BoardImage src={assets[0]} alt="Spatial hero" className="h-full" />
      </div>
      <div className="col-span-3 row-span-5 flex flex-col justify-between bg-[#172328] p-[12%] text-white">
        <div>
          <p className="text-[clamp(5px,.5vw,8px)] font-black uppercase tracking-[.16em] text-[#f6bd3a]">Spatial atlas</p>
          <h3 className="mt-[10%] font-serif text-[clamp(16px,2.4vw,38px)] leading-[.92]">{concept.title}</h3>
        </div>
        <p className="text-[clamp(5px,.55vw,9px)] leading-relaxed text-white/55">{concept.tagline}</p>
      </div>
      {[assets[1], assets[2]].map((src, index) => (
        <div key={index} className="col-span-3 row-span-3">
          <BoardImage src={src} alt={`Spatial evidence ${index + 1}`} className="h-full" />
        </div>
      ))}
      <div className="col-span-6 row-span-3 grid grid-cols-[1fr_1.4fr] bg-white p-[4%]">
        <div>
          <p className="text-[clamp(5px,.5vw,8px)] font-black uppercase tracking-[.14em]">Project index</p>
          <p className="mt-[8%] font-serif text-[clamp(12px,1.7vw,26px)] leading-tight">{competitionTitle}</p>
        </div>
        <div className="border-l border-black/15 pl-[7%]">
          {deliverables.slice(0, 4).map((item, index) => (
            <p key={item} className="border-b border-black/10 py-[3%] text-[clamp(4px,.48vw,8px)]">
              0{index + 1} · {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
