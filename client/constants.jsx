import React from 'react';
import {
    Rocket,
    Banknote,
    Users,
    Megaphone,
    PenTool,
    Cpu,
    Target,
    Lightbulb
} from 'lucide-react';

export const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
];

export const SERVICES = [
    {
        title: 'Seed Funding',
        description: 'Access to funding and seed capital to kickstart your venture and fuel early-stage growth.',
        icon: <Banknote className="w-8 h-8 text-blue-600" />,
    },
    {
        title: 'Technical Expertise',
        description: 'Guidance from industry veterans in Science & Technology to build robust, scalable products.',
        icon: <Cpu className="w-8 h-8 text-blue-600" />,
    },
    {
        title: 'HR & Talent',
        description: 'Expert support in team building, human resources management, and talent acquisition.',
        icon: <Users className="w-8 h-8 text-blue-600" />,
    },
    {
        title: 'Media & Publicity',
        description: 'Strategic branding, public relations, and media outreach to put your startup on the map.',
        icon: <Megaphone className="w-8 h-8 text-blue-600" />,
    },
    {
        title: 'Content & Journaling',
        description: 'Professional content writing and documentation services to articulate your vision clearly.',
        icon: <PenTool className="w-8 h-8 text-blue-600" />,
    },
    {
        title: 'Mentorship',
        description: 'One-on-one mentorship sessions with successful entrepreneurs and academic leaders.',
        icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
    },
];

// Contact link for application form
export const CONTACT_LINK = "mailto:info@cnest.in";
