'use server';
import { db } from "@/lib/db";

export async function getStudios() {
    try {
        const studios = await db.studio.findMany();
        return studios;
    } catch (err) {
        throw new Error(`failed to get studios: ${err}`);
    }
}

export async function createStudio(name: string, description: string, image: string, price: number) {
    try {
        const studio = await db.studio.create({
            data: {
                name,
                description,
                image,
                price,
                updatedAt: new Date()
            },
        });
        return studio;
    } catch (err) {
        throw new Error(`failed to create studio: ${err}`);
    }
}

export async function deleteStudio(id: string) {
    try {
        const studio = await db.studio.delete({
            where: {
                id,
            },
        });
        return studio;
    } catch (err) {
        throw new Error(`failed to delete studio: ${err}`);
    }
}

export async function getStudioById(id: string) {
    try {
        const studio = await db.studio.findUnique({
            where: {
                id,
            },
        });
        return studio;
    } catch (err) {
        throw new Error(`failed to get studio: ${err}`);
    }
}

export async function updateStudio(id: string, data: { name: string; description: string; image: string, price: number }) {
    try {
        const studio = await db.studio.update({
            where: {
                id,
            },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        return studio;
    } catch (err) {
        throw new Error(`failed to update studio: ${err}`);
    }
}