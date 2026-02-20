import { useState } from "react";
import { FileText, Copy, ArrowRight, ArrowLeft } from "lucide-react";
import FeatureLayout from "@/components/FeatureLayout";
import FeatureInfo from "@/components/FeatureInfo";
import SecurePasswordInput from "@/components/SecurePasswordInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { encryptText, decryptText } from "@/lib/api";

interface TextFeatureProps {
    mode: "encrypt" | "decrypt";
}




const TextFeature = ({ mode }: TextFeatureProps) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [key, setKey] = useState("");
    const { toast } = useToast();

    const handleProcess = async () => {
        if (!input) {
            toast({
                title: "Input required",
                description: "Please enter some text to process.",
                variant: "destructive",
            });
            return;
        }

        try {
            if (mode === "encrypt") {
                const result = await encryptText(input, key);
                // Format for user: JSON string to keep salt/nonce
                setOutput(JSON.stringify(result, null, 2));
                toast({
                    title: "Encrypted!",
                    description: "Text encrypted successfully.",
                });
            } else {
                // Expect input to be the JSON string from encryption
                try {
                    const data = JSON.parse(input);
                    const result = await decryptText(data.ciphertext, key, data.salt, data.nonce);
                    setOutput(result.text);
                    toast({
                        title: "Decrypted!",
                        description: "Text decrypted successfully.",
                    });
                } catch (e: any) {
                    toast({
                        title: "Invalid Input",
                        description: e.message || "Input must be the JSON output from encryption.",
                        variant: "destructive"
                    });
                }
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "Result copied to clipboard.",
        });
    };

    return (
        <FeatureLayout
            title={mode === "encrypt" ? "Text Encryption" : "Text Decryption"}
            description={mode === "encrypt"
                ? "Secure your messages with military-grade encryption."
                : "Decrypt your secured messages instantly."}
            icon={FileText}
            backLink={mode === "encrypt" ? "/encrypt" : "/decrypt"}
        >
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <label className="text-sm font-medium">Input Text</label>
                    <Textarea
                        placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter text to decrypt..."}
                        className="min-h-[200px] font-mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <SecurePasswordInput
                        value={key}
                        onChange={setKey}
                        placeholder="Enter a secret key..."
                        showStrength={mode === 'encrypt'}
                    />
                    <Button onClick={handleProcess} className="w-full">
                        {mode === "encrypt" ? "Encrypt Text" : "Decrypt Text"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">Output</label>
                    <div className="relative">
                        <Textarea
                            readOnly
                            value={output}
                            className="min-h-[200px] font-mono bg-muted/50"
                            placeholder="Result will appear here..."
                        />
                        {output && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <FeatureInfo
                title={mode === "encrypt" ? "About Text Encryption" : "About Text Decryption"}
                description={mode === "encrypt"
                    ? "Cryptaris uses AES-256-GCM (Advanced Encryption Standard with Galois/Counter Mode) to secure your text. This military-grade standard ensures your messages are confidential and authenticated. We generate a unique salt and nonce for every encryption operation, meaning the same text will look different every time you encrypt it."
                    : "To decrypt a message, you need the exact ciphertext and the password used during encryption. Cryptaris verifies the authenticity of the message before decrypting it, ensuring that no one has tampered with the data in transit."}
                steps={mode === "encrypt" ? [
                    "Enter your sensitive text message.",
                    "Provide a strong password (optional but recommended).",
                    "We derive a 256-bit key from your password using PBKDF2.",
                    "Your text is encrypted locally or securely via our API.",
                    "Copy the JSON result which contains the ciphertext, salt, and nonce."
                ] : [
                    "Paste the full JSON output from the encryption step.",
                    "Enter the password used to encrypt the message.",
                    "We extract the salt and derive the decryption key.",
                    "The system verifies the authentication tag.",
                    "If successful, your original text is revealed."
                ]}
            />
        </FeatureLayout>
    );
};

export default TextFeature;
