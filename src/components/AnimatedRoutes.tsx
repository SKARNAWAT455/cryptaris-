
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";

// Import all pages
import Index from "../pages/Index";
import About from "../pages/About";
import Encrypt from "../pages/Encrypt";
import Decrypt from "../pages/Decrypt";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import TextFeature from "../pages/features/TextFeature";
import FileFeature from "../pages/features/FileFeature";
import SteganographyFeature from "../pages/features/SteganographyFeature";
import LinkFeature from "../pages/features/LinkFeature";
import DecoyGenerator from "../pages/features/DecoyGenerator";
import PrivacyPolicy from "../pages/PrivacyPolicy";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />

                {/* Encrypt Routes */}
                <Route path="/encrypt" element={<PageTransition><Encrypt /></PageTransition>} />
                <Route path="/encrypt/text" element={<PageTransition><TextFeature mode="encrypt" /></PageTransition>} />
                <Route path="/encrypt/document" element={<PageTransition><FileFeature type="document" mode="encrypt" /></PageTransition>} />
                <Route path="/encrypt/audio" element={<PageTransition><FileFeature type="audio" mode="encrypt" /></PageTransition>} />
                <Route path="/encrypt/video" element={<PageTransition><FileFeature type="video" mode="encrypt" /></PageTransition>} />
                <Route path="/encrypt/image" element={<PageTransition><FileFeature type="image" mode="encrypt" /></PageTransition>} />
                <Route path="/encrypt/steganography" element={<PageTransition><SteganographyFeature mode="hide" /></PageTransition>} />
                <Route path="/encrypt/link" element={<PageTransition><LinkFeature mode="create" /></PageTransition>} />

                {/* Decrypt Routes */}
                <Route path="/decrypt" element={<PageTransition><Decrypt /></PageTransition>} />
                <Route path="/decrypt/text" element={<PageTransition><TextFeature mode="decrypt" /></PageTransition>} />
                <Route path="/decrypt/document" element={<PageTransition><FileFeature type="document" mode="decrypt" /></PageTransition>} />
                <Route path="/decrypt/audio" element={<PageTransition><FileFeature type="audio" mode="decrypt" /></PageTransition>} />
                <Route path="/decrypt/video" element={<PageTransition><FileFeature type="video" mode="decrypt" /></PageTransition>} />
                <Route path="/decrypt/image" element={<PageTransition><FileFeature type="image" mode="decrypt" /></PageTransition>} />
                <Route path="/decrypt/steganography" element={<PageTransition><SteganographyFeature mode="reveal" /></PageTransition>} />
                <Route path="/decrypt/link" element={<PageTransition><LinkFeature mode="access" /></PageTransition>} />

                {/* Tools & Utils */}
                <Route path="/tools/decoy" element={<PageTransition><DecoyGenerator /></PageTransition>} />
                <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
