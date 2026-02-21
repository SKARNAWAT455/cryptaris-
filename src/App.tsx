import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import AnimatedRoutes from "./components/AnimatedRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTop />
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
