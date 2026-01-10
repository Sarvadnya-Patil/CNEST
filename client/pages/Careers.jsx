import React from 'react';
import { Briefcase } from 'lucide-react';

const Careers = () => {
    const jobOpenings = [
        {
            id: 1,
            title: "Chief Executive Officer/Principal Investigator",
            qualifications: "MBA/Engineering with experience in startup policies, funding mechanisms, IP and technology transfer / Technically qualified in the focus area of TBI",
            experience: "12+ Years"
        },
        {
            id: 2,
            title: "Operations Manager",
            qualifications: "Engineering with MBA or MBA in Operations / Project Manager or Management Graduate",
            experience: "Minimum 8 years"
        },
        {
            id: 3,
            title: "Marketing Executive/Outreach",
            qualifications: "Good communication skills, media, marketing, graphic design / Graduate with expertise in media/marketing",
            experience: "Minimum 5 years"
        },
        {
            id: 4,
            title: "Accountant",
            qualifications: "B.Com/M.Com with expertise in finance documents / Basic accounting / Finance qualification",
            experience: "5 years (Preferred)"
        },
        {
            id: 5,
            title: "Office Admin",
            qualifications: "Diploma in EC, EE or CS with strong computer knowledge",
            experience: "3 years (Preferred)"
        }
    ];

    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-4 py-2 rounded-full border border-blue-300 dark:border-blue-800 mb-4">
                        <Briefcase className="w-5 h-5" />
                        <span className="font-semibold text-sm uppercase tracking-wide">Recruitment Notice</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        CNEST Recruitments
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
                        KLE Technological University Dr M S Sheshgiri Campus, Belagavi
                    </p>
                    <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-6 py-3 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                        <span className="text-2xl font-bold">{jobOpenings.length}</span>
                        <span className="font-semibold">Open Positions</span>
                    </div>
                </div>

                {/* Official Recruitment Notice Image */}
                <div className="mb-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                        src="/CNEST design.png"
                        alt="CNEST Appointments - Official Recruitment Notice"
                        className="w-full h-auto"
                    />
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobOpenings.map((job, index) => (
                        <div
                            key={job.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-blue-600 dark:border-blue-500 p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:border-orange-500 dark:hover:border-orange-400"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-lg">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {job.title}
                                    </h2>
                                </div>
                            </div>
                            <div className="space-y-4 pl-16">
                                <div className="border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                                    <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Qualifications</span>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.qualifications}</p>
                                </div>
                                <div className="border-l-2 border-blue-300 dark:border-blue-700 pl-4">
                                    <span className="block text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Experience</span>
                                    <p className="text-gray-900 dark:text-white font-semibold">{job.experience}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Application Information */}
                <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-10 text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        Important Information
                    </h3>
                    <ul className="space-y-3 text-blue-100 dark:text-gray-300 text-lg mb-8">
                        <li className="flex items-start gap-3">
                            <span className="text-orange-400 font-bold mt-1">•</span>
                            <span>All recruitments will be undertaken as per the process approved by Karnataka Innovation and Technology Society (KITS)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-orange-400 font-bold mt-1">•</span>
                            <span>Salary will be as per norms</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-orange-400 font-bold mt-1">•</span>
                            <span>Eligibility as per norms. Apply with relevant certificates within 15 days</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-orange-400 font-bold mt-1">•</span>
                            <span>Interested candidates may apply through the Google Form via the link below</span>
                        </li>
                    </ul>
                    <div className="text-center mt-8">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScgTG5h4uVOp4RtLev2Npnxf3l8m2rFu_CM0NrZvmqS_gviYQ/viewform"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                        >
                            <Briefcase className="w-6 h-6" />
                            Apply Now - Registration Form
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Careers;
