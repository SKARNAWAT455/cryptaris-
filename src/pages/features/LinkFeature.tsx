import { useState } from "react";
import { Link2, ExternalLink, Calendar, Copy, Check, Lock, Unlock, ArrowRight } from "lucide-react";
import FeatureLayout from "@/components/FeatureLayout";
import FeatureInfo from "@/components/FeatureInfo";
import SecurePasswordInput from "@/components/SecurePasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createLink, accessLink } from "@/lib/api";

interface LinkFeatureProps {
    mode: "create" | "access";
}

const LinkFeature = ({ mode }: LinkFeatureProps) => {
    const [url, setUrl] = useState("");
    const [password, setPassword] = useState("");
    const [expiry, setExpiry] = useState("1");
    const [generatedLink, setGeneratedLink] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCreate = async () => {
        if (!url) {
            toast({ title: "URL Required", description: "Please enter a URL to secure.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        try {
            const result = await createLink(url, password, expiry);
            setGeneratedLink(result.link);
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
            toast({ title: "Access Granted", description: "Redirecting..." });
            setTimeout(() => window.location.href = result.url, 1000);
        } catch (error: any) {
            toast({ title: "Access Denied", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
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
                        <div className="space-y-4">
                            <label className="text-sm font-medium">Destination URL or Content</label>
                            <Input
                                placeholder="https://example.com/secret-document"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>

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
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    >
                                        <option value="1">1 Hour</option>
                                        <option value="24">24 Hours</option>
                                        <option value="168">7 Days</option>
                                        <option value="0">Never</option>
                                    </select>
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
