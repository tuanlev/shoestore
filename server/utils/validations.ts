export const validatetion = {
     validateEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    validatePassword: (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    },
    validatePhoneNumber: (phoneNumber: string): boolean => {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phoneNumber);
    },
    validateUsername: (username: string): boolean => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    },
    validateName: (name: string): boolean => {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name);
    }
    
}