import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaRocket,
    FaRobot,
    FaFileContract,
    FaSearch,
    FaBalanceScale,
    FaArrowRight,
    FaCheckCircle,
    FaLightbulb,
    FaUsers,
    FaShieldAlt,
    FaBrain,
} from "react-icons/fa";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-xl sticky top-0 z-50 bg-white/70 rounded-b-3xl border-b border-orange-100/50 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300 transform group-hover:rotate-3">
                        <FaBalanceScale className="text-xl text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-300">
                        Lexi<span className="text-orange-500 group-hover:text-amber-500 transition-colors">AI</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm bg-slate-50/50 px-8 py-3 rounded-full border border-slate-100 shadow-inner">
                    <a href="#home" className="hover:text-orange-500 transition-colors relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#about" className="hover:text-orange-500 transition-colors relative group">
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#how-it-works" className="hover:text-orange-500 transition-colors relative group">
                        How it Works
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#features" className="hover:text-orange-500 transition-colors relative group">
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                    </a>
                    {/* <a href="#testimonials" className="hover:text-orange-500 transition-colors relative group">
                        Testimonials
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                    </a> */}
                </div>
                <Link
                    to="/login"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5 active:scale-95"
                >
                    Login In
                </Link>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative pt-11 pb-32 px-6 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-40 -right-20 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 mb-8 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow cursor-default animate-fade-in-up">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-orange-800 tracking-wide uppercase">AI-Powered Legal Intelligence 2.0</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight text-slate-900 drop-shadow-sm">
                        Legal Assistance, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 animate-gradient-x">
                            Reimagined with AI
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Experience the future of law with our advanced AI assistant.
                        Draft documents, analyze contracts, and conduct legal research with
                        <span className="font-semibold text-slate-900 mx-1">unprecedented speed</span> and accuracy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link
                            to="/login"
                            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl font-bold text-lg text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        {/* <button className="px-8 py-4 rounded-2xl font-bold text-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 shadow-sm hover:shadow-md group flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                <FaRocket className="text-sm" />
                            </span>
                            Watch Demo
                        </button> */}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Left Side - Image Section */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-200 via-amber-200 to-orange-300 rounded-3xl blur-2xl opacity-50 animate-pulse-slow"></div>
                            <div className="relative bg-white p-1 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                {/* Main Image Container */}
                                <div className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Legal AI Technology Visualization"
                                        className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>

                                    {/* Floating UI Elements */}
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-semibold text-slate-800">AI Active</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-[200px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBrain className="text-orange-500" />
                                            <span className="text-xs font-bold text-slate-800">Case Analysis</span>
                                        </div>
                                        <div className="text-xs text-slate-600">Real-time legal insights powered by AI</div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full blur-xl opacity-30"></div>
                                <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-tr from-orange-300 to-amber-300 rounded-full blur-xl opacity-30"></div>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div>
                            <span className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-2 block">About LexiAI</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
                                Empowering Legal Professionals with <span className="text-orange-500">AI</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Founded by a team of legal experts and AI engineers, LexiAI is on a mission to democratize legal intelligence. We believe that technology should handle the repetitive tasks, allowing lawyers to focus on what truly matters: strategy and client advocacy.
                            </p>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                Our platform leverages cutting-edge Large Language Models (LLMs) trained on millions of legal documents to provide instant, accurate, and actionable insights.
                            </p>

                            {/* Feature Icons */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <FaLightbulb className="text-lg text-orange-500" />
                                    </div>
                                    <span className="font-semibold text-slate-800">Innovation</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <FaUsers className="text-lg text-amber-500" />
                                    </div>
                                    <span className="font-semibold text-slate-800">Community</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <FaShieldAlt className="text-lg text-amber-500" />
                                    </div>
                                    <span className="font-semibold text-slate-800">Security</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <FaRobot className="text-lg text-orange-500" />
                                    </div>
                                    <span className="font-semibold text-slate-800">Intelligence</span>
                                </div>
                            </div>

                            <Link to="/login" className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                <span>Get Started</span>
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-50/20 to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-amber-100/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-100/20 to-orange-100/30 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center justify-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="text-orange-500 font-bold tracking-wider text-sm uppercase">Process</span>
                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mt-2 mb-6 text-slate-900">
                            How It <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Works</span>
                        </h2>
                        <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium">
                            Transform your legal workflow with three seamless, AI-powered steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
                        {/* Animated Connection Line */}
                        <div className="hidden md:block absolute top-1/2 left-12 right-12 h-2 transform -translate-y-1/2 -z-10">
                            <div className="relative h-full w-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-amber-300 to-orange-300 rounded-full opacity-70"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-full blur-sm opacity-30"></div>
                                {/* Animated dots */}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Step 1 - Upload Documents */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-orange-100 hover:scale-[1.02] transition-all duration-500 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="relative">
                                        <div className="absolute -inset-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full blur opacity-20"></div>
                                        <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                            01
                                        </div>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-xl">
                                        <FaFileContract className="text-2xl text-orange-500" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload Documents</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Securely upload contracts, case files, or simply type your legal queries into our intuitive, encrypted interface.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
                                    <span>Get Started</span>
                                    <FaArrowRight className="text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 - AI Analysis */}
                        <div className="relative group mt-8 md:mt-0">
                            <div className="absolute -inset-4 bg-gradient-to-br from-amber-100 to-orange-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-amber-100 hover:scale-[1.02] transition-all duration-500 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="relative">
                                        <div className="absolute -inset-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur opacity-20"></div>
                                        <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                            02
                                        </div>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-xl">
                                        <FaBrain className="text-2xl text-amber-500" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Analysis</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Our advanced AI engines analyze and cross-reference your data with millions of legal documents in real-time.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold">
                                    <span>Smart Processing</span>
                                    <FaSearch className="text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Step 3 - Get Results */}
                        <div className="relative group mt-8 md:mt-0">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-orange-100 hover:scale-[1.02] transition-all duration-500 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="relative">
                                        <div className="absolute -inset-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full blur opacity-20"></div>
                                        <div className="relative w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                            03
                                        </div>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-xl">
                                        <FaCheckCircle className="text-2xl text-orange-500" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Results</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Receive comprehensive reports, drafted documents, or precise answers immediately, ready for professional review.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
                                    <span>Instant Results</span>
                                    <FaBalanceScale className="text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    {/* <div className="text-center mt-16">
                        <Link
                            to="/login"
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] transform"
                        >
                            <span>Start Your Free Trial</span>
                            <FaRocket className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                        <p className="text-slate-500 text-sm mt-4">No credit card required • 14-day free trial</p>
                    </div> */}
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-gradient-to-r from-orange-100/40 to-amber-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-gradient-to-l from-amber-100/40 to-orange-100/30 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-orange-500 font-bold tracking-wider text-sm uppercase">Why Choose LexiAI</span>
                        <h2 className="text-4xl md:text-6xl font-bold mt-2 mb-6 text-slate-900">
                            Powerful Features for <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Modern Legal</span>
                        </h2>
                        <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium">
                            Everything you need to streamline your legal practice with cutting-edge AI technology
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Feature 1 - AI Assistant */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100/80 hover:border-orange-100 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 h-full overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-orange-100/60 to-transparent rounded-full blur-xl"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <FaRobot className="text-2xl text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                                        AI Assistant
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        Get instant, accurate answers to complex legal queries powered by our advanced Large Language Models.
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-orange-600">Learn More</span>
                                        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
                                            <FaArrowRight className="text-orange-500 text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Smart Research */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100/80 hover:border-amber-100 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 h-full overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-tr from-amber-100/60 to-transparent rounded-full blur-xl"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <FaSearch className="text-2xl text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                                        Smart Research
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        Navigate through millions of case laws and statutes with our intelligent semantic search technology.
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-amber-600">Learn More</span>
                                        <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors duration-300">
                                            <FaArrowRight className="text-amber-500 text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Contract Analysis */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100/80 hover:border-orange-100 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 h-full overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-tr from-orange-100/60 to-transparent rounded-full blur-xl"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <FaFileContract className="text-2xl text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                                        Contract Analysis
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        Automatically detect risks, clauses, and get actionable insights on your legal documents in seconds.
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-orange-600">Learn More</span>
                                        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
                                            <FaArrowRight className="text-orange-500 text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 4 - Auto Drafting */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100/80 hover:border-amber-100 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 h-full overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute -left-8 -top-8 w-32 h-32 bg-gradient-to-br from-amber-100/60 to-transparent rounded-full blur-xl"></div>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <FaRocket className="text-2xl text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                                        Auto Drafting
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        Generate fully compliant legal documents, contracts, and briefs in seconds—not hours.
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-amber-600">Learn More</span>
                                        <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors duration-300">
                                            <FaArrowRight className="text-amber-500 text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-20 bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-3xl p-8 md:p-12 border border-orange-100/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">99.9%</div>
                                <div className="text-slate-600 font-medium">Accuracy Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">10x</div>
                                <div className="text-slate-600 font-medium">Faster Research</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">5000+</div>
                                <div className="text-slate-600 font-medium">Legal Documents</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">24/7</div>
                                <div className="text-slate-600 font-medium">AI Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20"></div>
                <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-orange-300/30 rounded-full animate-float"></div>
                <div className="absolute bottom-1/4 right-1/3 w-6 h-6 border-2 border-amber-300/30 rounded-full animate-float-delayed"></div>
                <div className="absolute top-1/3 right-1/4 w-10 h-10 border-2 border-orange-400/20 rounded-lg animate-float-slow"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-orange-500 font-bold tracking-wider text-sm uppercase">What Professionals Say</span>
                        <h2 className="text-4xl md:text-6xl font-bold mt-2 mb-6 text-slate-900">
                            Trusted by <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Top Legal Minds</span>
                        </h2>
                        <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium">
                            See how LexiAI is transforming legal practices across the industry
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Testimonial 1 */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 h-full">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-700 text-lg leading-relaxed italic mb-8 relative">
                                    "LexiAI has cut my contract review time by <span className="font-bold text-orange-600">70%</span>. The accuracy in spotting risks and potential pitfalls is truly impressive. It's like having an extra associate on my team."
                                </p>

                                {/* Profile */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full blur opacity-30"></div>
                                        <div className="relative w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-orange-600">SJ</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Sarah Jenkins</h4>
                                        <p className="text-slate-600">Corporate Attorney</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-slate-500 font-medium">Partner, Jenkins & Co.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 h-full">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-700 text-lg leading-relaxed italic mb-8 relative">
                                    "The legal research tool is an absolute <span className="font-bold text-amber-600">game-changer</span>. It finds relevant precedents and statutes that I might have missed. It's like having a research team working for me 24/7."
                                </p>

                                {/* Profile */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur opacity-30"></div>
                                        <div className="relative w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-amber-600">DC</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">David Chen</h4>
                                        <p className="text-slate-600">Legal Consultant</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <FaCheckCircle className="text-green-500 text-xs" />
                                            <span className="text-xs text-slate-500 font-medium">15+ years experience</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="group relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 h-full">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-700 text-lg leading-relaxed italic mb-8 relative">
                                    "As a solo practitioner, LexiAI is like having a <span className="font-bold text-orange-600">senior partner</span> available 24/7. It handles the heavy lifting on research and document review so I can focus on what matters most—my clients."
                                </p>

                                {/* Profile */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full blur opacity-30"></div>
                                        <div className="relative w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-orange-600">ER</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Emily Rodriguez</h4>
                                        <p className="text-slate-600">Solo Practitioner</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <FaRocket className="text-orange-500 text-xs" />
                                            <span className="text-xs text-slate-500 font-medium">200+ cases handled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        <FaqItem
                            question="Is my data secure?"
                            answer="Absolutely. We use bank-grade encryption for all data transmission and storage. Your client data never trains our public models."
                        />
                        <FaqItem
                            question="Can I cancel my subscription?"
                            answer="Yes, you can cancel your subscription at any time. access continues until the end of your billing period."
                        />
                        <FaqItem
                            question="Does it support multiple jurisdictions?"
                            answer="Currently, we specialize in US and UK law, with plans to expand to other common law jurisdictions soon."
                        />
                        <FaqItem
                            question="Is there a free trial?"
                            answer="Yes! You can start with our free tier to test the core features before upgrading to Pro."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 bg-slate-900 text-slate-300">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <FaBalanceScale className="text-orange-500 text-2xl" />
                            <span className="text-2xl font-bold text-white">
                                Lexi<span className="text-orange-500">AI</span>
                            </span>
                        </div>
                        <p className="text-slate-400 mb-6">
                            Empowering legal professionals with next-generation AI tools for research, drafting, and analysis.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    © 2025 LexiAI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => {
    const colorClasses = {
        orange: "text-orange-500 bg-orange-100/50 border-orange-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500",
        amber: "text-amber-500 bg-amber-100/50 border-amber-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500",
    };

    return (
        <div className={`p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all group duration-300 hover:-translate-y-2`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${colorClasses[color]} transition-all duration-300 shadow-sm`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm group-hover:text-slate-600/90">{desc}</p>
        </div>
    );
};

const StepCard = ({ number, title, desc, delay }) => (
    <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 relative group hover:-translate-y-2 transition-transform duration-300" style={{ animationDelay: `${delay}ms` }}>
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
            {number}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-lg">{desc}</p>
    </div>
);

const TestimonialCard = ({ name, role, quote }) => (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
        <div className="text-orange-400 text-6xl font-serif mb-6 opacity-30 leading-3">"</div>
        <p className="text-slate-700 italic mb-8 leading-relaxed text-lg relative z-10">{quote}</p>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                {name[0]}
            </div>
            <div>
                <div className="font-bold text-slate-900 text-lg">{name}</div>
                <div className="text-sm text-slate-500 font-medium">{role}</div>
            </div>
        </div>
    </div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-orange-200 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors text-left"
            >
                <span className="font-bold text-lg text-slate-800">{question}</span>
                <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <FaArrowRight className="text-orange-500 rotate-90" />
                </span>
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 bg-white text-slate-600 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;