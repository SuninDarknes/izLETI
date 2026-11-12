export async function checkAuth() {
    try {
        const response = await fetch("/auth/me");

        if (response.status === 401) {
            return {
                authenticated: false,
                user: null
            };
        }

        if (!response.ok) {
            throw new Error("Could not check authentication status");
        }

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            authenticated: false,
            user: null
        };
    }
}