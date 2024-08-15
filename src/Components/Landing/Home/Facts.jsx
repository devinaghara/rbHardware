import React from 'react';

const Facts = () => {
    return (
        <div className="w-full py-20">
            {/* Header */}
            <div className="space-y-2 mb-12 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Facts</h1>
            </div>
            {/* Facts Grid */}
            <div className="w-full py-20 bg-zinc-900 justify-center max-w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-orange-500">1998</h2>
                    <p className="text-white">Year of Establishment</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-orange-500">Manufacturer</h2>
                    <p className="text-white">Nature of Business</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-orange-500">80+</h2>
                    <p className="text-white">Active Clients</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-orange-500">50+</h2>
                    <p className="text-white">Workers</p>
                </div>
            </div>
        </div>
    );
};

export default Facts;
