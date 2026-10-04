import {
  Bot,
  Check,
  CloudOff,
  Code2,
  HardDrive,
  KeyRound,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { SectionLabel } from "@/components/section-label";

const facts = [
  {
    icon: HardDrive,
    title: "本地优先设计",
    copy: "竞赛 Brief 和已保存的项目都存储在浏览器 localStorage 中。Nugget 目前无需账户，因此这些内容不会上传至 Nugget 账户。",
  },
  {
    icon: Bot,
    title: "完整的模拟 AI 能力",
    copy: "公开 Demo 无需额外配置即可使用，并能根据示例 Brief 生成完整且接近真实使用场景的提案方案包。",
  },
  {
    icon: KeyRound,
    title: "按需接入 AI 模型",
    copy: "自托管版本可以通过服务端环境变量切换至 OpenAI 或 Anthropic。",
  },
  {
    icon: CloudOff,
    title: "暂不支持云端同步",
    copy: "项目目前不会在不同浏览器或设备之间自动同步。你可以导出 Markdown 或 JSON，将项目内容保存并带走。",
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>设置 & 关于</SectionLabel>
          <h1 className="display mt-6 text-5xl font-semibold sm:text-7xl">简单、透明，属于你。</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/60">
            Nugget v0 是一个本地优先的产品 Demo：提供足够完整的智能体验，无需账户、付费系统或复杂的后台基础。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {facts.map((fact, index) => (
            <section key={fact.title} className={`rounded-4xl border border-ink/10 p-7 shadow-card ${
              index === 0 ? "bg-gold-soft/60" : index === 1 ? "bg-[#e4ecdc]" : "bg-paper"
            }`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-white/70">
                <fact.icon className="h-5 w-5" />
              </span>
              <h2 className="display mt-6 text-3xl font-semibold">{fact.title}</h2>
              <p className="mt-3 leading-7 text-ink/60">{fact.copy}</p>
            </section>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-[2.25rem] border border-ink/10 bg-ink text-white shadow-soft">
          <div className="grid lg:grid-cols-[.85fr_1.15fr]">
            <div className="p-8 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold">
                <Code2 className="h-3.5 w-3.5" /> AI 服务设置
              </span>
              <h2 className="display mt-6 text-[31px] font-semibold">选择 Nugget 的思考方式。</h2>
              <p className="mt-4 leading-7 text-white/60">
                默认使用模拟模式，无需 API Key。若在本地私有部署，可在 <code className="text-gold">.env.local</code> 中添加相应的 AI 模型服务密钥，然后重新启动应用。
              </p>
              <div className="mt-7 space-y-3">
                {["密钥仅保留在服务端", "始终保留模拟模式作为备用", "敏感密钥不会提交至代码仓库"].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-sm font-semibold text-white/70">
                    <Check className="h-4 w-4 text-gold" /> {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#171510] p-5 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 pb-4">
                <span className="h-3 w-3 rounded-full bg-coral" />
                <span className="h-3 w-3 rounded-full bg-gold" />
                <span className="h-3 w-3 rounded-full bg-sage" />
                <span className="ml-3 text-xs font-bold text-white/35">.env.local</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm leading-7 text-white/75">
                <code>{`# Works immediately
AI_PROVIDER=mock

# Or use OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here

# Or use Anthropic
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { icon: LockKeyhole, label: "账户认证", value: "暂未支持" },
            { icon: Sparkles, label: "付费系统", value: "暂未支持" },
            { icon: CloudOff, label: "云端同步", value: "暂未支持" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-3xl border border-ink/10 bg-paper p-5 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream"><item.icon className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/35">{item.label}</p>
                <p className="mt-1 font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
