'use server';
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from 'date-fns';
import { pusher } from "@/lib/pusher";
import { formatDateToWIB } from "@/utils/dateConvert";
import { generateChannelCode } from "./channels";

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
            },
            orderBy: {
                createdAt: 'desc' 
            }
        });
        return transactions.map(transaction => ({
            ...transaction,
            voucher: transaction.voucher
                ? { ...transaction.voucher, discount: transaction.voucher.discount ? Number(transaction.voucher.discount) : null }
                : null,
        }));
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
        return transactions.map((transaction) => ({
            ...transaction,
            voucher: transaction.voucher
                ? {
                      ...transaction.voucher,
                      discount: transaction.voucher.discount ? transaction.voucher.discount.toNumber() : null,
                  }
                : null,
        }));
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
            data: { isApproved, updatedAt: new Date() },
        });

        if (isApproved === true) {
            const channelCode = await generateChannelCode();
        
            await db.channels.create({
                data: {
                  code: channelCode,
                  email: transaction.customerEmail,
                  phone: transaction.customerPhone,
                },
            });
        }

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

export async function createBooking(
    studioId: number,
    bookingDate: string,
    bookingTime: number,
    customerData: {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
    },
    voucherId?: number,
    addons?: { addonId: number; quantity: number }[]
) {
    try {
        const targetDate = new Date(formatDateToWIB(bookingDate));
        
        const existingBooking = await db.customertransaction.findFirst({
            where: {
                studioId,
                bookingDate: {
                    gte: startOfDay(targetDate),
                    lte: endOfDay(targetDate)
                },
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

        const studio = await db.studio.findUnique({
            where: { id: studioId },
            select: { price: true },
        });

        if (!studio) {
            throw new Error("Studio tidak ditemukan!");
        }

        let addonsPrice = 0;
        if (addons && addons.length > 0) {
            const addonPrices = await db.addon.findMany({
                where: {
                    id: {
                        in: addons.map(addon => addon.addonId)
                    }
                },
                select: {
                    id: true,
                    price: true
                }
            });

            addonsPrice = addons.reduce((total, addon) => {
                const addonPrice = addonPrices.find(ap => ap.id === addon.addonId)?.price || 0;
                return total + (addonPrice * addon.quantity);
            }, 0);
        }

        let discountPercentage = 0;
        if (voucherId) {
            const voucher = await db.voucher.findUnique({
                where: { id: voucherId, is_deleted: false },
                select: { discount: true, count: true }
            });

            if (!voucher) {
                throw new Error("Voucher tidak ditemukan!");
            }

            if (voucher.count <= 0) {
                throw new Error("Voucher sudah habis!");
            }

            discountPercentage = voucher.discount ? Number(voucher.discount) : 0;
        }

        const subtotal = studio.price + addonsPrice;
        const discount = (subtotal * discountPercentage) / 100;
        const totalPrice = subtotal - discount;

        const booking = await db.customertransaction.create({
            data: {
                studioId,
                bookingDate: targetDate,
                bookingTime,
                totalPrice,
                ...customerData,
                voucherId,
                isApproved: null,
                updatedAt: new Date(),

                customeraddon: addons && addons.length > 0 ? {
                    create: addons.map((addon) => ({
                        addonId: addon.addonId,
                        quantity: addon.quantity,
                        updatedAt: new Date(),
                    })),
                } : undefined,
            },
            include: {
                customeraddon: true,
                studio: true,
                voucher: true,
            }
        });

        if (voucherId) {
            await db.voucher.update({
                where: { id: voucherId, is_deleted: false, },
                data: {
                    count: { decrement: 1 }
                }
            });
        }

        await pusher.trigger("booking-channel", "new-booking", { customerName: booking.customerName });

        return booking;
    } catch (err) {
        throw new Error(`Gagal membuat booking: ${err}`);
    }
}

export async function getDailySessions(studioId: number, bookingDate: string) {
    try {
        const today = new Date();
        const todayCompare = new Date();
        todayCompare.setHours(0, 0, 0, 0);
        
        const targetDate = new Date(bookingDate);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate < todayCompare) {
            return {
                sessions: [],
                message: "Tanggal sudah lewat, tidak bisa melakukan booking."
            };
        }

        let relatedStudioIds = [studioId];

        if (studioId === 1) {
            relatedStudioIds.push(2);
        } else if (studioId === 2) {
            relatedStudioIds.push(1);
        }

        const holiday = await db.holiday.findFirst({
            where: { 
                date: {
                    equals: targetDate
                }
            },
            select: { description: true },
        });

        if (holiday) {
            return {
                sessions: [],
                message: holiday.description
            };
        }

        const bookedSessions = await db.customertransaction.findMany({
            where: {
                bookingDate: {
                    gte: startOfDay(targetDate),
                    lte: endOfDay(targetDate)
                },
                studioId: { in: relatedStudioIds },
                OR: [
                    { isApproved: null },
                    { isApproved: true },
                ],
            },
            select: { bookingTime: true },
        });

        const bookedTimes = new Set(bookedSessions.map(session => session.bookingTime));

        let currentSession = 1;
        if (targetDate.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            currentSession = Math.ceil(((currentHour - 8) * 60 + currentMinute) / 30) + 1;
            currentSession = Math.max(1, currentSession);
        }

        const sessions = Array.from({ length: 24 }, (_, i) => {
            const sessionNumber = i + 1;
            return {
                sesi: sessionNumber,
                isAvailable: !bookedTimes.has(sessionNumber),
            };
        }).filter(session => session.sesi >= currentSession);

        return {
            sessions,
            message: null
        };
    } catch (err) {
        console.error('Error in getDailySessions:', err);
        throw new Error(`Failed to get daily sessions: ${err}`);
    }
}