import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Leaf,
  Flame,
  Mountain,
  Wind,
  Waves,
  Share2,
  Copy,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ELEMENTS, QUESTIONS } from "@/lib/quizData";
import { api, formatApiErrorDetail } from "@/lib/api";
import { LEAD, QUIZ } from "@/constants/testIds";

const elementIcons = { wood: Leaf, fire: Flame, earth: Mountain, metal: Wind, water: Waves };

const BOOKING_URL = "https://wa.me/917017952202?text=" + encodeURIComponent(
  "Hello Aham Arogyam, I'd like to book a TCM consultation."
);

export default function Quiz() {
  // stages: "quiz" → "lead" → "result"
  const [stage, setStage] = useState("quiz");

  const [qIdx, setQIdx] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [answers, setAnswers] = useState({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);

  const totalQ = QUESTIONS.length;
  const currentQ = QUESTIONS[qIdx];
  const progress = ((qIdx + (answers[currentQ?.id] ? 1 : 0)) / totalQ) * 100;

  const ageNum = age ? parseInt(age, 10) : null;
  const canSubmitLead =
    name.trim() && email.trim() && ageNum && ageNum > 0 && ageNum < 120 && gender;

  const selectAnswer = (element) => setAnswers((p) => ({ ...p, [currentQ.id]: element }));

  const handleQuizNext = () => {
    if (!answers[currentQ.id]) {
      toast.error("Please select an answer to continue.");
      return;
    }
    if (qIdx < totalQ - 1) {
      setDirection(1);
      setQIdx(qIdx + 1);
    } else {
      setStage("lead");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (qIdx > 0) {
      setDirection(-1);
      setQIdx(qIdx - 1);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmitLead) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/quiz/submit", {
        name: name.trim(),
        email: email.trim(),
        age: ageNum,
        gender,
        location: location.trim() || null,
        answers: QUESTIONS.map((q) => ({ question_id: q.id, element: answers[q.id] })),
      });
      setResult(data);
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setStage("quiz");
    setQIdx(0);
    setDirection(1);
    setAnswers({});
    setResult(null);
  };

  if (stage === "lead") {
    return (
      <LeadForm
        name={name} setName={setName} email={email} setEmail={setEmail}
        age={age} setAge={setAge} gender={gender} setGender={setGender}
        location={location} setLocation={setLocation}
        canSubmit={canSubmitLead} submitting={submitting}
        onSubmit={handleLeadSubmit} onBack={() => setStage("quiz")}
      />
    );
  }

  if (stage === "result" && result) {
    return <ResultView result={result} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F5EDDF] py-12 lg:py-16 px-6 overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10" data-testid={QUIZ.progress}>
          <div className="flex items-center justify-between text-xs tracking-[0.22em] uppercase text-[#7A6F62] mb-3">
            <span>Question {qIdx + 1} of {totalQ}</span>
            <span>{Math.round((qIdx / totalQ) * 100)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-[#E6DCC7] [&>div]:bg-[#B68B47] [&>div]:transition-[width] [&>div]:duration-700 [&>div]:ease-out" />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0.24, 1] }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-[#1F3A2E] font-medium leading-snug tracking-tight mb-10"
            >
              {currentQ.text}
            </motion.h2>

            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const selected = answers[currentQ.id] === opt.element;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    data-testid={QUIZ.option(currentQ.id, idx)}
                    onClick={() => selectAnswer(opt.element)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.06, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className={`w-full text-left rounded-xl border px-5 py-4 transition-colors duration-300 flex items-center gap-4 ${
                      selected
                        ? "bg-[#1F3A2E] text-[#F5EDDF] border-[#1F3A2E] shadow-[0_8px_24px_rgba(31,58,46,0.25)]"
                        : "bg-white border-[#1F3A2E]/15 hover:border-[#B68B47]/60 hover:bg-[#FBF6EC]"
                    }`}
                  >
                    <motion.div
                      animate={selected ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className={`w-7 h-7 rounded-full border grid place-items-center flex-shrink-0 ${
                        selected ? "bg-[#B68B47] border-[#B68B47]" : "border-[#B68B47]/40"
                      }`}
                    >
                      {selected && <Check className="w-4 h-4 text-white" />}
                    </motion.div>
                    <span className={selected ? "text-[#F5EDDF]" : "text-[#2C2A29]"}>{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button
            type="button" variant="ghost" onClick={handleBack} disabled={qIdx === 0}
            data-testid={QUIZ.back}
            className="rounded-full text-[#1F3A2E] hover:bg-[#FBF6EC] disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            type="button" onClick={handleQuizNext}
            data-testid={QUIZ.next}
            className="rounded-full bg-[#1F3A2E] hover:bg-[#152A21] text-[#F5EDDF] px-8 py-5 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            {qIdx === totalQ - 1 ? "Continue" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ----------------- LEAD FORM (AFTER QUIZ) -----------------
function LeadForm({
  name, setName, email, setEmail, age, setAge, gender, setGender,
  location, setLocation, canSubmit, submitting, onSubmit, onBack,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0.24, 1] }}
      className="min-h-[calc(100vh-80px)] bg-[#F5EDDF] py-12 lg:py-20 px-6"
    >
      <div className="max-w-xl mx-auto">
        <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4">
          One last step · Your reading is ready
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1F3A2E] font-medium leading-tight tracking-tight mb-4">
          Where should we send your <em className="italic text-[#B68B47] font-normal">Five Element reading?</em>
        </h1>
        <p className="text-[#4A4846] mb-10 leading-relaxed">
          A few quiet details so we can personalise your result. We treat your information with care — never shared, never sold.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <Field label="Full name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" data-testid={LEAD.name}
              className="rounded-xl border-[#1F3A2E]/15 bg-white px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#B68B47]/30 focus-visible:border-[#B68B47]" />
          </Field>
          <Field label="Email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" data-testid={LEAD.email}
              className="rounded-xl border-[#1F3A2E]/15 bg-white px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#B68B47]/30 focus-visible:border-[#B68B47]" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Age" required>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={119}
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 32"
                data-testid={LEAD.age}
                className="rounded-xl border-[#1F3A2E]/15 bg-white px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#B68B47]/30 focus-visible:border-[#B68B47]"
              />
            </Field>
            <Field label="Gender" required>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger data-testid={LEAD.genderTrigger}
                  className="rounded-xl border-[#1F3A2E]/15 bg-white py-6 focus:ring-2 focus:ring-[#B68B47]/30">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="City / Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru, India" data-testid={LEAD.location}
              className="rounded-xl border-[#1F3A2E]/15 bg-white px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#B68B47]/30 focus-visible:border-[#B68B47]" />
          </Field>

          <p className="text-xs text-[#7A6F62] leading-relaxed">
            🔒 Your details stay between you and our clinic team — used only to personalise your reading.
          </p>

          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={onBack}
              className="rounded-full text-[#1F3A2E] hover:bg-[#FBF6EC]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button type="submit" disabled={!canSubmit || submitting} data-testid={LEAD.submit}
              className="flex-1 rounded-full bg-[#B68B47] hover:bg-[#9A7536] text-white py-6 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              {submitting ? "Reading the elements…" : "Reveal My Element"}
              {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <Label className="text-xs tracking-[0.18em] uppercase text-[#7A6F62] font-semibold mb-2 block">
        {label} {required && <span className="text-[#B68B47]">·</span>}
      </Label>
      {children}
    </div>
  );
}

// ----------------- RESULT -----------------
function ResultView({ result, onRestart }) {
  const el = ELEMENTS[result.dominant_element];
  const Icon = elementIcons[result.dominant_element];
  const total = Object.values(result.scores).reduce((s, v) => s + v, 0);
  const shareText = `I just discovered I'm a ${el.name} element type (${el.chinese}) — "${el.tagline}" — on the Aham Arogyam TCM Quiz! ✨`;
  const shareUrl = window.location.origin;

  useEffect(() => {
    // soft singing-bowl chime on reveal
    import("@/lib/chime").then((m) => m.playResultChime());
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    toast.success("Result copied to clipboard");
  };

  const ease = [0.32, 0.72, 0.24, 1];
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <div
      className="min-h-[calc(100vh-80px)] py-14 lg:py-20 px-6 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${el.bg}80 0%, #F5EDDF 60%)` }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4"
          >
            Your dominant element
          </motion.div>
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.15, type: "spring", stiffness: 90, damping: 14 }}
            className="w-28 h-28 mx-auto rounded-full grid place-items-center mb-6 shadow-[0_20px_60px_rgba(31,58,46,0.12)] border border-white/60"
            style={{ background: el.bg }}
          >
            <div className="text-center">
              <Icon className="w-7 h-7 mx-auto mb-1" style={{ color: el.accent }} />
              <div className="font-serif-display text-3xl" style={{ color: el.accent }}>{el.chinese}</div>
            </div>
          </motion.div>
          <motion.h1
            {...fadeUp(0.45)}
            className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#1F3A2E] font-normal leading-none tracking-tight mb-2"
          >
            {el.name}
          </motion.h1>
          <motion.div
            {...fadeUp(0.6)}
            className="text-base sm:text-lg text-[#B68B47] italic font-serif-display"
          >
            {el.tagline}
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.75)} className="bg-white rounded-2xl border border-[#1F3A2E]/8 shadow-[0_8px_30px_rgba(31,58,46,0.05)] p-8 sm:p-10 mb-8">
          <p className="text-[#2C2A29] text-lg leading-relaxed mb-8">{el.description}</p>
          <div className="grid sm:grid-cols-2 gap-8">
            <Block title="Your Strengths" items={el.strengths} accent="#1F3A2E" />
            <Block title="Watch for Imbalance" items={el.imbalance} accent="#B68B47" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#1F3A2E]/10">
            <MetaRow label="Season" value={el.season} />
            <MetaRow label="Organ System" value={el.organ} />
            <MetaRow label="Emotion" value={el.emotion} />
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.9)} className="bg-white rounded-2xl border border-[#1F3A2E]/8 p-8 sm:p-10 mb-8">
          <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-4">
            Personalised wellness tips
          </div>
          <ul className="space-y-4">
            {el.tips.map((t, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + i * 0.08, ease }}
                className="flex gap-4"
              >
                <span className="w-7 h-7 rounded-full grid place-items-center flex-shrink-0 font-serif-display text-sm bg-[#FBF6EC] text-[#B68B47]">
                  {i + 1}
                </span>
                <span className="text-[#2C2A29] leading-relaxed">{t}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp(1.05)} className="bg-white rounded-2xl border border-[#1F3A2E]/8 p-8 sm:p-10 mb-8">
          <div className="text-[11px] tracking-[0.28em] uppercase text-[#B68B47] font-semibold mb-5">
            Your element distribution
          </div>
          <div className="space-y-3">
            {Object.entries(result.scores).map(([k, v], idx) => {
              const e = ELEMENTS[k];
              const pct = total ? Math.round((v / total) * 100) : 0;
              return (
                <div key={k} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-[#4A4846]">{e.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-[#FBF6EC] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.1, delay: 1.15 + idx * 0.1, ease }}
                      className="h-full rounded-full"
                      style={{ background: e.color }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm font-medium text-[#1F3A2E]">{pct}%</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div {...fadeUp(1.2)} className="rounded-2xl p-8 sm:p-10 text-center mb-6 bg-[#1F3A2E] text-[#F5EDDF]">
          <div className="font-serif-display text-2xl sm:text-3xl mb-3 leading-tight">
            Ready to bring your {el.name} energy back into balance?
          </div>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Book a one-on-one consultation with our TCM practitioners at Aham Arogyam. We&rsquo;ll design a personalised herbal, lifestyle &amp; acupuncture protocol just for you.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-testid={QUIZ.bookAppointment}
            className="inline-flex items-center gap-3 rounded-full bg-[#B68B47] hover:bg-[#9A7536] text-white px-8 py-4 font-medium hover:-translate-y-0.5 transition-all shadow-md">
            Book my appointment <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div {...fadeUp(1.35)} className="bg-white border border-[#1F3A2E]/10 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#4A4846] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#B68B47]" /> Share your element with friends
            </div>
            <div className="flex items-center gap-3">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer"
                data-testid={QUIZ.shareWa}
                className="rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-medium hover:-translate-y-0.5 transition-all">WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                data-testid={QUIZ.shareTwitter}
                className="rounded-full bg-[#1F3A2E] text-[#F5EDDF] px-5 py-2.5 text-sm font-medium hover:-translate-y-0.5 transition-all">Twitter</a>
              <button type="button" onClick={handleCopy} data-testid={QUIZ.shareCopy}
                className="rounded-full border border-[#1F3A2E] text-[#1F3A2E] px-5 py-2.5 text-sm font-medium hover:bg-[#1F3A2E] hover:text-[#F5EDDF] transition-all inline-flex items-center gap-2">
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(1.5)} className="text-center">
          <button type="button" onClick={onRestart} data-testid={QUIZ.restart}
            className="inline-flex items-center gap-2 text-sm text-[#7A6F62] hover:text-[#B68B47] transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Retake the quiz
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Block({ title, items, accent }) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.22em] uppercase text-[#B68B47] font-semibold mb-3">{title}</div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 text-[#2C2A29]">
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.22em] uppercase text-[#7A6F62] mb-1">{label}</div>
      <div className="text-sm text-[#1F3A2E] font-medium">{value}</div>
    </div>
  );
}
