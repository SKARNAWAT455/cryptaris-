import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, File, Music, Video, Image, EyeOff, Link2, Upload, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const services = [
  { icon: FileText, title: "Text Encryption", desc: "Secure your messages with AES-256-GCM encryption.", href: "/encrypt/text" },
  { icon: File, title: "Document Encryption", desc: "Protect PDFs, Word docs, and other files securely.", href: "/encrypt/document" },
  { icon: Music, title: "Audio Encryption", desc: "Encrypt audio files while preserving quality.", href: "/encrypt/audio" },
  { icon: Video, title: "Video Encryption", desc: "Secure video content with frame-by-frame encryption.", href: "/encrypt/video" },
  { icon: Image, title: "Image Encryption", desc: "Protect images with steganography-compatible encryption.", href: "/encrypt/image" },
  { icon: EyeOff, title: "Steganography", desc: "Hide secret messages inside standard images.", href: "/encrypt/steganography" },
  { icon: Link2, title: "Secure Link", desc: "Generate temporary, self-destructing secure links.", href: "/encrypt/link" },
];

const Encrypt = () => {
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const type = file.type;
      let targetPath = "/encrypt/document";

      if (type.startsWith("image/")) {
        targetPath = "/encrypt/image";
      } else if (type.startsWith("audio/")) {
        targetPath = "/encrypt/audio";
      } else if (type.startsWith("video/")) {
        targetPath = "/encrypt/video";
      }

      toast({
        title: "File Detected",
        description: `Redirecting to ${targetPath.split('/').pop()} encryption...`,
      });

      navigate(targetPath, { state: { file } });
    }
  };

  const handeClickUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const type = file.type;
        let targetPath = "/encrypt/document";

        if (type.startsWith("image/")) {
          targetPath = "/encrypt/image";
        } else if (type.startsWith("audio/")) {
          targetPath = "/encrypt/audio";
        } else if (type.startsWith("video/")) {
          targetPath = "/encrypt/video";
        }
        navigate(targetPath, { state: { file } });
      }
    };
    input.click();
  }

  return (
    <div>
      {/* Header */}
      <section className="section-padding min-h-[40vh] flex items-center">
        <div className="container-tight">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4 animate-fade-up">
            Encryption Services
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-up-delay-1">
            Encrypt everything.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl animate-fade-up-delay-2">
            Choose a service below to start securing your data with military-grade encryption.
          </p>
        </div>
      </section>

      {/* Upload Zone */}
      <section className="section-padding pt-0">
        <div className="container-tight">
          <div
            className={`glass-card border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/5"
              }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={handeClickUpload}
          >
            <Upload className="mx-auto text-muted-foreground mb-4" size={40} strokeWidth={1.5} />
            <p className="font-semibold mb-1">Drop file to encrypt</p>
            <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="section-padding pt-8">
        <div className="container-tight">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.title} to={s.href} className="block">
                <div className="glass-card-hover p-8 group cursor-pointer h-full">
                  <s.icon className="text-primary mb-4" size={28} strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                    Access Tool <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Encrypt;
