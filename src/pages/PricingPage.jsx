import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Packages from '../components/sections/Packages';

const PricingPage = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // Add a small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            return () => clearTimeout(timer);
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="pt-24 pb-12">
            <Packages />
        </div>
    );
};

export default PricingPage;
