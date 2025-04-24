'use server';
import { db } from "@/lib/db";

export async function getAddons() {
    try {
        const addons = await db.addon.findMany({
            where: { 
                is_deleted: false,
             },
        });
        return addons;
    } catch (err) {
        throw new Error(`Failed to get addons: ${err}`);
    }
}

export async function getNonBackgroundAddons() {
    try {
        const addons = await db.addon.findMany({
            where: { 
                is_deleted: false,
                isBackground: false,
             },
        });
        return addons;
    } catch (err) {
        throw new Error(`Failed to get addons: ${err}`);
    }
}

export async function getBackgroundAddons() {
    try {
        const addons = await db.addon.findMany({
            where: { 
                is_deleted: false,
                isBackground: true,
             },
        });
        return addons;
    } catch (err) {
        throw new Error(`Failed to get addons: ${err}`);
    }
}

export async function createAddon(name: string, price: number, isBackground: boolean, colorHex?: string | null) {
    try {
        const addon = await db.addon.create({
            data: {
                name,
                price,
                isBackground,
                colorHex: colorHex || null,
                updatedAt: new Date()
            },
        });
        return addon;
    } catch (err) {
        throw new Error(`Failed to create addon: ${err}`);
    }
}

export async function deleteAddon(id: string) {
    try {
        const addon = await db.addon.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() },
        });
        return addon;
    } catch (err) {
        throw new Error(`Failed to delete addon: ${err}`);
    }
}

export async function getAddonById(id: string) {
    try {
        const addon = await db.addon.findUnique({
            where: {
                id,
                is_deleted: false,
            },
        });
        return addon;
    } catch (err) {
        throw new Error(`Failed to get addon: ${err}`);
    }
}

export async function updateAddon(id: string, data: { name: string; price: number, isBackground: boolean, colorHex?: string | null }) {
    try {
        const addon = await db.addon.update({
            where: {
                id,
            },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        return addon;
    } catch (err) {
        throw new Error(`Failed to update addon: ${err}`);
    }
}
