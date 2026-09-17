import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { DEMO_USER, FRESH_USER } from "../lib/storageEngine"
import api from "../lib/axios"
import { Sparkles, PlayCircle, ShieldCheck, ArrowRight, Wallet } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export default function Login() {
  const navigate = useNavigate()
  const { setAuth, switchAccount } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [isQuickLogging, setIsQuickLogging] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@finflow.com", password: "demo" },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setError(null)
      const { data } = await api.post("/auth/login", values)
      setAuth(data.user, data.accessToken)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Login failed. Check your email & password.")
    }
  }

  const handleQuickLogin = async (type: 'demo' | 'fresh') => {
    setIsQuickLogging(type)
    setError(null)
    try {
      switchAccount(type)
      navigate("/dashboard")
    } catch {
      setError("Could not launch account.")
    } finally {
      setIsQuickLogging(null)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm mb-2">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
            FinFlow
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Choose an interface to get started, or sign in with your credentials.
          </p>
        </div>

        {/* Dual Mode Quick Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Demo Account */}
          <div 
            onClick={() => handleQuickLogin('demo')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-card hover:border-emerald-500 p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <PlayCircle className="h-3.5 w-3.5" /> Demo Account
              </span>
              <span className="text-xs text-muted-foreground font-mono">1-Month Data</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {DEMO_USER.firstName} {DEMO_USER.lastName}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              Pre-loaded with 30+ transactions, dynamic cashflow & category charts, shared pods, and rules.
            </p>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span>{isQuickLogging === 'demo' ? "Launching..." : "Explore Demo Mode"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Fresh Account */}
          <div 
            onClick={() => handleQuickLogin('fresh')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-card hover:border-blue-500 p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" /> Fresh Account
              </span>
              <span className="text-xs text-muted-foreground font-mono">Clean Slate</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {FRESH_USER.firstName} {FRESH_USER.lastName}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              A brand-new, clean canvas with 0 transactions. Ready for personal expense tracking from scratch.
            </p>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
              <span>{isQuickLogging === 'fresh' ? "Launching..." : "Start Fresh"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="rounded-2xl bg-card p-6 shadow-sm border border-border space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Or Sign In With Email
            </span>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email Address</label>
              <input 
                {...form.register("email")} 
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                placeholder="demo@finflow.com" 
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <div className="flex gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => {
                      form.setValue("email", DEMO_USER.email)
                      form.setValue("password", "demo123")
                    }}
                    className="text-emerald-600 hover:underline"
                  >
                    Demo Pwd
                  </button>
                  <span>•</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      form.setValue("email", FRESH_USER.email)
                      form.setValue("password", "user123")
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Fresh Pwd
                  </button>
                </div>
              </div>
              <input 
                type="password"
                {...form.register("password")} 
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={form.formState.isSubmitting} 
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in to FinFlow"}
            </button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Want to create a custom account?{" "}
            <Link to="/register" className="font-medium text-primary underline hover:text-primary/80">
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
