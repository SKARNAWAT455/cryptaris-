import { useState } from "react";
import { Link2, ExternalLink, Calendar, Copy, Check, Lock, Unlock, ArrowRight, Upload, File, X } from "lucide-react";
import FeatureLayout from "@/components/FeatureLayout";
import FeatureInfo from "@/components/FeatureInfo";
import SecurePasswordInput from "@/components/SecurePasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createLink, accessLink } from "@/lib/api";

interface LinkFeatureProps {
    mode: "create" | "access";
}

const LinkFeature = ({ mode }: LinkFeatureProps) => {
    const [shareType, setShareType] = useState<"text" | "file">("text");
    const [url, setUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [expiry, setExpiry] = useState("3600"); // seconds
    const [customExpiry, setCustomExpiry] = useState(""); // minutes string
    const [generatedLink, setGeneratedLink] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCreate = async () => {
        if (shareType === "text" && !url) {
            toast({ title: "Content Required", description: "Please enter a URL or text to secure.", variant: "destructive" });
            return;
        }
        if (shareType === "file" && !file) {
            toast({ title: "File Required", description: "Please attach a file to secure.", variant: "destructive" });
            return;
        }

        let finalExpirySecs = parseInt(expiry);
        if (expiry === "custom") {
            const mins = parseInt(customExpiry);
            if (!mins || isNaN(mins) || mins <= 0) {
                toast({ title: "Invalid Expiration", description: "Please enter a valid number of minutes.", variant: "destructive" });
                return;
            }
            finalExpirySecs = mins * 60;
        }

        setIsProcessing(true);
        try {
            const passedUrl = shareType === "text" ? url : "";
            const passedFile = shareType === "file" ? (file || undefined) : undefined;
            const result = await createLink(passedUrl, password, finalExpirySecs.toString(), passedFile);
            setGeneratedLink(result.full_url);
            toast({ title: "Secure Link Created", description: "Your link is ready to share." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAccess = async () => {
        // Extract link ID from URL (simple logic)
        const linkId = url.split('/').pop() || "";

        if (!linkId) {
            toast({ title: "Invalid Link", description: "Could not parse link ID.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        try {
            const result = await accessLink(linkId, password); // password field in access mode

            if (result.isFile) {
                const downloadUrl = window.URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = result.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
                toast({ title: "Access Granted", description: "File downloaded successfully." });
            } else {
                toast({ title: "Access Granted", description: "Redirecting..." });
                // If it's a URL, attempt redirect. If text, show it somehow or just dump to body (simplified here to keep previous behavior)
                // For a proper text renderer, you'd setstate the text. But assuming URLs for now.
                setTimeout(() => {
                    if (result.url.startsWith('http')) {
                        window.location.href = result.url;
                    } else {
                        // Just display text hack if not url
                        document.body.innerHTML = `<body><div style='padding:2rem; font-family:monospace; white-space:pre-wrap;'>${result.url}</div></body>`;
                    }
                }, 1000);
            }

        } catch (error: any) {
            toast({ title: "Access Denied", description: error.message || "Invalid password or expired link.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <FeatureLayout
            title={mode === "create" ? "Secure Link Generation" : "Link Access"}
            description={mode === "create" ? "Create temporary, encrypted links for safe sharing." : "Access and decrypt secure shared links."}
            icon={Link2}
            backLink={mode === "create" ? "/encrypt" : "/decrypt"}
        >
            <div className="max-w-xl mx-auto space-y-8 glass-card p-8">
                {mode === "create" ? (
                    <>
                        <Tabs value={shareType} onValueChange={(v: any) => setShareType(v)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="text">Share Text / URL</TabsTrigger>
                                <TabsTrigger value="file">Share File</TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="space-y-4">
                                <label className="text-sm font-medium">Destination URL or Secret Text</label>
                                <Input
                                    placeholder="https://example.com/ or 'My secret password is...'"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </TabsContent>
                            <TabsContent value="file" className="space-y-4">
                                <div
                                    className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById("link-file-upload")?.click()}
                                >
                                    {file && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                    <input
                                        id="link-file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                                        }}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                                            {file ? <File size={24} /> : <Upload size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">
                                                {file ? file.name : "Drop file here or click to browse"}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <SecurePasswordInput
                                    value={password}
                                    onChange={setPassword}
                                    placeholder="Optional"
                                    showStrength={true}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Expires In</label>
                                <div className="space-y-2 relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    >
                                        <option value="30">30 Seconds</option>
                                        <option value="60">1 Minute</option>
                                        <option value="300">5 Minutes</option>
                                        <option value="3600">1 Hour</option>
                                        <option value="86400">24 Hours</option>
                                        <option value="0">Never</option>
                                        <option value="custom">Custom (Minutes)</option>
                                    </select>
                                    {expiry === "custom" && (
                                        <Input
                                            type="number"
                                            placeholder="Enter minutes..."
                                            value={customExpiry}
                                            onChange={(e) => setCustomExpiry(e.target.value)}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleCreate} disabled={isProcessing}>
                            {isProcessing ? "Generating..." : "Create Secure Link"}
                        </Button>

                        {generatedLink && (
                            <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-fade-in border border-primary/20">
                                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Your Secure Link</p>
                                <div className="flex items-center gap-2">
                                    <Input value={generatedLink} readOnly className="font-mono bg-background" />
                                    <Button size="icon" variant="outline" onClick={handleCopy}>
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => window.open(generatedLink, "_blank")}>
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="space-y-4">
                            <label className="text-sm font-medium">Enter Secure Link</label>
                            <Input
                                placeholder="https://cryptaris.io/s/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium">Password (If required)</label>
                            <div className="relative">
                                <Unlock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Enter password..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleAccess} disabled={isProcessing}>
                            {isProcessing ? "Verifying..." : "Access Content"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            <FeatureInfo
                title={mode === "create" ? "About Secure Links" : "Accessing Secure Links"}
                description={mode === "create"
                    ? "create temporary, self-destructing links to share sensitive information. Your data is stored securely and can encrypted with a password. Once the link expires, the data is permanently deleted."
                    : "You are accessing a secure, temporary link. If the link has expired or the maximum view count has been reached, the data effectively no longer exists."}
                steps={mode === "create" ? [
                    "Enter the destination URL or content you want to share.",
                    "Set an expiration time (e.g., 1 hour, 24 hours).",
                    "Add an optional password for extra security.",
                    "We generate a unique, cryptographically random link ID.",
                    "Share the link confidently knowing it defaults to privacy."
                ] : [
                    "Paste the secure link.",
                    "If required, enter the password provided by the sender.",
                    "We verify the link hasn't expired.",
                    "If valid, you are redirected to the destination or shown the content."
                ]}
            />
        </FeatureLayout>
    );
};

export default LinkFeature;
