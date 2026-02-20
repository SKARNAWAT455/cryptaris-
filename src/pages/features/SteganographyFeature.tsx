import { useState } from "react";
import { EyeOff, Eye, Upload, Image as ImageIcon, ArrowRight, Loader2, Save, X } from "lucide-react";
import FeatureLayout from "@/components/FeatureLayout";
import FeatureInfo from "@/components/FeatureInfo";
import SecurePasswordInput from "@/components/SecurePasswordInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { hideMessage, revealMessage } from "@/lib/api";

interface SteganographyFeatureProps {
    mode: "hide" | "reveal";
}

const SteganographyFeature = ({ mode }: SteganographyFeatureProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [secret, setSecret] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [revealedMessage, setRevealedMessage] = useState<string | null>(null);
    const { toast } = useToast();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setProcessedImage(null);
            setRevealedMessage(null);
        }
    };

    const processHide = async () => {
        if (!image || !message) {
            toast({
                title: "Missing input",
                description: "Please select an image and enter a message.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        try {
            const resultBlob = await hideMessage(image, message, secret);
            const url = window.URL.createObjectURL(resultBlob);
            setProcessedImage(url);
            toast({
                title: "Message Hidden!",
                description: "The message has been successfully embedded in the image.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const processReveal = async () => {
        if (!image) {
            toast({
                title: "Missing input",
                description: "Please select an image to reveal message from.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        try {
            const result = await revealMessage(image);
            setRevealedMessage(result.message);
            toast({
                title: "Message Revealed!",
                description: "Hidden data found and extracted.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <FeatureLayout
            title={mode === "hide" ? "Steganography: Hide Data" : "Steganography: Reveal Data"}
            description={mode === "hide"
                ? "Hide secret messages invisibly inside standard images."
                : "Extract hidden messages from steganographic images."}
            icon={mode === "hide" ? EyeOff : Eye}
            backLink={mode === "hide" ? "/encrypt" : "/decrypt"}
        >
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <div
                        className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
                        onClick={() => document.getElementById("steg-upload")?.click()}
                    >
                        {image ? (
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setImage(null);
                                        setProcessedImage(null);
                                        setRevealedMessage(null);
                                    }}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors z-20"
                                >
                                    <X size={20} />
                                </button>
                            </>
                        ) : null}

                        <input
                            id="steg-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        <div className="relative z-10 bg-background/80 p-4 rounded-lg backdrop-blur-sm">
                            <ImageIcon className="mx-auto text-primary mb-2" size={32} />
                            <p className="font-semibold">
                                {image ? "Change Image" : "Select Cover Image"}
                            </p>
                            <p className="text-xs text-muted-foreground">PNG or JPG recommended</p>
                        </div>
                    </div>

                    {mode === "hide" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Secret Message to Hide</label>
                            <Textarea
                                placeholder="Enter your secret message here..."
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    )}

                    <SecurePasswordInput
                        value={secret}
                        onChange={setSecret}
                        placeholder="Enter password..."
                        showStrength={mode === 'hide'}
                    />

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={mode === "hide" ? processHide : processReveal}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                        {mode === "hide" ? "Embed Message" : "Reveal Message"}
                    </Button>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Result</h3>
                    <div className="min-h-[400px] rounded-xl border bg-muted/30 p-6 flex flex-col items-center justify-center text-center">
                        {mode === "hide" && processedImage ? (
                            <div className="space-y-4 w-full">
                                <img src={processedImage} alt="Steganography Result" className="rounded-lg w-full max-h-[300px] object-contain shadow-lg" />
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" className="w-full" onClick={() => {
                                        if (processedImage) {
                                            const link = document.createElement('a');
                                            link.href = processedImage;
                                            link.download = "stego_image.png";
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}>
                                        <Save className="mr-2 h-4 w-4" /> Download Image
                                    </Button>
                                </div>
                                <p className="text-sm text-green-500 font-medium">
                                    Message embedded successfully!
                                </p>
                            </div>
                        ) : mode === "reveal" && revealedMessage ? (
                            <div className="w-full space-y-4 text-left">
                                <div className="p-4 bg-background rounded-lg border shadow-sm">
                                    <p className="font-mono text-sm whitespace-pre-wrap">{revealedMessage}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(revealedMessage)}>
                                    Copy Message
                                </Button>
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                <EyeOff className="mx-auto mb-4 opacity-50" size={48} />
                                <p>Processed result will appear here</p>
                            </div>
                        )}
                        {mode === "hide" && processedImage && (
                            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-600 dark:text-yellow-400">
                                <p className="font-semibold">⚠️ Important:</p>
                                <p>When sharing via WhatsApp, Telegram, or other social media, ALWAYS send as a <strong>"Document"</strong>. Sending as a standard image will compress it and destroy the hidden message.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FeatureInfo
                title={mode === "hide" ? "About Steganography" : "About Revealing Data"}
                description={mode === "hide"
                    ? "Steganography is the art of hiding information in plain sight. Unlike encryption which scrambles data, steganography embeds your secret message into the pixels of an image without noticeably changing its appearance."
                    : "Our algorithms scan the image for subtle anomalies in the pixel data that indicate hidden information. If a message is found, we extract and decode it for you."}
                steps={mode === "hide" ? [
                    "Choose a cover image (PNG is recommended for lossless quality).",
                    "Type your secret message.",
                    "We modify the Least Significant Bits (LSB) of the image pixels.",
                    "The change is invisible to the human eye but contains your data.",
                    "Download the new image. It looks identical but holds a secret."
                ] : [
                    "Upload the image you suspect contains a hidden message.",
                    "Enter the password if the message was encrypted before hiding.",
                    "We analyze the pixel data bit by bit.",
                    "The hidden binary data is reassembled into text.",
                    "Your secret message is revealed."
                ]}
            />
        </FeatureLayout>
    );
};

export default SteganographyFeature;
