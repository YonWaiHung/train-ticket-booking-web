export function generateBookingSummary(bookingDetails) {
    const { trainNumber, fromStation, toStation, departureTime, arrivalTime, coach, seatNumber, amount } = bookingDetails;
    
    return `
Booking Confirmation
--------------------
Train Number: ${trainNumber}
Origin: ${fromStation}
Destination: ${toStation}
Departure: ${new Date(departureTime).toLocaleString()} from ${fromStation}
Arrival: ${new Date(arrivalTime).toLocaleString()} at ${toStation}
Coach: ${coach}
Seat Number: ${seatNumber}
Total Amount: $${amount.toFixed(2)}

Thank you for booking with us!
`;
}