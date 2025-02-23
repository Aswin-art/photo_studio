"use server";
import { db } from "@/lib/db";

export async function getVouchers() {
    try {
        const vouchers = await db.voucher.findMany({
            where: { is_deleted: false },
        });
        return vouchers.map((voucher) => ({
            ...voucher,
            discount: voucher.discount ? voucher.discount.toNumber() : null,
        }));
    } catch (error) {
        throw new Error(`failed to get vouchers: ${error}`);
    }
}

export async function createVoucher(name: string, discount: number, count: number) {
    try {
        const existingVoucher = await db.voucher.findFirst({
            where: { name, is_deleted: false, },
        });

        if (existingVoucher) {
            throw new Error("Voucher dengan nama ini sudah ada.");
        }

        const voucher = await db.voucher.create({
            data: {
                name,
                discount,
                count,
                is_deleted: false,
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

export async function deleteVoucher(id: string) {
    try {
        const voucher = await db.voucher.update({
            where: { id },
            data: { is_deleted: true, updatedAt: new Date() },
        });

        return { ...voucher, discount: voucher.discount?.toNumber() };
    } catch (error) {
        throw new Error(`failed to soft delete voucher: ${error}`);
    }
}

export async function getVoucherById(id: string) {
    try {
        const voucher = await db.voucher.findUnique({
            where: {
                id,
                is_deleted: false,
            },
        });
        return voucher ? { ...voucher, discount: voucher.discount?.toNumber() } : null;
    } catch (error) {
        throw new Error(`failed to get voucher: ${error}`);
    }
}

export async function updateVoucher(id: string, data: { name: string; discount: number; count: number }) {
    try {
        const existingVoucher = await db.voucher.findFirst({
            where: {
                name: data.name,
                id: { not: id },
                is_deleted: false,
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

export async function getVoucherByName(name: string) {
    try {
        const voucher = await db.voucher.findFirst({
            where: {
                name: name,
                is_deleted: false,
                count: {
                    gt: 0
                }
            },
        });
        
        return voucher ? { 
            ...voucher, 
            discount: voucher.discount?.toNumber() 
        } : null;
    } catch (error) {
        throw new Error(`Failed to get voucher by name: ${error}`);
    }
}
