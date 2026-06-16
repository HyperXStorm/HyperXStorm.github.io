import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowLeft,
  CalendarIcon,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ELEMENTS, QUESTIONS } from "@/lib/quizData";
import { api, formatApiErrorDetail } from "@/lib/api";
import { LEAD, QUIZ, HOME } from "@/constants/testIds";

const elementIcons = {
  wood: Leaf,
  fire: Flame,
  earth: Mountain,
  metal: Wind,
  water: Waves,
};

// Placeholder booking link — clinic can update later
const BOOKING_URL = "https://wa.me/919999999999?text=" + encodeURIComponent(
  "Hello Aham Arogyam, I'd like to book a TCM consultation."
);

function calcAge(dobIso) {
  if (!dobIso) return null;
  const d = new Date(dobIso);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function Quiz() {
  const navigate = useNavigate();
  // stages: "lead" → "quiz" → "result"
  const [stage, setStage] = useState("lead");

  // Lead form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(null); // Date
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  // Quiz
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // {qid: element}
  const [submitting, setSubmitting] = useState(false);

  // Result
  const [result, setResult] = useState(null);

  const totalQ = QUESTIONS.length;
  const currentQ = QUESTIONS[qIdx];
  const progress = stage === "quiz" ? ((qIdx + (answers[currentQ?.id] ? 1 : 0)) / totalQ) * 100 : 0;

  const canSubmitLead = name.trim() && email.trim() && dob && gender;

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!canSubmitLead) {
      toast.error("Please complete all required fields.");
      return;
    }
    setLeadSubmitting(true);
    setTimeout(() => {
      setLeadSubmitting(false);
      setStage("quiz");
    }, 300);
  };

  const selectAnswer = (element) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: element }));
  };

  const handleNext = async () => {
    if (!answers[currentQ.id]) {
      toast.error("Please select an answer to continue.");
      return;
    }
    if (qIdx < totalQ - 1) {
      setQIdx(qIdx + 1);
      return;
    }
    // Submit
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        dob: dob ? dob.toISOString().slice(0, 10) : null,
        age: calcAge(dob),
        gender,
        location: location.trim() || null,
        answers: QUESTIONS.map((q) => ({
          question_id: q.id,
          element: answers[q.id],
        })),
      };
      const { data } = await api.post("/quiz/submit", payload);
      setResult(data);
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (qIdx > 0) setQIdx(qIdx - 1);
    else setStage("lead");
  };

  const handleRestart = () => {
    setStage("lead");
    setQIdx(0);
    setAnswers({});
    setResult(null);
  };

  // -------------- STAGES --------------
  if (stage === "lead") {
    return (
      <LeadForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        dob={dob}
        setDob={setDob}
        gender={gender}
        setGender={setGender}
        location={location}
        setLocation={setLocation}
        canSubmit={canSubmitLead}
        submitting={leadSubmitting}
        onSubmit={handleLeadSubmit}
      />
    );
  }

  if (stage === "result" && result) {
    return <ResultView result={result} onRestart={handleRestart} />;
  }

  // QUIZ
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 lg:py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-10" data-testid={QUIZ.progress}>
          <div className="flex items-center justify-between text-xs tracking-[0.22em] uppercase text-[#8A7965] mb-3">
            <span>Question {qIdx + 1} of {totalQ}</span>
            <span>{Math.round((qIdx / totalQ) * 100)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-[#E2DFD8]" />
        </div>

        <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-[#243021] font-medium leading-snug tracking-tight mb-10">
          {currentQ.text}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const selected = answers[currentQ.id] === opt.element;
            return (
              <button
                key={idx}
                type="button"
                data-testid={QUIZ.option(currentQ.id, idx)}
                onClick={() => selectAnswer(opt.element)}
                className={`w-full text-left rounded-xl border px-5 py-4 transition-all duration-300 flex items-center gap-4 ${
                  selected
                    ? "bg-[#3E533B] text-[#F7F5F0] border-[#3E533B] shadow-[0_8px_24px_rgba(62,83,59,0.25)]"
                    : "bg-[#FDFCFA] border-[#E2DFD8] hover:border-[#3E533B]/40 hover:bg-[#EFE9E1]/40"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full border grid place-items-center flex-shrink-0 ${
                    selected ? "bg-white border-white" : "border-[#C8C4BC]"
                  }`}
                >
                  {selected && <Check className="w-4 h-4 text-[#3E533B]" />}
                </div>
                <span className={`text-base ${selected ? "text-[#F7F5F0]" : "text-[#2C2A29]"}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            data-testid={QUIZ.back}
            className="rounded-full text-[#4A4846] hover:bg-[#EFE9E1]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            data-testid={QUIZ.next}
            className="rounded-full bg-[#3E533B] hover:bg-[#2C3D2A] text-[#F7F5F0] px-8 py-5 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            {submitting ? "Reading the elements…" : qIdx === totalQ - 1 ? "See My Element" : "Next"}
            {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------
function LeadForm({
  name, setName, email, setEmail, dob, setDob, gender, setGender, location, setLocation,
  canSubmit, submitting, onSubmit,
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 lg:py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-xs tracking-[0.25em] uppercase text-[#8A7965] font-bold mb-4">
          Step 1 of 2 · A gentle introduction
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#243021] font-medium leading-tight tracking-tight mb-4">
          Before we begin, who are we reading for?
        </h1>
        <p className="text-[#4A4846] mb-10 leading-relaxed">
          A few quiet details help us tailor your Five Element reading. We treat your information with care — never shared, never sold.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <Field label="Full name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              data-testid={LEAD.name}
              className="rounded-xl border-[#E2DFD8] bg-[#FDFCFA] px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#3E533B]/30 focus-visible:border-[#3E533B]"
            />
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-testid={LEAD.email}
              className="rounded-xl border-[#E2DFD8] bg-[#FDFCFA] px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#3E533B]/30 focus-visible:border-[#3E533B]"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Date of birth" required>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    data-testid={LEAD.dobTrigger}
                    className="w-full rounded-xl border border-[#E2DFD8] bg-[#FDFCFA] px-4 py-3.5 text-left flex items-center justify-between hover:border-[#3E533B]/40 transition-colors"
                  >
                    <span className={dob ? "text-[#2C2A29]" : "text-[#8A7965]"}>
                      {dob ? format(dob, "PPP") : "Pick a date"}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-[#8A7965]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDob}
                    captionLayout="dropdown-buttons"
                    fromYear={1925}
                    toYear={new Date().getFullYear()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field label="Gender" required>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger
                  data-testid={LEAD.genderTrigger}
                  className="rounded-xl border-[#E2DFD8] bg-[#FDFCFA] py-6 focus:ring-2 focus:ring-[#3E533B]/30"
                >
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
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, India"
              data-testid={LEAD.location}
              className="rounded-xl border-[#E2DFD8] bg-[#FDFCFA] px-4 py-6 focus-visible:ring-2 focus-visible:ring-[#3E533B]/30 focus-visible:border-[#3E533B]"
            />
          </Field>

          <p className="text-xs text-[#8A7965] leading-relaxed">
            🔒 Your details stay between you and our clinic team. We use them only to personalise your reading and (if you wish) follow up with consultation options.
          </p>

          <Button
            type="submit"
            disabled={!canSubmit || submitting}
            data-testid={LEAD.submit}
            className="w-full rounded-full bg-[#3E533B] hover:bg-[#2C3D2A] text-[#F7F5F0] py-6 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            Continue to the Quiz <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <Label className="text-xs tracking-[0.18em] uppercase text-[#8A7965] font-bold mb-2 block">
        {label} {required && <span className="text-[#B05B43]">·</span>}
      </Label>
      {children}
    </div>
  );
}

// ---------------------------------------------------
function ResultView({ result, onRestart }) {
  const el = ELEMENTS[result.dominant_element];
  const Icon = elementIcons[result.dominant_element];
  const total = Object.values(result.scores).reduce((s, v) => s + v, 0);

  const shareText = `I just discovered I'm a ${el.name} element type (${el.chinese}) — "${el.tagline}" — on the Aham Arogyam TCM Quiz! ✨`;
  const shareUrl = window.location.origin;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    toast.success("Result copied to clipboard");
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] py-14 lg:py-20 px-6"
      style={{ background: `linear-gradient(180deg, ${el.bg}80 0%, #F7F5F0 60%)` }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] uppercase text-[#8A7965] mb-4">
            Your dominant element
          </div>
          <div
            className="w-28 h-28 mx-auto rounded-full grid place-items-center mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white/60"
            style={{ background: el.bg }}
          >
            <div className="text-center">
              <Icon className="w-7 h-7 mx-auto mb-1" style={{ color: el.accent }} />
              <div className="font-serif-display text-3xl" style={{ color: el.accent }}>
                {el.chinese}
              </div>
            </div>
          </div>
          <h1
            className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-none tracking-tight mb-2"
            style={{ color: el.accent }}
          >
            {el.name}
          </h1>
          <div className="text-base sm:text-lg text-[#4A4846] italic font-serif-display">
            {el.tagline}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DFD8]/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 mb-8">
          <p className="text-[#2C2A29] text-lg leading-relaxed mb-8">
            {el.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <Block title="Your Strengths" items={el.strengths} accent={el.accent} />
            <Block title="Watch for Imbalance" items={el.imbalance} accent="#B05B43" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#E2DFD8]/60">
            <MetaRow label="Season" value={el.season} />
            <MetaRow label="Organ System" value={el.organ} />
            <MetaRow label="Emotion" value={el.emotion} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DFD8]/60 p-8 sm:p-10 mb-8">
          <div className="text-xs tracking-[0.22em] uppercase text-[#8A7965] font-bold mb-4">
            Personalised wellness tips
          </div>
          <ul className="space-y-4">
            {el.tips.map((t, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="w-7 h-7 rounded-full grid place-items-center flex-shrink-0 font-serif-display text-sm"
                  style={{ background: el.bg, color: el.accent }}
                >
                  {i + 1}
                </span>
                <span className="text-[#2C2A29] leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Score breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2DFD8]/60 p-8 sm:p-10 mb-8">
          <div className="text-xs tracking-[0.22em] uppercase text-[#8A7965] font-bold mb-5">
            Your element distribution
          </div>
          <div className="space-y-3">
            {Object.entries(result.scores).map(([k, v]) => {
              const e = ELEMENTS[k];
              const pct = total ? Math.round((v / total) * 100) : 0;
              return (
                <div key={k} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-[#4A4846]">{e.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-[#EFE9E1] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: e.color }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm font-medium text-[#243021]">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 sm:p-10 text-center mb-6"
          style={{ background: el.accent, color: "#F7F5F0" }}
        >
          <div className="font-serif-display text-2xl sm:text-3xl mb-3 leading-tight">
            Want to bring your {el.name} energy back into balance?
          </div>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Book a one-on-one consultation with our TCM practitioners at Aham Arogyam. We&apos;ll design a personalised herbal, lifestyle &amp; acupuncture protocol just for you.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={QUIZ.bookAppointment}
            className="inline-flex items-center gap-3 rounded-full bg-white text-[#243021] px-8 py-4 font-medium hover:-translate-y-0.5 transition-all shadow-md"
          >
            Book my appointment <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Share */}
        <div className="bg-[#EFE9E1]/60 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#4A4846] flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share your element with friends
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={QUIZ.shareWa}
                className="rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-medium hover:-translate-y-0.5 transition-all"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={QUIZ.shareTwitter}
                className="rounded-full bg-[#243021] text-[#F7F5F0] px-5 py-2.5 text-sm font-medium hover:-translate-y-0.5 transition-all"
              >
                Twitter
              </a>
              <button
                type="button"
                onClick={handleCopy}
                data-testid={QUIZ.shareCopy}
                className="rounded-full border border-[#243021] text-[#243021] px-5 py-2.5 text-sm font-medium hover:bg-[#243021] hover:text-[#F7F5F0] transition-all inline-flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onRestart}
            data-testid={QUIZ.restart}
            className="inline-flex items-center gap-2 text-sm text-[#6A6865] hover:text-[#3E533B] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake the quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ title, items, accent }) {
  return (
    <div>
      <div className="text-xs tracking-[0.22em] uppercase text-[#8A7965] font-bold mb-3">
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 text-[#2C2A29]">
            <span
              className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accent }}
            />
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
      <div className="text-[10px] tracking-[0.22em] uppercase text-[#8A7965] mb-1">{label}</div>
      <div className="text-sm text-[#243021] font-medium">{value}</div>
    </div>
  );
}
