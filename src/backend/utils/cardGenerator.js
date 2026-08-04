import VirtualCard from '../models/VirtualCard.js';
import { hashData256 } from '../controllers/userController.js';

function generateCheckDigit(numberWithoutCheckDigit) {
    let sum = 0;
    let shouldDouble = true; 

    for (let i = numberWithoutCheckDigit.length - 1; i >= 0; i--) {
        let digit = parseInt(numberWithoutCheckDigit.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    let remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
}

export const generateUniqueCardDetails = async (signupDate = new Date()) => {
    // BIN for FipMoney
    const bin = "841941";
    let isUnique = false;
    
    let fullNumber = "";
    let cvv = "";
    let expiry = "";
    let detailsHash = "";

    // Generate Expiry based on signupDate + 3 years
    const month = signupDate.getMonth() + 1;
    const formattedMonth = month.toString().padStart(2, '0');
    const expiryYear = String(signupDate.getFullYear() + 3).slice(-2);
    expiry = `${formattedMonth}/${expiryYear}`;

    while (!isUnique) {
        // Generate 9 random digits for card number
        let randomDigits = "";
        for (let i = 0; i < 9; i++) {
            randomDigits += Math.floor(Math.random() * 10).toString();
        }

        const base = bin + randomDigits; // 15 digits
        const checkDigit = generateCheckDigit(base);
        fullNumber = base + checkDigit;

        // Generate CVV
        cvv = "";
        for (let i = 0; i < 3; i++) {
            cvv += Math.floor(Math.random() * 10).toString();
        }

        // Create a compound string to check strict uniqueness
        const comboString = `${fullNumber}|${expiry}|${cvv}`;
        detailsHash = hashData256(comboString);

        // Verify uniqueness against the database using the compound hash
        const existingCard = await VirtualCard.findOne({ detailsHash: detailsHash });
        if (!existingCard) {
            // Also ensure card number alone doesn't clash for extra safety
            const existingCardNumber = await VirtualCard.findOne({ cardHash: hashData256(fullNumber) });
            if (!existingCardNumber) {
                isUnique = true;
            }
        }
    }
    
    return {
        cardNumber: fullNumber,
        cvv,
        expiry,
        detailsHash,
        cardHash: hashData256(fullNumber)
    };
};
