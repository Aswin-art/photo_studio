export const convertBookingSession = (bookingSession: number): string => {
    switch (bookingSession) {
        case 1:
            return "09:00";
        case 2:
            return "09:30";
        case 3:
            return "10:00";
        case 4:
            return "10:30";
        case 5:
            return "11:00";
        case 6:
            return "11:30";
        case 7:
            return "12:00";
        case 8:
            return "12:30";
        case 9:
            return "13:00";
        case 10:
            return "13:30";
        case 11:
            return "14:00";
        case 12:
            return "14:30";
        case 13:
            return "15:00";
        case 14:
            return "15:30";
        case 15:
            return "16:00";
        case 16:
            return "16:30";
        case 17:
            return "17:00";
        case 18:
            return "17:30";
        case 19:
            return "18:00";
        case 20:
            return "18:30";
        case 21:
            return "19:00";
        case 22:
            return "19:30";
        case 23:
            return "20:00";
        case 24:
            return "20:30";
        default:
            return "Unknown";
    }
}