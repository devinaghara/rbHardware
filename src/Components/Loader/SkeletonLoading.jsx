import React from 'react';

// Base skeleton component with pulse animation
export const SkeletonItem = ({ className = "" }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
);

// Product card skeleton
export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="p-4">
            <SkeletonItem className="h-5 w-3/4 mb-3" />
            <SkeletonItem className="h-4 w-1/2 mb-3" />
            <SkeletonItem className="h-8 w-1/4" />
        </div>
    </div>
);

// Filter section skeleton
export const FilterSkeleton = () => (
    <div className="animate-pulse">
        <SkeletonItem className="h-6 w-24 mb-4" />
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
                <SkeletonItem className="h-4 w-4" />
                <SkeletonItem className="h-4 w-20" />
            </div>
        ))}
    </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
    <div className="container grid gap-4 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="flex flex-col items-center lg:items-start justify-center space-y-4">
            <SkeletonItem className="h-10 w-3/4" />
            <SkeletonItem className="h-4 w-full mb-1" />
            <SkeletonItem className="h-4 w-full mb-1" />
            <SkeletonItem className="h-4 w-full mb-1" />
            <SkeletonItem className="h-4 w-2/3 mb-1" />
            <SkeletonItem className="h-10 w-32" />
        </div>
        <SkeletonItem className="mx-auto aspect-[4/3] w-full rounded-xl" />
    </div>
);

// Feature product slide skeleton
export const FeatureProductSlideSkeleton = () => (
    <div className="w-full px-4 py-8">
        <SkeletonItem className="h-8 w-48 mx-auto mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

// Facts section skeleton
export const FactsSkeleton = () => (
    <div className="w-full px-4 py-8">
        <SkeletonItem className="h-8 w-32 mx-auto mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center p-4">
                    <SkeletonItem className="h-12 w-12 rounded-full mb-3" />
                    <SkeletonItem className="h-6 w-16 mb-2" />
                    <SkeletonItem className="h-4 w-24" />
                </div>
            ))}
        </div>
    </div>
);

// Why us section skeleton
export const WhyUsSkeleton = () => (
    <div className="w-full px-4 py-8">
        <SkeletonItem className="h-8 w-32 mx-auto mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                    <SkeletonItem className="h-10 w-10 rounded-full mb-3" />
                    <SkeletonItem className="h-6 w-24 mb-2" />
                    <SkeletonItem className="h-4 w-full mb-1" />
                    <SkeletonItem className="h-4 w-full mb-1" />
                    <SkeletonItem className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    </div>
);

// About us section skeleton
export const AboutUsSkeleton = () => (
    <div className="w-full px-4 py-8">
        <SkeletonItem className="h-8 w-48 mx-auto mb-6" />
        <div className="flex flex-col md:flex-row gap-6">
            <SkeletonItem className="w-full md:w-1/2 h-64 rounded-lg" />
            <div className="w-full md:w-1/2">
                <SkeletonItem className="h-4 w-full mb-2" />
                <SkeletonItem className="h-4 w-full mb-2" />
                <SkeletonItem className="h-4 w-full mb-2" />
                <SkeletonItem className="h-4 w-full mb-2" />
                <SkeletonItem className="h-4 w-3/4 mb-2" />
            </div>
        </div>
    </div>
);