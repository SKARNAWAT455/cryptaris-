import { useState } from "react";
import { Lock, Wand2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordStrengthDetector from "./PasswordStrengthDetector";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface SecurePasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    showStrength?: boolean;
}

const SecurePasswordInput = ({
    value,
    onChange,
    placeholder = "Enter password...",
    className = "",
    showStrength = true
}: SecurePasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const generateStrongPassword = () => {
        const length = 16;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        onChange(retVal);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-sm font-medium">Password</label>
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-9 pr-10 font-mono"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={generateStrongPassword}
                                className="shrink-0"
                            >
                                <Wand2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Generate Strong Password</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {showStrength && value && (
                <PasswordStrengthDetector password={value} />
            )}
        </div>
    );
};

export default SecurePasswordInput;
