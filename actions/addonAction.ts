'use server';
import { db } from "@/lib/db";

export async function getAddons() {
    try {
        const addons = await db.addon.findMany({
            where: { is_deleted: false },
        });
        return addons;
    } catch (err) {
        throw new Error(`Failed to get addons: ${err}`);
    }
}

export async function createAddon(name: string, price: number) {
    try {
        const addon = await db.addon.create({
            data: {
                name,
                price,
                updatedAt: new Date()
            },
        });
        return addon;
    } catch (err) {
        throw new Error(`Failed to create addon: ${err}`);
    }
}

export async function deleteAddon(id: number) {
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

export async function getAddonById(id: number) {
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

export async function updateAddon(id: number, data: { name: string; price: number }) {
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
