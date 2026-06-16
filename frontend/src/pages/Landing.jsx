import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Flame, Mountain, Wind, Waves } from "lucide-react";
import { HOME } from "@/constants/testIds";
import { ELEMENTS } from "@/lib/quizData";

const elementIcons = {
  wood: Leaf,
  fire: Flame,
  earth: Mountain,
  metal: Wind,
  water: Waves,
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1630595271375-5073a6c0638b?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F7F5F0]/95 via-[#F7F5F0]/85 to-[#F7F5F0]/40" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24 lg:pt-28 lg:pb-36 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#8A7965] font-bold">
              <span className="h-px w-8 bg-[#8A7965]" /> Aham Arogyam · TCM Wisdom
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#243021] font-medium">
              Discover the <em className="italic text-[#3E533B]">element</em> that quietly shapes your body, mind &amp; mood.
            </h1>
            <p className="text-lg text-[#4A4846] leading-relaxed max-w-2xl">
              A 2-minute personality quiz rooted in 2,500 years of Traditional Chinese Medicine. Find your dominant Five Element type — Wood, Fire, Earth, Metal or Water — and receive a personalised wellness blueprint.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/quiz"
                data-testid={HOME.heroStartBtn}
                className="group inline-flex items-center gap-3 rounded-full bg-[#3E533B] hover:bg-[#2C3D2A] text-[#F7F5F0] px-8 py-4 font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Begin the Quiz
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="text-sm text-[#6A6865]">
                <span className="font-medium text-[#243021]">10 questions</span> &middot; about 2 minutes &middot; free
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 text-sm text-[#4A4846]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E533B]" /> Backed by classical TCM theory
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B05B43]" /> Personalised lifestyle tips
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C89F5A]" /> Optional clinic consultation
              </div>
            </div>
          </div>

          {/* Floating element discs */}
          <div className="lg:col-span-5 relative h-[420px] hidden lg:block">
            {Object.values(ELEMENTS).map((el, i) => {
              const Icon = elementIcons[el.key];
              const positions = [
                "top-0 left-12",
                "top-16 right-0",
                "top-1/2 left-0",
                "bottom-12 right-12",
                "bottom-0 left-24",
              ];
              return (
                <div
                  key={el.key}
                  className={`absolute ${positions[i]} group cursor-default`}
                >
                  <div
                    className="w-32 h-32 rounded-full grid place-items-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2"
                    style={{ background: el.bg }}
                  >
                    <div className="text-center">
                      <Icon className="w-6 h-6 mx-auto mb-1" style={{ color: el.accent }} />
                      <div className="font-serif-display text-2xl" style={{ color: el.accent }}>
                        {el.chinese}
                      </div>
                      <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: el.accent }}>
                        {el.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FIVE ELEMENTS GRID */}
      <section className="py-20 lg:py-28 bg-[#EFE9E1]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-14">
            <div className="text-xs tracking-[0.25em] uppercase text-[#8A7965] font-bold mb-4">
              The Five Phases · 五行
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#243021] font-medium leading-tight tracking-tight">
              Five energies move through every body. One of them is leading yours.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {Object.values(ELEMENTS).map((el) => {
              const Icon = elementIcons[el.key];
              return (
                <div
                  key={el.key}
                  className="rounded-2xl p-7 border border-[#E2DFD8]/60 bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-full grid place-items-center mb-5"
                    style={{ background: el.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: el.accent }} />
                  </div>
                  <div className="font-serif-display text-2xl text-[#243021] mb-1">
                    {el.name} <span className="text-[#8A7965]">· {el.chinese}</span>
                  </div>
                  <div className="text-xs tracking-[0.18em] uppercase text-[#8A7965] mb-4">
                    {el.tagline}
                  </div>
                  <div className="text-sm text-[#4A4846] leading-relaxed">
                    {el.virtue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#243021] font-medium leading-tight tracking-tight mb-6">
            Ready to meet the element behind your patterns?
          </h2>
          <p className="text-[#4A4846] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Answer 10 simple questions. We'll show your dominant phase, what it means for your sleep, mood and digestion — and how the clinic can help you bring it back into balance.
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-3 rounded-full bg-[#3E533B] hover:bg-[#2C3D2A] text-[#F7F5F0] px-10 py-4 font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Start your free reading
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E2DFD8]/60 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6A6865]">
          <div>© {new Date().getFullYear()} Aham Arogyam Clinic · All rights reserved</div>
          <div className="text-xs tracking-[0.2em] uppercase text-[#8A7965]">Rooted in tradition · Designed for today</div>
        </div>
      </footer>
    </div>
  );
}
