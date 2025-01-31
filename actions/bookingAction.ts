'use server';
import { db } from "@/lib/db";

export async function getTransactions() {
    try {
        const transactions = await db.customertransaction.findMany({
            include: {
                studio: true,
                voucher: true,
                customeraddon: {
                    include: {
                        addon: true
                    }
                }
            }
        });
        return transactions;
    } catch (err) {
        throw new Error(`Failed to get transactions: ${err}`);
    }
}

export async function getTransactionsByFilter(studioId?: number | undefined, isApproved?: boolean | null) {
    try {
        const transactions = await db.customertransaction.findMany({
            where: {
                ...(studioId !== undefined && { studioId }),
                ...(isApproved !== undefined && { isApproved })
            },
            include: {
                studio: true,
                voucher: true,
                customeraddon: {
                    include: {
                        addon: true
                    }
                }
            }
        });
        return transactions;
    } catch (err) {
        throw new Error(`Failed to get transactions: ${err}`);
    }
}

export async function getAllCustomerTransactions() {
    try {
        const transactions = await db.customertransaction.findMany({
            include: {
                studio: {
                    select: { name: true }
                },
                voucher: {
                    select: { name: true }
                },
                customeraddon: {
                    select: {
                        addon: { select: { name: true, price: true } },
                        quantity: true
                    }
                }
            }
        });

        return transactions.map(transaction => ({
            id: transaction.id,
            studioName: transaction.studio?.name || "N/A",
            customerName: transaction.customerName,
            customerEmail: transaction.customerEmail,
            customerPhone: transaction.customerPhone,
            totalPrice: transaction.totalPrice,
            bookingDate: transaction.bookingDate,
            bookingTime: transaction.bookingTime,
            isApproved: transaction.isApproved,
            voucher: transaction.voucher?.name || null,
            addons: transaction.customeraddon.map(ca => ({
                name: ca.addon.name,
                price: ca.addon.price,
                quantity: ca.quantity,
                total: ca.addon.price * ca.quantity
            }))
        }));
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Gagal mengambil data transaksi: ${error.message}`);
        } else {
            throw new Error('Gagal mengambil data transaksi: Unknown error');
        }
    }
}

export async function updateTransactionApproval(transactionId: number, isApproved: boolean | null) {
    try {
        const transaction = await db.customertransaction.update({
            where: { id: transactionId },
            data: { isApproved, updatedAt: new Date() }
        });

        return {
            message: "Status transaksi berhasil diperbarui",
            transaction
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Gagal memperbarui status transaksi: ${error.message}`);
        } else {
            throw new Error('Gagal memperbarui status transaksi: Unknown error');
        }
    }
}

export async function createBooking(studioId: number, bookingDate: string, bookingTime: number, customerData: any) {
    try {
        const existingBooking = await db.customertransaction.findFirst({
            where: {
                studioId,
                bookingDate: new Date(bookingDate),
                bookingTime,
                OR: [
                    { isApproved: null },
                    { isApproved: true },
                ],
            },
        });

        if (existingBooking) {
            throw new Error("Sesi ini sudah dibooking oleh orang lain!");
        }

        const booking = await db.customertransaction.create({
            data: {
                studioId,
                bookingDate: new Date(bookingDate),
                bookingTime,
                ...customerData,
                isApproved: null,
                updatedAt: new Date(),
            },
        });

        return booking;
    } catch (err) {
        throw new Error(`Gagal membuat booking: ${err}`);
    }
}

export async function getDailySessions(studioId: number, bookingDate: string) {
    try {
        const bookedSessions = await db.customertransaction.findMany({
            where: {
                studioId,
                bookingDate: new Date(bookingDate),
                OR: [
                    { isApproved: null },
                    { isApproved: true },
                ],
            },
            select: {
                bookingTime: true,
            },
        });

        const bookedTimes = new Set(bookedSessions.map(session => session.bookingTime));

        const sessions = Array.from({ length: 24 }, (_, i) => ({
            sesi: i + 1,
            isAvailable: !bookedTimes.has(i + 1),
        }));

        return sessions;
    } catch (err) {
        throw new Error(`Failed to get daily sessions: ${err}`);
    }
}