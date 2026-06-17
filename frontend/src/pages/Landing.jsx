import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  Sparkles,
  Calendar as CalIcon,
  Stethoscope,
  Heart,
  Activity,
  Droplets,
  Users,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
} from "lucide-react";

const COLORS = {
  ivory: "#F5EDDF",
  ivoryLight: "#FBF6EC",
  forest: "#1F3A2E",
  forestDark: "#152A21",
  gold: "#B68B47",
  goldLight: "#D4AE73",
  ink: "#2C2A29",
  muted: "#7A6F62",
  card: "#FFFFFF",
};

const MARBLE_BG = "/images/hero-bg.png";
const LEAF_BG = "/images/leaves-pattern.png";
const ORGANIC_BG = "/images/organic-shape.png";
const KAVITA_IMG = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop";

export default function Landing() {
  return (
    <div className="bg-[#F5EDDF] text-[#2C2A29] font-sans-body">
      <TopHeader />
      <Hero />
      <AboutKavita />
      <ServiceMenu />
      <SelfHealingLab />
      <FiveElementQuizCTA />
      <BeginHealing />
      <SiteFooter />
    </div>
  );
}

// -----------------------------------------
function TopHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#F5EDDF]/90 backdrop-blur-md border-b border-[#1F3A2E]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <a href="#top" className="leading-tight" data-testid="nav-logo">
          <div className="font-serif-display text-2xl text-[#1F3A2E] tracking-tight">
            Aham Arogyam
          </div>
          <div className="text-[10px] tracking-[0.32em] uppercase text-[#B68B47] mt-1">
            I am health
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm text-[#2C2A29]">
          <a href="#about" className="hover:text-[#B68B47] transition-colors">Our Story</a>
          <a href="#services" className="hover:text-[#B68B47] transition-colors">Service Menu</a>
          <a href="#workshops" className="hover:text-[#B68B47] transition-colors">Workshops</a>
          <Link to="/quiz" className="hover:text-[#B68B47] transition-colors" data-testid="nav-quiz-link">
            Five Element Quiz
          </Link>
          <a
            href="#book"
            data-testid="nav-book-btn"
            className="rounded-full bg-[#B68B47] hover:bg-[#9A7536] text-white px-6 py-2.5 font-medium transition-all hover:-translate-y-0.5 shadow-sm"
          >
            Book Session
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#1F3A2E]"
          aria-label="menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#F5EDDF] border-t border-[#1F3A2E]/10 px-6 py-6 flex flex-col gap-4 text-sm">
          <a href="#about" onClick={() => setOpen(false)}>Our Story</a>
          <a href="#services" onClick={() => setOpen(false)}>Service Menu</a>
          <a href="#workshops" onClick={() => setOpen(false)}>Workshops</a>
          <Link to="/quiz" onClick={() => setOpen(false)}>Five Element Quiz</Link>
          <a href="#book" onClick={() => setOpen(false)} className="text-[#B68B47] font-medium">Book Session</a>
        </div>
      )}
    </header>
  );
}

