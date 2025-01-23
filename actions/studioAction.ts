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

export async function createStudio(name: string, description: string, image: string) {
    try {
        const studio = await db.studio.create({
            data: {
                name,
                description,
                image,
            },
        });
        return studio;
    } catch (err) {
        throw new Error(`failed to create studio: ${err}`);
    }
}

export async function deleteStudio(id: number) {
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