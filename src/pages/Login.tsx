import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isSignup, setIsSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterRequest = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/register-request", {
        name,
        email,
        password,
        role: "customer"
      });
      setShowOtp(true);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email,
        otp,
        name,
        password,
        phoneNumber,
        role: "customer",
      });
      toast.success("Registration successful! Please login.");
      setShowOtp(false);
      setIsSignup(false);
      setOtp("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (showOtp) {
        handleVerifyOtp();
      } else {
        if (!name || !email || !password || !phoneNumber) {
          return toast.error("Please fill in all fields");
        }
        handleRegisterRequest();
      }
    } else {
      if (!email || !password) {
        return toast.error("Please fill in all fields");
      }
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-primary-foreground" style={{
              width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
              top: `${10 + i * 15}%`, left: `${5 + i * 12}%`, opacity: 0.1 + i * 0.05,
            }} />
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <Leaf className="w-20 h-20 text-primary-foreground mx-auto mb-6" />
          </motion.div>
          <h1 className="font-display text-5xl font-bold text-primary-foreground mb-4">FreshCart</h1>
          <p className="text-primary-foreground/80 text-lg max-w-sm mx-auto">
            Farm-fresh vegetables and fruits delivered to your doorstep. Shop healthy, live happy.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">
              Fresh<span className="text-accent">Cart</span>
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {isSignup ? (showOtp ? "Verify OTP" : "Create Account") : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignup
              ? showOtp
                ? `Enter the code sent to ${email}`
                : "Sign up to start shopping fresh"
              : "Sign in to continue shopping"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!showOtp ? (
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {isSignup && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                  {isSignup && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="9876543210"
                        required
                        className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-field"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center py-4"
                >
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-12 h-14 text-lg border-2 rounded-xl" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-lg border-2 rounded-xl" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-lg border-2 rounded-xl" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-lg border-2 rounded-xl" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-lg border-2 rounded-xl" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-lg border-2 rounded-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="mt-6 text-sm text-primary font-medium hover:underline"
                  >
                    Back to registration
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || (showOtp && otp.length !== 6)}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSignup ? (showOtp ? "Verify OTP" : "Register") : "Sign In"}
            </button>
          </form>

          {!showOtp && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignup(!isSignup); setOtp(""); }}
                className="text-primary font-semibold hover:underline"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

