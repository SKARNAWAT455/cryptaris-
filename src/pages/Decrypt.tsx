import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, File, Music, Video, Image, EyeOff, Link2, Upload, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const services = [
  { icon: FileText, title: "Text Decryption", desc: "Decrypt encoded messages and text content instantly.", href: "/decrypt/text" },
  { icon: File, title: "Document Decryption", desc: "Restore encrypted PDFs, spreadsheets, and documents.", href: "/decrypt/document" },
  { icon: Music, title: "Audio Decryption", desc: "Decode protected audio files back to their original format.", href: "/decrypt/audio" },
  { icon: Video, title: "Video Decryption", desc: "Restore encrypted video content with full fidelity.", href: "/decrypt/video" },
  { icon: Image, title: "Image Decryption", desc: "Decode encrypted images losslessly.", href: "/decrypt/image" },
  { icon: EyeOff, title: "Steganography Reveal", desc: "Extract hidden data from steganographic images.", href: "/decrypt/steganography" },
  { icon: Link2, title: "Secure Link Access", desc: "Open and decrypt temporary secure download links.", href: "/decrypt/link" },
];

const Decrypt = () => {
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const type = file.type;
      const name = file.name.toLowerCase();

      let targetPath = "/decrypt/document";

      // Smart detection based on type or extension
      if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp)(\.cryptaris)?$/.test(name)) {
        targetPath = "/decrypt/image";
      } else if (type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a)(\.cryptaris)?$/.test(name)) {
        targetPath = "/decrypt/audio";
      } else if (type.startsWith("video/") || /\.(mp4|mov|avi|mkv)(\.cryptaris)?$/.test(name)) {
        targetPath = "/decrypt/video";
      }

      toast({
        title: "File Detected",
        description: `Redirecting to ${targetPath.split('/').pop()} decryption...`,
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
        const name = file.name.toLowerCase();

        let targetPath = "/decrypt/document";
        if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp)(\.cryptaris)?$/.test(name)) {
          targetPath = "/decrypt/image";
        } else if (type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a)(\.cryptaris)?$/.test(name)) {
          targetPath = "/decrypt/audio";
        } else if (type.startsWith("video/") || /\.(mp4|mov|avi|mkv)(\.cryptaris)?$/.test(name)) {
          targetPath = "/decrypt/video";
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
            Decryption Services
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-up-delay-1">
            Decrypt securely.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl animate-fade-up-delay-2">
            Upload your encrypted file and provide your key to restore the original content.
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
            <p className="font-semibold mb-1">Drop encrypted file here</p>
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

export default Decrypt;
