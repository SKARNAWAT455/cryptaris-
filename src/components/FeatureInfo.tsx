import { Info } from "lucide-react";

interface FeatureInfoProps {
    title: string;
    description: string;
    steps?: string[];
}

const FeatureInfo = ({ title, description, steps }: FeatureInfoProps) => {
    return (
        <div className="mt-12 animate-fade-up-delay-2">
            <div className="glass-card p-8 border-primary/20 bg-primary/5">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                        <Info size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-3">{title}</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            {description}
                        </p>

                        {steps && steps.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</h3>
                                <ul className="space-y-3">
                                    {steps.map((step, index) => (
                                        <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <span className="pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureInfo;
