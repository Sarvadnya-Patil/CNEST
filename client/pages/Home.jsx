import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import WhoWeServe from '../components/WhoWeServe';
import Services from '../components/Services';
import Achievements from '../components/Achievements';
import Team from '../components/Team';
import CallToAction from '../components/CallToAction';

import NoticesSection from '../components/NoticesSection';

const Home = () => {
    return (
        <>
            <Hero />
            <NoticesSection />
            <About />
            <WhoWeServe />
            <Achievements />
            <Services />
            <CallToAction />
            <Team />
        </>
    );
};

export default Home;