// -----------------------------------------
function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={MARBLE_BG} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EDDF]/40 via-[#F5EDDF]/60 to-[#F5EDDF]" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center px-6 pt-24">
        <div className="inline-flex items-center rounded-full border border-[#B68B47]/40 bg-[#F5EDDF]/80 px-5 py-2 text-[11px] tracking-[0.28em] uppercase text-[#1F3A2E] mb-10">
          Traditional Chinese Medicine &amp; Acupuncture
        </div>
        <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#1F3A2E] font-normal leading-[1.05] tracking-tight">
          Heal from the
          <br />
          <em className="italic text-[#B68B47] font-normal">inside out.</em>
        </h1>
        <p className="mt-10 text-lg text-[#4A4846] leading-relaxed max-w-2xl mx-auto">
          Body, mind, and energy working in harmony. Discover personalized natural healing to understand your unique energy constitution and live in alignment with it.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/quiz"
            data-testid="hero-start-quiz-btn"
            className="group inline-flex items-center gap-3 rounded-full bg-[#1F3A2E] hover:bg-[#152A21] text-[#F5EDDF] px-8 py-4 font-medium transition-all hover:-translate-y-0.5 shadow-md"
          >
            Start Your Healing Journey
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#about"
            className="inline-flex items-center gap-3 rounded-full bg-white/80 hover:bg-white text-[#1F3A2E] border border-[#1F3A2E]/15 px-8 py-4 font-medium transition-all hover:-translate-y-0.5"
          >
            Meet Kavita Sharma
          </a>
        </div>

        <div className="mt-24 text-[11px] tracking-[0.28em] uppercase text-[#7A6F62] flex flex-col items-center gap-3">
          Scroll to Explore
          <span className="block w-px h-12 bg-[#B68B47]/60" />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------
function AboutKavita() {
  const modalities = [
    { icon: Stethoscope, label: "TCM body & auricular acupuncture" },
    { icon: Activity, label: "Sujok & Indian acupressure" },
    { icon: Heart, label: "Cupping, Moxibustion & Gua-sha" },
    { icon: Leaf, label: "Ayurvedic lifestyle counsel" },
  ];
  return (
    <section id="about" className="py-24 lg:py-32 bg-[#F5EDDF] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative">
          <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-[0_20px_60px_rgba(31,58,46,0.18)]">
            <img src={KAVITA_IMG} alt="Kavita Sharma" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 lg:left-10 lg:right-auto lg:w-72 bg-[#1F3A2E] text-[#F5EDDF] rounded-xl p-5 shadow-lg">
            <div className="font-serif-display italic text-lg leading-snug">
              &ldquo;A healer born from necessity.&rdquo;
            </div>
          </div>
        </div>
        <div>
          <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4">
            About Kavita Sharma
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-[#1F3A2E] leading-tight tracking-tight mb-8">
            From Law Professor to <em className="italic text-[#B68B47] font-normal">Natural Healer.</em>
          </h2>
          <div className="space-y-5 text-[#4A4846] leading-relaxed">
            <p>
              Kavita was a law professor and advocate when her 12-year-old daughter fell mysteriously ill — partially paralysed, her body shutting down, conventional medicine unable to offer a diagnosis or a cure.
            </p>
            <p>
              Kavita quit her career to care for her daughter full-time and began a deep search through natural healing modalities. It was the combination of Ayurveda and Traditional Chinese Medicine that finally transformed her daughter&rsquo;s health.
            </p>
          </div>
          <div className="mt-7 border-l-4 border-[#B68B47] bg-[#FBF6EC] px-5 py-4 rounded-r-lg text-[#1F3A2E]">
            Over the last decade, Kavita has treated more than <span className="font-semibold">800 patients</span> using a personalised blend of therapies.
          </div>
          <div className="mt-10">
            <div className="font-serif-display text-xl text-[#1F3A2E] mb-4">Integrative Modalities</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modalities.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white rounded-xl border border-[#1F3A2E]/8 px-4 py-3"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#B68B47]/15 grid place-items-center">
                    <m.icon className="w-4 h-4 text-[#B68B47]" />
                  </span>
                  <span className="text-sm text-[#2C2A29]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------
function ServiceMenu() {
  const core = [
    { dur: "60 min", title: "Relaxation & Rejuvenation", desc: "Micro-diagnosis (pulse, tongue), 35-40 min gentle body/auricular acupuncture + cupping or moxa, with personalized self-care tips." },
    { dur: "40-50 min", title: "Therapeutic Acupuncture", desc: "Focused treatment for pain, stress, sleep, digestion, hormones, BP support and post-illness recovery." },
    { dur: "45-60 min", title: "Facial Rejuvenation", desc: "Facial acupuncture and facial cupping for natural glow, tone, circulation and deep relaxation. Beauty from inside out." },
    { dur: "40-50 min", title: "Cupping & Moxibustion Focus", desc: "Oil, heat and wet cupping combined with moxa for muscle tension, stagnation, fatigue and cold-type conditions." },
  ];
  const packs = [
    { dur: "60 min", tag: "QUICK RESET", title: "1-Session Instant Reset", desc: "One Relaxation & Rejuvenation session. Ideal as an introduction or a quick nervous system reset." },
    { dur: "3-7 days", tag: "POPULAR", title: "3-Session Nervous System Reset", desc: "Three 40-50 min sessions for stress, sleep, or anxiety. Includes a simple 10-15 min daily self-healing routine." },
    { dur: "1-3 weeks", tag: "DEEP HEALING", title: "5-Session Deep Reset", desc: "Five sessions for chronic pain and deep recovery. Includes a personalized self-healing plan with morning/evening routines." },
  ];
  return (
    <section
      id="services"
      className="py-24 lg:py-32 relative bg-[#F5EDDF]"
    >
      <img src={LEAF_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4">
            Service Menu
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-[#1F3A2E] leading-tight tracking-tight">
            Treatments &amp; Therapies
          </h2>
          <p className="mt-5 text-[#4A4846] leading-relaxed">
            Every session aims not just to give relief, but to help you understand your unique energy constitution.
          </p>
        </div>

        <SubHeader letter="A" title="Core Clinical Sessions" desc="Deep, individualized clinical treatments targeting specific physical and energetic needs." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {core.map((c, i) => (
            <ServiceCard key={i} {...c} />
          ))}
        </div>

        <SubHeader letter="B" title="Reset Packs" desc="Bundled sessions designed for progressive, sustained healing and nervous system regulation." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packs.map((p, i) => (
            <ServiceCard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SubHeader({ letter, title, desc }) {
  return (
    <div className="mb-8">
      <div className="flex items-end gap-3 mb-2">
        <span className="font-serif-display text-2xl text-[#B68B47]">{letter}.</span>
        <h3 className="font-serif-display text-2xl sm:text-3xl text-[#1F3A2E]">{title}</h3>
      </div>
      <div className="h-px w-full bg-[#1F3A2E]/15 mb-4" />
      <p className="text-[#4A4846] max-w-2xl">{desc}</p>
    </div>
  );
}

function ServiceCard({ dur, title, desc, tag }) {
  return (
    <div className="bg-white rounded-xl border border-[#1F3A2E]/8 p-6 flex flex-col hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(31,58,46,0.08)] transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EDDF] px-3 py-1 text-xs text-[#1F3A2E]">
          <Clock className="w-3.5 h-3.5" /> {dur}
        </span>
        {tag && (
          <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-[#B68B47] font-semibold">
            <Sparkles className="w-3 h-3" /> {tag}
          </span>
        )}
      </div>
      <div className="font-serif-display text-xl text-[#1F3A2E] mb-3 leading-snug">{title}</div>
      <p className="text-sm text-[#4A4846] leading-relaxed flex-1">{desc}</p>
      <a
        href="#book"
        className="mt-5 inline-flex items-center gap-2 text-[#B68B47] hover:text-[#9A7536] font-medium text-sm group"
      >
        Book this session <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}

// -----------------------------------------
function SelfHealingLab() {
  const modules = [
    { icon: Users, title: "Module 1 — Decode Your Energy Body", dur: "2-3 hrs", desc: "Intro to TCM, group self-assessment, discover your energy pattern.", takeaway: "My energy pattern + 3 lifestyle shifts handout" },
    { icon: Activity, title: "Module 2 — Pain, Posture & Ache Lab", dur: "3 hrs", desc: "Focus on cervical, shoulders, lower back, knees via self-acupressure.", takeaway: "10-15 min practice sequence for top pain pattern" },
    { icon: Heart, title: "Module 3 — Stress & Nervous System Lab", dur: "1-3 hrs", desc: "Breathwork, acupressure, moxa-at-home guidance, sleep rituals.", takeaway: "Deep relaxation tools and daily micro-habits" },
    { icon: Droplets, title: "Module 4 — Women's Special Care Lab", dur: "2-3 hrs", desc: "Menstrual health, PMS, hormonal balance, emotional regulation.", takeaway: "Self-acupressure and gentle movement pointers" },
  ];
  return (
    <section id="workshops" className="py-24 lg:py-32 bg-[#1F3A2E] text-[#F5EDDF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
        <div>
          <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4">
            Group Workshops
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl leading-tight tracking-tight mb-6">
            The Self-Healing Lab
          </h2>
          <p className="text-[#F5EDDF]/80 leading-relaxed mb-5">
            Half-day workshops and labs where participants learn to understand their energy body, use practical self-healing tools, and build a daily practice they can sustain.
          </p>
          <div className="italic font-serif-display text-xl text-[#B68B47] mb-8">
            Not a lecture — a laboratory.
          </div>
          <div className="bg-[#152A21] border border-[#B68B47]/40 rounded-xl p-6">
            <div className="font-serif-display text-xl text-[#B68B47] mb-2">Energy Constitution Check</div>
            <p className="text-sm text-[#F5EDDF]/80 leading-relaxed mb-4">
              15-20 min taster. Pulse and tongue check, short summary of constitution, and 1-2 lifestyle recommendations. Ideal for retreats and festivals.
            </p>
            <a href="#book" className="inline-flex items-center gap-2 text-[#B68B47] font-medium text-sm group">
              Inquire about group bookings
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {modules.map((m, i) => (
            <div key={i} className="bg-[#152A21] border border-[#F5EDDF]/8 rounded-xl p-6 hover:border-[#B68B47]/40 transition-colors">
              <div className="w-11 h-11 rounded-lg bg-[#B68B47] grid place-items-center mb-5">
                <m.icon className="w-5 h-5 text-[#1F3A2E]" />
              </div>
              <div className="font-serif-display text-lg leading-snug mb-2">{m.title}</div>
              <div className="text-[#B68B47] text-sm mb-3">{m.dur}</div>
              <p className="text-sm text-[#F5EDDF]/75 leading-relaxed mb-5">{m.desc}</p>
              <div className="pt-4 border-t border-[#F5EDDF]/10">
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#B68B47] font-semibold mb-1">Take-home</div>
                <div className="text-sm text-[#F5EDDF]/90">{m.takeaway}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------
function FiveElementQuizCTA() {
  return (
    <section className="py-24 lg:py-32 bg-[#FBF6EC] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="bg-white border border-[#1F3A2E]/10 rounded-3xl p-10 lg:p-16 shadow-[0_20px_60px_rgba(31,58,46,0.08)] grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4">
              Five Element Personality · 五行
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#1F3A2E] leading-tight tracking-tight mb-6">
              Curious about your <em className="italic text-[#B68B47] font-normal">energy constitution?</em>
            </h2>
            <p className="text-[#4A4846] leading-relaxed mb-8 text-lg">
              Take our complimentary 2-minute quiz. Discover whether your dominant element is Wood, Fire, Earth, Metal or Water — and receive a personalised wellness blueprint before your first session.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/quiz"
                data-testid="cta-take-quiz-btn"
                className="group inline-flex items-center gap-3 rounded-full bg-[#1F3A2E] hover:bg-[#152A21] text-[#F5EDDF] px-8 py-4 font-medium transition-all hover:-translate-y-0.5 shadow-md"
              >
                Take the Five Element Quiz
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="text-sm text-[#7A6F62]">
                <span className="text-[#1F3A2E] font-medium">10 questions</span> · ~2 minutes · free
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { ch: "木", name: "Wood", bg: "#EAF0E5", c: "#3E533B" },
              { ch: "火", name: "Fire", bg: "#F8E7E0", c: "#8E3F2C" },
              { ch: "土", name: "Earth", bg: "#F5ECD8", c: "#8E6F2C" },
              { ch: "金", name: "Metal", bg: "#EFEEEC", c: "#5F6663" },
              { ch: "水", name: "Water", bg: "#E2E7EB", c: "#1F2E38" },
            ].map((e, i) => (
              <div
                key={i}
                className="rounded-2xl aspect-[3/4] grid place-items-center text-center p-3"
                style={{ background: e.bg }}
              >
                <div>
                  <div className="font-serif-display text-3xl mb-1" style={{ color: e.c }}>
                    {e.ch}
                  </div>
                  <div className="text-[10px] tracking-[0.18em] uppercase" style={{ color: e.c }}>
                    {e.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------
function BeginHealing() {
  const services = [
    "Relaxation & Rejuvenation (60 min)",
    "Therapeutic Acupuncture (40-50 min)",
    "Facial Rejuvenation (45-60 min)",
    "Cupping & Moxibustion Focus (40-50 min)",
    "1-Session Instant Reset",
    "3-Session Nervous System Reset Pack",
    "5-Session Deep Reset Pack",
    "Energy Constitution Check",
  ];
  const WA = "https://wa.me/917017952202?text=" + encodeURIComponent(
    "Hello Aham Arogyam, I'd like to request an appointment."
  );

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      service: fd.get("service"),
      preferred_date: fd.get("date") || null,
      preferred_time: fd.get("time") || null,
      message: fd.get("note") || null,
    };
    setSending(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/appointments/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      e.target.reset();
    } catch (err) {
      // Even if API fails, open WhatsApp as fallback
    } finally {
      setSending(false);
    }
    const text = `Hello Aham Arogyam, I'd like to book an appointment.\n\n` +
      `Name: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n` +
      `Service: ${payload.service}\nDate: ${payload.preferred_date || "-"}\n` +
      `Time: ${payload.preferred_time || "-"}\nNote: ${payload.message || "-"}`;
    window.open(`https://wa.me/917017952202?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="book" className="py-24 lg:py-32 bg-[#F5EDDF]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="bg-white rounded-3xl border border-[#1F3A2E]/10 overflow-hidden grid lg:grid-cols-[1fr_1.5fr] shadow-[0_20px_60px_rgba(31,58,46,0.08)]">
          <div className="bg-[#1F3A2E] text-[#F5EDDF] p-10 lg:p-12">
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-tight tracking-tight mb-6">
              Begin Your <em className="italic text-[#B68B47] font-normal">Healing.</em>
            </h2>
            <p className="text-[#F5EDDF]/80 leading-relaxed mb-10">
              Schedule a session with Kavita. Whether you need a quick reset or deep therapeutic intervention, we&rsquo;re here to guide you.
            </p>
            <div className="space-y-5">
              <FeatureRow icon={CalIcon} title="Flexible Dates" body="Choose a date that works best for your schedule." />
              <FeatureRow icon={Clock} title="Micro-diagnosis" body="Every clinical session includes a pulse & tongue check." />
              <FeatureRow icon={Phone} title="Direct WhatsApp" body="Submit the form to confirm via WhatsApp instantly." />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-10 lg:p-12 space-y-5">
            <FormField label="Full Name" name="name" placeholder="Jane Doe" required />
            <FormField label="Phone Number" name="phone" placeholder="+91 98765 43210" required />
            <FormField label="Email Address" name="email" type="email" placeholder="jane@example.com" required />
            <div>
              <Label>Select Service</Label>
              <select name="service" required className="mt-2 w-full rounded-xl border border-[#1F3A2E]/15 bg-[#FBF6EC] px-4 py-3.5 focus:border-[#B68B47] focus:ring-2 focus:ring-[#B68B47]/20 outline-none text-[#2C2A29]">
                <option value="">Choose a service…</option>
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Preferred Date" name="date" type="date" />
              <div>
                <Label>Preferred Time</Label>
                <select name="time" className="mt-2 w-full rounded-xl border border-[#1F3A2E]/15 bg-[#FBF6EC] px-4 py-3.5 focus:border-[#B68B47] focus:ring-2 focus:ring-[#B68B47]/20 outline-none text-[#2C2A29]">
                  <option>Morning (9AM - 12PM)</option>
                  <option>Afternoon (12PM - 4PM)</option>
                  <option>Evening (4PM - 7PM)</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Message (Optional)</Label>
              <textarea name="note" rows={3} placeholder="Tell us about your main health concerns or anything we should know..." className="mt-2 w-full rounded-xl border border-[#1F3A2E]/15 bg-[#FBF6EC] px-4 py-3 focus:border-[#B68B47] focus:ring-2 focus:ring-[#B68B47]/20 outline-none text-[#2C2A29]" />
            </div>
            <button
              type="submit"
              disabled={sending}
              data-testid="request-appointment-btn"
              className="w-full rounded-full bg-[#B68B47] hover:bg-[#9A7536] text-white py-4 font-medium transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-60"
            >
              {sending ? "Sending…" : sent ? "Request Sent ✓ Send Another?" : "Request Appointment"}
            </button>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-[#7A6F62] hover:text-[#B68B47] transition-colors">
              Prefer WhatsApp directly? Tap here.
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ icon: Icon, title, body }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-[#B68B47]/20 grid place-items-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#B68B47]" />
      </div>
      <div>
        <div className="font-medium text-[#F5EDDF]">{title}</div>
        <div className="text-sm text-[#F5EDDF]/75">{body}</div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label className="text-xs tracking-[0.18em] uppercase text-[#7A6F62] font-semibold">{children}</label>;
}

function FormField({ label, name, type = "text", placeholder, required }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-[#1F3A2E]/15 bg-[#FBF6EC] px-4 py-3.5 focus:border-[#B68B47] focus:ring-2 focus:ring-[#B68B47]/20 outline-none text-[#2C2A29]"
      />
    </div>
  );
}

// -----------------------------------------
function SiteFooter() {
  return (
    <footer className="bg-[#1F3A2E] text-[#F5EDDF] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-[#B68B47]" />
            <span className="font-serif-display text-2xl">Aham Arogyam</span>
          </div>
          <p className="text-sm text-[#F5EDDF]/75 leading-relaxed mb-5">
            Bringing deep TCM-based care to Rishikesh through clinical treatments, self-healing workshops, and a commitment to whole-body wellness.
          </p>
          <div className="italic font-serif-display text-[#B68B47]">
            &ldquo;अहम् आरोग्यम् — I am health.&rdquo;
          </div>
        </div>
        <div>
          <div className="font-serif-display text-xl mb-5">Contact</div>
          <div className="space-y-3 text-sm text-[#F5EDDF]/80">
            <FootLine icon={MapPin}>Rishikesh–Dehradun belt, Uttarakhand, India</FootLine>
            <FootLine icon={Phone}>+91 70179 52202</FootLine>
            <FootLine icon={Mail}>kavita@ahamarogyam.com</FootLine>
          </div>
        </div>
        <div>
          <div className="font-serif-display text-xl mb-5">Quick Links</div>
          <ul className="space-y-3 text-sm text-[#F5EDDF]/80">
            <li><a href="#about" className="hover:text-[#B68B47] transition-colors">Our Story</a></li>
            <li><a href="#services" className="hover:text-[#B68B47] transition-colors">Clinical Sessions</a></li>
            <li><a href="#workshops" className="hover:text-[#B68B47] transition-colors">Self-Healing Labs</a></li>
            <li>
              <Link to="/quiz" className="hover:text-[#B68B47] transition-colors" data-testid="footer-quiz-link">
                Five Element Quiz
              </Link>
            </li>
            <li><a href="#book" className="hover:text-[#B68B47] transition-colors">Book an Appointment</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-14 pt-6 border-t border-[#F5EDDF]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5EDDF]/60">
        <div>© {new Date().getFullYear()} Aham Arogyam. All rights reserved.</div>
        <div className="tracking-[0.22em] uppercase">Designed for natural healing.</div>
      </div>
    </footer>
  );
}

function FootLine({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-0.5 text-[#B68B47]" />
      <div>{children}</div>
    </div>
  );
}
