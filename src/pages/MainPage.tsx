import Navbar from "../components/main-page/Navbar";
import HeroSection from "../components/main-page/HeroSection";
import FeatureGrid from "../components/main-page/FeatureGrid";

export default function MainPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />
            <HeroSection />
            <FeatureGrid />
        </div>
    );
}