import { Shield, Target, Heart, Award } from "lucide-react";

const timeline = [
  { year: "2025 July", event: "Cryptaris founded with a mission to democratize encryption." },
  { year: "2025 September", event: "Launched core platform with text and document encryption." },
  { year: "2025 December", event: "Expanded to multimedia encryption and steganography." },
  { year: "2026 January", event: "Reached 1M+ encrypted files processed globally." },
  { year: "2026 February", event: "Enterprise solutions and platform launch." },
];

const values = [
  { icon: Shield, title: "Security", desc: "Every decision starts with security. We never compromise on protecting your data." },
  { icon: Target, title: "Simplicity", desc: "Powerful encryption shouldn't require expertise. We make it accessible to everyone." },
  { icon: Heart, title: "Privacy", desc: "Zero-knowledge architecture means we never see your data. Period." },
  { icon: Award, title: "Trust", desc: "Transparency in our methods, audited code, and verifiable security standards." },
];

const About = () => (
  <div>
    {/* Mission */}
    <section className="section-padding min-h-[60vh] flex items-center">
      <div className="container-tight">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4 animate-fade-up">
            About Cryptaris
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] animate-fade-up-delay-1">
            Making encryption
            <br />
            accessible to everyone.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl animate-fade-up-delay-2">
            We believe privacy is a fundamental right. Cryptaris was built to give everyone
            access to military-grade encryption without the complexity.
          </p>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
          Our principles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.title} className="glass-card-hover p-8">
              <v.icon className="text-primary mb-4" size={28} strokeWidth={1.5} />
              <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-padding">
      <div className="container-tight max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
          Our journey
        </h2>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div key={t.year} className="flex gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-2">
                <span className="text-sm font-bold text-primary">{t.year}</span>
                <p className="text-sm text-muted-foreground mt-1">{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Credibility */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Built on open standards
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Cryptaris uses AES-256, RSA-4096, and SHA-3 algorithms — the same standards
          trusted by banks, governments, and defense organizations worldwide. Our
          codebase is regularly audited by independent security researchers.
        </p>
      </div>
    </section>
  </div>
);

export default About;
