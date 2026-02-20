import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { sendContactMessage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      await sendContactMessage(data.name, data.email, data.message);
      setSent(true);
      toast({
        title: "Message Sent",
        description: "We'll get back to you shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="container-tight max-w-xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4 animate-fade-up">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-up-delay-1">
              Get in touch
            </h1>
            <p className="mt-4 text-muted-foreground animate-fade-up-delay-2">
              Have questions about our services? We'd love to hear from you.
            </p>
          </div>

          <div className="glass-card p-8 md:p-10 animate-fade-up-delay-3">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-primary mb-4" size={48} strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                <p className="text-sm text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-primary font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  {sending ? (
                    <>Sending...</>
                  ) : (
                    <>Send Message <Send size={14} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
