export const convertBookingSession = (bookingSession: number): string => {
    switch (bookingSession) {
        case 1:
            return "08:00 - 08:29";
        case 2:
            return "08:30 - 08:59";
        case 3:
            return "09:00 - 09:29";
        case 4:
            return "09:30 - 09:59";
        case 5:
            return "10:00 - 10:29";
        case 6:
            return "10:30 - 10:59";
        case 7:
            return "11:00 - 11:29";
        case 8:
            return "11:30 - 11:59";
        case 9:
            return "12:00 - 12:29";
        case 10:
            return "12:30 - 12:59";
        case 11:
            return "13:00 - 13:29";
        case 12:
            return "13:30 - 13:59";
        case 13:
            return "14:00 - 14:29";
        case 14:
            return "14:30 - 14:59";
        case 15:
            return "15:00 - 15:29";
        case 16:
            return "15:30 - 15:59";
        case 17:
            return "16:00 - 16:29";
        case 18:
            return "16:30 - 16:59";
        case 19:
            return "17:00 - 17:29";
        case 20:
            return "17:30 - 17:59";
        case 21:
            return "18:00 - 18:29";
        case 22:
            return "18:30 - 18:59";
        case 23:
            return "19:00 - 19:29";
        case 24:
            return "19:30 - 19:59";
        default:
            return "Unknown";
    }
}