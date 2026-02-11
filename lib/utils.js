import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatLeetCodeLink(link) {
    if (!link) return "";
    // Remove protocol and domain
    let slug = link.replace('https://leetcode.com/problems/', '').replace(/\/$/, '');
    // If slug is still too long (e.g. > 30 chars), truncate it
    if (slug.length > 25) {
        return slug.substring(0, 22) + '...';
    }
    return slug;
}
