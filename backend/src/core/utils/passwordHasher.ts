import bcrypt from "bcryptjs"

type HashResult = {
    success: boolean
    hash?: string
    error?: string
}

type VerifyResult = {
    success: boolean
    isValid?: boolean
    error?: string
}

export const hashPassword = async (password: string): Promise<HashResult> => {

    try {

        if (!password || password.trim() === "") {
            return {
                success: false,
                error: "Password is required"
            }
        }

        const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 9;
        const hash = await bcrypt.hash(password, saltRounds);

        return {
            success: true,
            hash
        }

    } catch (error: any) {

        return {
            success: false,
            error: error.message || "Password hashing failed"
        }

    }

}

export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<VerifyResult> => {

    try {

        if (!password || !hashedPassword) {
            return {
                success: false,
                error: "Password and hash are required"
            }
        }

        const isValid = await bcrypt.compare(password, hashedPassword)

        return {
            success: true,
            isValid
        }

    } catch (error: any) {

        return {
            success: false,
            error: error.message || "Password verification failed"
        }

    }

}