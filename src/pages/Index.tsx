import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Zap, CheckCircle, ArrowRight, Quote } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const features = [
  { icon: Shield, title: "Military-Grade Encryption", desc: "256-bit AES encryption protects your data with the same standard used by governments worldwide." },
  { icon: Lock, title: "Zero-Knowledge Architecture", desc: "We never see your data. Your encryption keys stay with you, always." },
  { icon: Eye, title: "Privacy First", desc: "No tracking, no logs, no compromise. Your privacy is our foundation." },
  { icon: Zap, title: "Lightning Fast", desc: "Encrypt and decrypt files in seconds with our optimized processing engine." },
];

const steps = [
  { num: "01", title: "Upload", desc: "Drag & drop your file or paste your text into the secure interface." },
  { num: "02", title: "Encrypt", desc: "Choose your encryption method and strength. We handle the rest." },
  { num: "03", title: "Download", desc: "Get your encrypted file with a secure key. Share safely." },
];

const testimonials = [
  { name: "Sarah Chen", role: "CTO, DataFlow", quote: "Cryptaris transformed how we handle sensitive client data. Simple, secure, elegant." },
  { name: "Marcus Webb", role: "Security Lead, Finova", quote: "Finally an encryption platform that doesn't require a PhD to operate." },
  { name: "Aisha Patel", role: "Founder, PrivacyLab", quote: "The gold standard for file encryption. We trust Cryptaris with everything." },
];

const Index = () => (
  <div>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center section-padding overflow-hidden">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
      <div className="container-tight relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up">
            Security made
            <br />
            <span className="text-gradient">beautifully simple.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up-delay-1">
            Protect your files, text, and communications with enterprise-grade encryption — no complexity required.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up-delay-2">
            <Link
              to="/encrypt"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Encrypt Now <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm transition-all duration-300 hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>


    {/* Features */}
    <section className="section-padding">
      <div className="container-tight">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Cryptaris?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for those who value both security and simplicity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass-card-hover p-8 animate-fade-up-delay-${Math.min(i, 3) as 0 | 1 | 2 | 3}`}
            >
              <f.icon className="text-primary mb-4" size={28} strokeWidth={1.5} />
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three steps. That's all it takes.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <span className="text-5xl font-bold text-primary/20">{s.num}</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* AI Security Tools */}
    <section className="section-padding">
      <div className="container-tight">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            AI-Powered Defense
          </h2>
          <p className="mt-4 text-muted-foreground">
            Advanced tools to outsmart attackers and analyze threats.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 flex flex-col items-start bg-blue-500/5 border-blue-500/10">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Intelligent Password Analysis</h3>
            <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
              Don't just count characters. Our AI analyzes keyboard patterns, common substitutions, and estimated crack times to ensure your password is truly secure.
            </p>
            <Link to="/encrypt/document" className="text-primary font-medium hover:underline inline-flex items-center gap-2 text-sm">
              Try it in Encryption <ArrowRight size={16} />
            </Link>
          </div>
          <div className="glass-card p-8 flex flex-col items-start bg-purple-500/5 border-purple-500/10">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg mb-4">
              <Eye size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Decoy Document Generator</h3>
            <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
              Forced to decrypt? Generate realistic fake financial records, corporate data, or personal diaries to mislead attackers and protect your real data.
            </p>
            <Link to="/tools/decoy" className="text-primary font-medium hover:underline inline-flex items-center gap-2 text-sm">
              Generate Decoy <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
          What people say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-8">
              <Quote className="text-primary/30 mb-4" size={24} />
              <p className="text-sm leading-relaxed mb-6">{t.quote}</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding">
      <div className="container-tight">
        <div className="glass-card p-12 md:p-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to secure your data?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start encrypting your files in seconds. No account required.
          </p>
          <Link
            to="/encrypt"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Index;
