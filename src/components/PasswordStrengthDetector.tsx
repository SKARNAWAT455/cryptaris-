import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { analyzePassword } from '@/lib/api';

interface PasswordStrengthDetectorProps {
    password: string;
}

const PasswordStrengthDetector = ({ password }: PasswordStrengthDetectorProps) => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!password) {
                setResult(null);
                return;
            }
            setLoading(true);
            try {
                const data = await analyzePassword(password);
                setResult(data);
            } catch (error) {
                console.error("Failed to analyze password", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchAnalysis, 500);
        return () => clearTimeout(debounce);
    }, [password]);

    if (!password || !result) return null;

    const getScoreColor = (score: number) => {
        switch (score) {
            case 0: return "text-red-500 bg-red-500/10 border-red-500/20";
            case 1: return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case 2: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            case 3: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case 4: return "text-green-500 bg-green-500/10 border-green-500/20";
            default: return "text-muted-foreground";
        }
    };

    const traverseScore = (score: number) => {
        if (score < 2) return <ShieldX className="w-5 h-5" />;
        if (score < 3) return <ShieldAlert className="w-5 h-5" />;
        if (score < 4) return <Shield className="w-5 h-5" />;
        return <ShieldCheck className="w-5 h-5" />;
    }

    const scoreColor = getScoreColor(result.score);
    const crackTime = result.crack_times?.offline_slow_hashing_1e4_per_second || "unknown";

    return (
        <div className={`mt-4 p-4 rounded-lg border flex flex-col gap-2 animate-fade-in ${scoreColor}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                    {traverseScore(result.score)}
                    <span>Security Score: {result.score}/4</span>
                </div>
                <div className="text-xs opacity-75">
                    Crack Time: {crackTime}
                </div>
            </div>

            {result.feedback?.warning && (
                <div className="text-sm font-medium">
                    ⚠️ {result.feedback.warning}
                </div>
            )}

            {result.feedback?.suggestions && result.feedback.suggestions.length > 0 && (
                <ul className="list-disc list-inside text-xs opacity-90">
                    {result.feedback.suggestions.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthDetector;
