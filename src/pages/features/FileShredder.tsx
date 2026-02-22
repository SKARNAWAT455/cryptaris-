import { useState } from "react";
import { Upload, File as FileIcon, Trash2, AlertTriangle, Check, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { shredFile } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface UploadedFile {
    file: File;
    name: string;
    size: number;
    type: string;
}

const FileShredder = () => {
    const [file, setFile] = useState<UploadedFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isShredding, setIsShredding] = useState(false);
    const [passes, setPasses] = useState(3);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile({
                file: droppedFile,
                name: droppedFile.name,
                size: droppedFile.size,
                type: droppedFile.type || "application/octet-stream",
            });
            setIsSuccess(false);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile({
                file: selectedFile,
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type || "application/octet-stream",
            });
            setIsSuccess(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleShred = async () => {
        if (!file) return;

        setIsShredding(true);
        try {
            await shredFile(file.file, passes);

            toast.success("File Shredded Successfully", {
                description: `${file.name} has been securely destroyed.`
            });

            setIsSuccess(true);
            setFile(null);

        } catch (error: any) {
            toast.error("Shredding Failed", {
                description: error.message
            });
        } finally {
            setIsShredding(false);
        }
    };


    return (
        <div className="container-tight py-24 min-h-screen">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-destructive/10 text-destructive mb-4">
                    <Trash2 size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Server File Shredder
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Securely destroy remote payload files. This tool overwrites the uploaded file on our servers multiple times with standard data wiping algorithms, ensuring no trace is left behind. *(Note: This does not delete your local copy).*
                </p>
            </div>

            <div className="space-y-8 animate-fade-up">

                {/* Main Action Area */}
                <div className="glass-panel p-8 rounded-2xl border border-destructive/20 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(var(--destructive) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    {!file && !isSuccess ? (
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                                ? "border-destructive bg-destructive/5"
                                : "border-border hover:border-destructive/50 hover:bg-destructive/5"
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileInput}
                            />
                            <div className="flex flex-col items-center gap-4 pointer-events-none">
                                <div className="p-4 rounded-full bg-secondary text-muted-foreground">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <p className="text-lg font-medium mb-1">
                                        Upload a payload to shred
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        or click to browse
                                    </p>
                                </div>
                                <Button variant="outline" className="hover:bg-destructive hover:text-white transition-colors">
                                    Select File
                                </Button>
                            </div>
                        </div>
                    ) : file ? (
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-border">
                                <div className="p-3 bg-background rounded-md text-destructive">
                                    <FileIcon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium truncate">
                                        {file.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    disabled={isShredding}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 bg-background/50 p-6 rounded-xl border border-destructive/10">
                                <div className="flex items-start gap-3 text-sm text-amber-500/90">
                                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                                    <p><strong>Notice:</strong> This action is irreversible on our servers. The remote file will be permanently destroyed and cannot be recovered by any software.</p>
                                </div>

                                <div className="pt-2">
                                    <label className="text-sm font-medium block mb-2">Security Level (Overwrite Passes)</label>
                                    <select
                                        className="w-full md:w-auto input-field py-2"
                                        value={passes}
                                        onChange={(e) => setPasses(Number(e.target.value))}
                                        disabled={isShredding}
                                    >
                                        <option value={1}>1 Pass (Quick - Standard Deletion + 1 Overwrite)</option>
                                        <option value={3}>3 Passes (Secure - DoD 5220.22-M Style) </option>
                                        <option value={7}>7 Passes (Military Grade - Gutmann Light)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleShred}
                                disabled={isShredding}
                                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300 bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isShredding ? (
                                    <>
                                        <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                        <span>Shredding...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={20} />
                                        <span>Permanently Destroy File</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12 relative z-10">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 text-green-500 mb-6">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">File Shredded Successfully</h3>
                            <p className="text-muted-foreground mb-8">The file data has been wiped and completely destroyed.</p>

                            <button
                                onClick={() => setIsSuccess(false)}
                                className="btn-secondary"
                            >
                                Shred Another File
                            </button>
                        </div>
                    )}
                </div>

                {/* Information Section */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <Shield className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-semibold mb-2">Server Sanitization</h3>
                        <p className="text-sm text-muted-foreground">
                            Standard deletion only removes the file index. Our shredder overwrites the actual data clusters on our server disk.
                        </p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mb-4" />
                        <h3 className="font-semibold mb-2">Remote Wiping Only</h3>
                        <p className="text-sm text-muted-foreground">
                            This tool destroys the copy sent to our servers. To permanently destroy the file on your physical hard drive, you must use a local secure file deletion tool.
                        </p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl">
                        <Trash2 className="w-8 h-8 text-destructive mb-4" />
                        <h3 className="font-semibold mb-2">DOD Standard</h3>
                        <p className="text-sm text-muted-foreground">
                            Uses Department of Defense 5220.22-M inspired wiping patterns with configurable passes (zeros, ones, and random data).
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FileShredder;
