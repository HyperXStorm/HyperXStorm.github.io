import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/api";
import { ADMIN } from "@/constants/testIds";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/admin");
    } catch (err) {
      const msg = formatApiErrorDetail(err.response?.data?.detail) || err.message;
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid place-items-center px-6 py-14">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#E2DFD8]/60 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-8 sm:p-10">
          <div className="w-12 h-12 rounded-full bg-[#EAF0E5] grid place-items-center mb-6">
            <Lock className="w-5 h-5 text-[#3E533B]" />
          </div>
          <h1 className="font-serif-display text-3xl text-[#243021] font-medium mb-2">
            Clinic Admin
          </h1>
          <p className="text-sm text-[#6A6865] mb-8">
            Sign in to view quiz submissions and leads.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-xs tracking-[0.18em] uppercase text-[#8A7965] font-bold mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ahamarogyam.com"
                data-testid={ADMIN.email}
                required
                className="rounded-xl border-[#E2DFD8] bg-[#FDFCFA] py-6 focus-visible:ring-2 focus-visible:ring-[#3E533B]/30 focus-visible:border-[#3E533B]"
              />
            </div>
            <div>
              <Label className="text-xs tracking-[0.18em] uppercase text-[#8A7965] font-bold mb-2 block">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                data-testid={ADMIN.password}
                required
                className="rounded-xl border-[#E2DFD8] bg-[#FDFCFA] py-6 focus-visible:ring-2 focus-visible:ring-[#3E533B]/30 focus-visible:border-[#3E533B]"
              />
            </div>
            {errorMsg && (
              <div
                role="alert"
                data-testid="admin-login-error"
                className="rounded-xl border border-[#B05B43]/30 bg-[#F8E7E0] text-[#8E3F2C] px-4 py-3 text-sm"
              >
                {errorMsg}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              data-testid={ADMIN.loginBtn}
              className="w-full rounded-full bg-[#3E533B] hover:bg-[#2C3D2A] text-[#F7F5F0] py-6 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
