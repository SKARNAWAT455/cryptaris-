import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureLayoutProps {
    title: string;
    description: string;
    icon: React.ElementType;
    children: ReactNode;
    backLink: string;
}

const FeatureLayout = ({ title, description, icon: Icon, children, backLink }: FeatureLayoutProps) => {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container-tight">
                <Link
                    to={backLink}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </Link>

                <div className="flex items-center gap-4 mb-6 animate-fade-up">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Icon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground mt-1">{description}</p>
                    </div>
                </div>

                <div className="animate-fade-up-delay-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FeatureLayout;
