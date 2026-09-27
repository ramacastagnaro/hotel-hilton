//Seccion main
import { Helmet } from 'react-helmet';
import CTA from '../components/CTA/CTA';
import Features from '../components/Features/Features';
import SearchHero from '../components/SearchHero/SearchHero';
import Testimonials from '../components/Testimonials/Testimonials';

function HomePage(){
    return(
        <>
        <Helmet>
            <title>Hotel Hilton - Tu escapada de lujo</title>
            <meta
                name="description"
                content="Reservá tu estadía en Hotel Hilton: habitaciones exclusivas, servicios premium y la mejor ubicación para tu próxima escapada."
            />
        </Helmet>
        <SearchHero />
        <Features />
        <CTA />
        <Testimonials />
        </>
    );
}

export default HomePage;
