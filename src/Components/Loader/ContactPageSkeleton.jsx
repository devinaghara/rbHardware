import React from 'react';
import { SkeletonItem } from './SkeletonLoading';

export const ContactPageSkeleton = () => (
    <div className="contact-us bg-gray-100 p-6 min-h-screen flex flex-col items-center mt-20">
        {/* Map Skeleton */}
        <div className="w-full flex flex-col items-center mb-8">
            <SkeletonItem className="h-8 w-48 mx-auto mb-6" />
            <div className="w-full" style={{ height: '450px' }}>
                <SkeletonItem className="h-full w-full rounded-lg" />
            </div>
        </div>

        {/* Contact Form Skeleton */}
        <div className="w-full max-w-4xl bg-slate-50 shadow-md rounded-lg p-6 mt-6">
            <div className="flex flex-col lg:flex-row mb-8">
                {/* Contact Information Skeleton */}
                <div className="w-full lg:w-1/2 flex flex-col items-start justify-center mb-8 lg:mb-0 lg:pr-8">
                    <SkeletonItem className="h-6 w-48 mb-6" />
                    
                    {/* Address, Email, Phone Skeletons */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center w-full mb-4">
                            <SkeletonItem className="h-6 w-6 rounded-full mr-3" />
                            <SkeletonItem className="h-5 w-3/4" />
                        </div>
                    ))}
                </div>

                {/* Form Fields Skeleton */}
                <div className="w-full lg:w-1/2">
                    <SkeletonItem className="h-6 w-40 mb-6" />
                    <div className="flex flex-col space-y-4">
                        <SkeletonItem className="h-12 w-full rounded-md" />
                        <SkeletonItem className="h-12 w-full rounded-md" />
                        <SkeletonItem className="h-12 w-full rounded-md" />
                        <SkeletonItem className="h-32 w-full rounded-md" />
                        <SkeletonItem className="h-12 w-32 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ContactPageSkeleton;