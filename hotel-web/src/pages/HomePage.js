//Seccion main
import CTA from '../components/CTA/CTA';
import Features from '../components/Features/Features';
import SearchHero from '../components/SearchHero/SearchHero';
import Testimonials from '../components/Testimonials/Testimonials';

function HomePage(){
    return(
        <>
        <SearchHero />
        <Features />
        <CTA />
        <Testimonials />
        </>
    );
}

export default HomePage;