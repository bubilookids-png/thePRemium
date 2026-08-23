import React from 'react';
export function SkeletonLine({ w = 'w-full' }: { w?: string }) { return <div className={`skeleton ${w}`} />; }
export function SkeletonBlock() { return <div className="space-y-3"><SkeletonLine w="w-1/3" /><SkeletonLine /><SkeletonLine w="w-5/6" /><SkeletonLine w="w-2/3" /></div>; }
