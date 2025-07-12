import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {KindeRoles} from "@kinde-oss/kinde-auth-nextjs/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function isAdmin(roles: KindeRoles) {
  return roles.some(role => role.key === 'admin');
}