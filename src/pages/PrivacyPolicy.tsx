
import React from 'react';
import { Shield, Lock, Eye, FileText, Server, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-tight px-6">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/5 border border-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are committed to protecting your personal data and respecting your privacy in accordance with Indian laws.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Last Updated: February 2026</span>
              <span>•</span>
              <span>Applicable Jurisdiction: India</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Cryptaris ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>cryptaris.in</strong> (the "Site").
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This policy is drafted in accordance with the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> (the "SPDI Rules"). By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Personal Information:</strong> Name, email address, and other contact details you voluntarily provide when you contact us or use specific features specifically requiring authentication.</li>
                <li><strong>Usage Data:</strong> Information on how the Service is accessed and used (e.g., page views, time spent, browser type).</li>
                <li><strong>Technical Data:</strong> IP address, device information, and cookies.</li>
              </ul>
              <div className="bg-secondary/30 p-4 rounded-lg border border-border/50 mt-4">
                <p className="text-sm text-foreground/80">
                  <strong>Note on Cryptographic Operations:</strong> Files, text, and data you process using our encryption/decryption tools are processed locally on your device or securely in temporary memory. We do <strong>not</strong> store the contents of your encrypted files or your private keys on our servers permanently.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                3. Purpose of Collection
              </h2>
              <p className="text-muted-foreground">
                We use the collected data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our Service.</li>
                <li>To notify you about changes to our Service.</li>
                <li>To allow you to participate in interactive features when you choose to do so.</li>
                <li>To provide customer support.</li>
                <li>To gather analysis or valuable information so that we can improve the Service.</li>
                <li>To monitor the usage of the Service.</li>
                <li>To detect, prevent and address technical issues.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                4. Data Storage and Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement reasonable security practices and procedures as required by Rule 8 of the SPDI Rules. We use commercially acceptable means to protect your Personal Information, including encryption and secure server infrastructure.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                However, please remember that no method of transmission over the Internet, or method of electronic storage, is entirely infallable. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                5. Your Rights
              </h2>
              <p className="text-muted-foreground">
                Under the Indian regulations, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access and review your personal data held by us.</li>
                <li>Request correction of inaccurate or incomplete information.</li>
                <li>Withdraw your consent at any time.</li>
                <li>Lodge a complaint with our Grievance Officer.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-amber-500">
                <Shield className="w-5 h-5" />
                6. Educational Disclaimer & Limitation of Liability
              </h2>
              <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-lg space-y-4">
                <p className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">Important Notice</p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Cryptaris is an academic project developed strictly for educational and demonstration purposes.</strong>
                  It is provided on an "as-is" and "as-available" basis without any warranties of any kind, either express or implied.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using this Site, you explicitly agree that we (the developers, university, or any associated parties) shall <strong>not be held liable</strong> for any:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Data loss resulting from forgotten passwords or decryption failures.</li>
                  <li>Misuse of the platform for illegal activities, storage of malware, or illicit media.</li>
                  <li>Service interruptions, permanent shutdown of the Service, or loss of access to encrypted files.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We reserve the right to delete data, restrict access, or terminate the Service entirely at any time without prior notice.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Grievance Officer</h2>
              <p className="text-muted-foreground">
                In accordance with the Information Technology Act, 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:
              </p>
              <div className="bg-muted p-6 rounded-lg border border-border mt-4">
                <p className="font-medium text-foreground">Grievance Officer: Siddhant Karnawat</p>
                <p className="text-muted-foreground">Cryptaris Inc.</p>
                <p className="text-muted-foreground">Email: vault49812@gmail.com</p>
                <p className="text-muted-foreground">Address: India</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

          </div>

          {/* Footer of Policy */}
          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>If you have any questions about this Privacy Policy, please contact us at vault49812@gmail.com</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
