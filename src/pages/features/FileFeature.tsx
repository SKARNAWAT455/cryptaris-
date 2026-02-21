import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { File, Music, Video, Image, Upload, Lock, Unlock, ArrowRight, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import FeatureLayout from "@/components/FeatureLayout";
import FeatureInfo from "@/components/FeatureInfo";
import SecurePasswordInput from "@/components/SecurePasswordInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { processFile } from "@/lib/api";

interface FileFeatureProps {
    type: "document" | "audio" | "video" | "image";
    mode: "encrypt" | "decrypt";
}

const icons = {
    document: File,
    audio: Music,
    video: Video,
    image: Image,
};

const titles = {
    document: "Document",
    audio: "Audio",
    video: "Video",
    image: "Image",
};

const fileTypes = {
    document: ".pdf,.doc,.docx,.txt,.csv",
    audio: "audio/*",
    video: "video/*",
    image: "image/*",
};

const FileFeature = ({ type, mode }: FileFeatureProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [complete, setComplete] = useState(false);
    const [password, setPassword] = useState("");
    const { toast } = useToast();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.file) {
            setFile(location.state.file);
            setComplete(false);
            setProgress(0);
            // Clear state to prevent re-processing on refresh (optional, but good UX)
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const Icon = icons[type];
    const title = `${titles[type]} ${mode === "encrypt" ? "Encryption" : "Decryption"}`;
    const description = mode === "encrypt"
        ? `Secure your ${type}s with advanced encryption.`
        : `Restore your encrypted ${type}s to their original format.`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setComplete(false);
            setProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];

            // Basic validation for drop (HTML accept doesn't block drops)
            if (mode === "encrypt") {
                const isValidType =
                    (type === "audio" && droppedFile.type.startsWith("audio/")) ||
                    (type === "video" && droppedFile.type.startsWith("video/")) ||
                    (type === "image" && droppedFile.type.startsWith("image/")) ||
                    (type === "document" && !droppedFile.type.startsWith("audio/") && !droppedFile.type.startsWith("video/") && !droppedFile.type.startsWith("image/"));

                if (!isValidType) {
                    toast({ title: "Invalid File Type", description: `Please upload a valid ${type} file.`, variant: "destructive" });
                    return;
                }
            }

            setFile(droppedFile);
            setComplete(false);
            setProgress(0);
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);

        try {
            const resultBlob = await processFile(file, password, mode);

            // Create download link
            const url = window.URL.createObjectURL(resultBlob);
            const link = document.createElement('a');
            link.href = url;
            // Simple name logic
            link.download = mode === "encrypt" ? `enc_${file.name}.cryptaris` : `dec_${file.name.replace('.cryptaris', '')}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setComplete(true);
            toast({
                title: mode === "encrypt" ? "Encryption Complete" : "Decryption Complete",
                description: `${file.name} has been processed successfully.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setProgress(100);
        }
    };

    return (
        <FeatureLayout
            title={title}
            description={description}
            icon={Icon}
            backLink={mode === "encrypt" ? "/encrypt" : "/decrypt"}
        >
            <div className="max-w-2xl mx-auto space-y-8">
                <div
                    className="border-2 border-dashed border-input rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-upload")?.click()}
                >
                    {file && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                setComplete(false);
                                setProgress(0);
                            }}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept={mode === "encrypt" ? fileTypes[type] : ".cryptaris"}
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                            <Upload size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {file ? file.name : "Drop file here or click to browse"}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `Supports all ${type} formats`}
                            </p>
                        </div>
                    </div>
                </div>

                {file && !complete && (
                    <div className="space-y-4 animate-fade-in">
                        <SecurePasswordInput
                            value={password}
                            onChange={setPassword}
                            showStrength={mode === 'encrypt'}
                        />

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleProcess}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing... {progress}%
                                </>
                            ) : (
                                <>
                                    {mode === "encrypt" ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
                                    {mode === "encrypt" ? "Encrypt File" : "Decrypt File"}
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {complete && (
                    <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-center space-y-4 animate-fade-in">
                        <div className="flex justify-center text-green-500">
                            <CheckCircle size={48} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-500">
                                Success!
                            </h3>
                            <p className="text-muted-foreground mt-2">
                                Your file is ready for download.
                            </p>
                        </div>
                        <Button className="gap-2" variant="outline">
                            Download {mode === "encrypt" ? "Encrypted" : "Decrypted"} File
                            <ArrowRight size={16} />
                        </Button>
                        <Button variant="ghost" onClick={() => { setFile(null); setComplete(false); }}>
                            Process another file
                        </Button>
                    </div>
                )}
            </div>

            <FeatureInfo
                title={`About ${title}`}
                description={mode === "encrypt"
                    ? `Our "System-Bound" encryption ensures that your ${type} files are locked to this specific system instance. We use a double-layer encryption triggers: first with your password, and second with a unique system master key.`
                    : `Decryption requires both your password and the original system environment. This prevents stolen files from being opened on unauthorized devices, adding a physical layer of security to your digital assets.`}
                steps={mode === "encrypt" ? [
                    `Select your ${type} file.`,
                    "Enter a password to create the first layer of security.",
                    "The system applies a second layer using the machine's unique master key.",
                    "A custom header is added to identify the file format.",
                    "Download your .cryptaris encrypted file."
                ] : [
                    "Upload the .cryptaris file.",
                    "Enter your password.",
                    "The system first checks the file integrity and system signature.",
                    "If the file belongs to this system, it peels back the second layer.",
                    "Your password decrypts the final layer to restore the original file."
                ]}
            />
        </FeatureLayout>
    );
};

export default FileFeature;
