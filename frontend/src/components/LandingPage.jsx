import React, { useState } from 'react';

const LandingPage = ({ onLaunchSimulator }) => {
    const [videoError, setVideoError] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            {/* Full-Screen Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/microgrid-bg.mp4" type="video/mp4" />
            </video>

            {/* Navigation Bar - SCADA Control Room */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-3 border-amber-500 select-none">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24 lg:h-28">
                        <div className="flex items-center gap-4 lg:gap-5">
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-amber-500 rounded flex items-center justify-center">
                                <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-2xl lg:text-3xl font-extrabold text-black tracking-tight">Microgrid Control System</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6 lg:gap-8">
                            <a href="#overview" className="text-xs lg:text-sm font-bold text-gray-600 hover:text-amber-500 transition-colors">Overview</a>
                            <a href="#capabilities" className="text-xs lg:text-sm font-bold text-gray-600 hover:text-amber-500 transition-colors">Capabilities</a>
                            <a href="#features" className="text-xs lg:text-sm font-bold text-gray-600 hover:text-amber-500 transition-colors">Features</a>
                            <button
                                onClick={onLaunchSimulator}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors"
                            >
                                Launch Simulator
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Video Hero Section - Control Room */}
            <div className="relative h-screen overflow-hidden bg-white">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setVideoError(true)}
                >
                    <source src="https://cdn.pixabay.com/video/2022/11/09/138367-770242148_large.mp4" type="video/mp4" />
                    <source src="https://cdn.pixabay.com/video/2020/04/14/36272-408794909_large.mp4" type="video/mp4" />
                    <source src="https://cdn.pixabay.com/video/2016/08/03/4634-177885158_large.mp4" type="video/mp4" />
                </video>

                {/* Light Overlay */}
                <div className="absolute inset-0 bg-white"></div>

                {/* Hero Content */}
                <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                        <div className="max-w-4xl">
                            <div className="mb-6">
                                <span className="inline-block bg-white text-amber-500 px-4 py-2 rounded text-sm font-bold border-2 border-amber-500 select-none">
                                    Advanced Energy Control Platform
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight select-none">
                                Microgrid Simulation
                                <br />
                                <span className="text-amber-500">Control System</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl font-semibold">
                                Industrial-grade simulation platform for real-time energy management,
                                optimizing solar-battery-grid coordination with operational precision.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onLaunchSimulator}
                                    className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded font-bold text-lg transition-colors group select-none"
                                >
                                    <span>Run Simulation</span>
                                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                                <a
                                    href="#overview"
                                    className="inline-flex items-center justify-center bg-white hover:bg-white text-black px-8 py-4 rounded font-bold text-lg transition-colors border-2 border-gray-200 hover:border-amber-500 select-none"
                                >
                                    Learn More
                                </a>
                            </div>

                            {/* Key Metrics */}
                            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl select-none">
                                <div>
                                    <div className="text-3xl font-bold text-amber-500">24h</div>
                                    <div className="text-sm text-gray-600 mt-1 font-bold">Simulation Period</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-amber-500">100%</div>
                                    <div className="text-sm text-gray-600 mt-1 font-bold">Deterministic</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-amber-500">Real-time</div>
                                    <div className="text-sm text-gray-600 mt-1 font-bold">Analysis</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-amber-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Section Separator */}
            <div className="border-t-2 border-gray-200"></div>

            {/* Product Overview */}
            <div id="overview" className="py-20 lg:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6 select-none">
                            Industrial Energy Control Platform
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-semibold">
                            Real-time operational analysis coordinating solar generation, battery storage,
                            and grid interaction with precision control algorithms.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black mb-2 select-none">Hourly Time-Step Control</h3>
                                    <p className="text-gray-600 font-semibold">
                                        24-hour operational analysis with hourly resolution, providing detailed insight
                                        into energy flows, battery state-of-charge, and grid interaction patterns.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black mb-2">Baseline Comparison</h3>
                                    <p className="text-gray-600 font-semibold">
                                        Quantify cost savings and renewable penetration gains by comparing optimized operation
                                        against baseline grid-only scenarios.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black mb-2">Decision Transparency</h3>
                                    <p className="text-gray-600 font-semibold">
                                        Complete operational logic for every scheduling decision, providing full
                                        transparency into control algorithms.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
                            <h3 className="text-2xl font-bold text-black mb-6">System Components</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <span className="text-black font-bold">Solar PV Generation</span>
                                    <span className="text-amber-500 font-bold">Variable</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <span className="text-black font-bold">Battery Storage System</span>
                                    <span className="text-amber-500 font-bold">Optimized</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <span className="text-black font-bold">Grid Connection</span>
                                    <span className="text-amber-500 font-bold">Bidirectional</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-black font-bold">Load Profile</span>
                                    <span className="text-amber-500 font-bold">Time-Varying</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Separator */}
            <div className="border-t-2 border-gray-200"></div>

            {/* Core Capabilities Section */}
            <div id="capabilities" className="py-20 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4 select-none">Control System Capabilities</h2>
                        <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-semibold">
                            Industrial-grade simulation engine with precision modeling and operational transparency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-amber-500 transition-all">
                            <div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Time-Based Control</h3>
                            <p className="text-gray-600 leading-relaxed font-semibold">
                                Deterministic hourly simulation over 24 hours with complete temporal resolution
                                of all energy flows and system states.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-amber-500 transition-all">
                            <div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Battery Management</h3>
                            <p className="text-gray-600 leading-relaxed font-semibold">
                                Intelligent charge/discharge control with realistic constraints, efficiency
                                modeling, and state-of-charge management.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-amber-500 transition-all">
                            <div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Cost Optimization</h3>
                            <p className="text-gray-600 leading-relaxed font-semibold">
                                Time-of-Use pricing integration with rule-based logic to minimize grid
                                electricity costs across the simulation period.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-amber-500 transition-all">
                            <div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Operational Logging</h3>
                            <p className="text-gray-600 leading-relaxed font-semibold">
                                Complete explanation of scheduling logic for every hour, providing full
                                transparency into operational decision-making.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Separator */}
            <div className="border-t-2 border-gray-200"></div>

            {/* Technical Features Section */}
            <div id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-black mb-4 select-none">Technical Features</h2>
                        <p className="text-xl text-gray-600 font-semibold">Industrial-grade simulation engine with comprehensive modeling</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Energy Integrity",
                                description: "Ensures strict energy conservation at every hourly timestep by validating all generation, storage, and grid exchanges, guaranteeing physically consistent microgrid operation."
                            },
                            {
                                title: "Battery Constraints Engine",
                                description: "Models realistic battery behavior including state-of-charge limits, charge/discharge efficiencies, and operational constraints to prevent infeasible scheduling decisions."
                            },
                            {
                                title: "Dynamic Tariff Modeling",
                                description: "Incorporates time-of-use electricity pricing with peak, shoulder, and off-peak rates, enabling cost-aware scheduling and intelligent grid interaction."
                            },
                            {
                                title: "Forecast-Based Solar",
                                description: "Simulates hourly solar generation using forecast profiles while accounting for variability and uncertainty inherent in real-world weather conditions."
                            },
                            {
                                title: "Forecast Error Handling ⭐",
                                description: "Introduces controlled forecast errors between predicted and actual solar generation, forcing the controller to adapt through corrective battery dispatch or grid imports."
                            },
                            {
                                title: "Operational Transparency",
                                description: "Provides a complete, hour-by-hour operational log explaining every control decision, energy flow, and cost outcome for full system interpretability."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-500 transition">
                                <h3 className="font-bold text-black mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section Separator */}
            <div className="border-t border-gray-200"></div>

            {/* Call to Action Section */}
            <div className="py-24 bg-amber-500">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 select-none">
                        Launch Control System
                    </h2>
                    <p className="text-xl text-white mb-10 leading-relaxed font-semibold">
                        Run the operational simulation for 24-hour energy scheduling, battery optimization,
                        and real-time decision logging in an industrial microgrid environment
                    </p>
                    <button
                        onClick={onLaunchSimulator}
                        className="inline-flex items-center bg-white text-amber-500 px-10 py-5 rounded-lg font-bold text-lg hover:bg-white transition-all group select-none"
                    >
                        <span>Initialize Simulator</span>
                        <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Section Separator */}
            <div className="border-t-2 border-gray-200"></div>

            {/* Footer */}
            <footer className="bg-white py-12 select-none">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-amber-500 rounded flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-black tracking-tight">Microgrid Control</span>
                            </div>
                            <p className="text-gray-600 text-sm font-semibold">
                                Industrial microgrid simulation and energy management platform
                            </p>
                        </div>
                        <div>
                            <h3 className="text-black font-bold mb-4">Product</h3>
                            <ul className="space-y-2 text-sm text-gray-600 font-semibold">
                                <li><a href="#overview" className="hover:text-amber-500 transition-colors">Overview</a></li>
                                <li><a href="#capabilities" className="hover:text-amber-500 transition-colors">Capabilities</a></li>
                                <li><a href="#features" className="hover:text-amber-500 transition-colors">Features</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-black font-bold mb-4">Technology</h3>
                            <ul className="space-y-2 text-sm text-gray-600 font-semibold">
                                <li>FastAPI Backend</li>
                                <li>React Frontend</li>
                                <li>Real-time Control</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600 font-semibold">
                        <p>© 2026 Microgrid Control System</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
