"use server";
import { db } from "@/lib/db";

export async function getVouchers() {
    try {
        const vouchers = await db.voucher.findMany();
        return vouchers.map((voucher) => ({
            ...voucher,
            discount: voucher.discount?.toNumber(),
        }));
    } catch (error) {
        throw new Error(`failed to get vouchers: ${error}`);
    }
}

export async function createVoucher(name: string, discount: number, count: number) {
    try {
        const existingVoucher = await db.voucher.findFirst({
            where: { name },
        });

        if (existingVoucher) {
            throw new Error("Voucher dengan nama ini sudah ada.");
        }

        const voucher = await db.voucher.create({
            data: {
                name,
                discount,
                count,
                updatedAt: new Date(),
            },
        });
        return { ...voucher, discount: voucher.discount?.toNumber() };
    } catch (error: any) {
        if (error.message.includes("Unique constraint failed")) {
            throw new Error("Voucher dengan nama ini sudah ada.");
        }
        throw new Error(`Gagal membuat voucher: ${error.message}`);
    }
}

export async function deleteVoucher(id: number) {
    try {
        const voucher = await db.voucher.delete({
            where: {
                id,
            },
        });
        return { ...voucher, discount: voucher.discount?.toNumber() }; 
    } catch (error) {
        throw new Error(`failed to delete voucher: ${error}`);
    }
}

export async function getVoucherById(id: number) {
    try {
        const voucher = await db.voucher.findUnique({
            where: {
                id,
            },
        });
        return voucher ? { ...voucher, discount: voucher.discount?.toNumber() } : null;
    } catch (error) {
        throw new Error(`failed to get voucher: ${error}`);
    }
}

export async function updateVoucher(id: number, data: { name: string; discount: number; count: number }) {
    try {
        const existingVoucher = await db.voucher.findFirst({
            where: {
                name: data.name,
                id: { not: id },
            },
        });

        if (existingVoucher) {
            throw new Error("Voucher dengan nama ini sudah ada.");
        }

        const voucher = await db.voucher.update({
            where: { id },
            data,
        });
        return { ...voucher, discount: voucher.discount?.toNumber() ?? 0 };
    } catch (error: any) {
        if (error.message.includes("Unique constraint failed")) {
            throw new Error("Voucher dengan nama ini sudah ada.");
        }
        throw new Error(`Gagal memperbarui voucher: ${error.message}`);
    }
}

