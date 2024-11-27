import { create } from "zustand";

const useLoggedUserStore = create((set) => {
    // Retrieve user data from local storage
    const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

    // Check if the user exists and if lastLoginAt is within the last 7 days
    const isLoggedIn = storedUser && storedUser.lastLoginAt && (Date.now() - storedUser.lastLoginAt < 7 * 24 * 60 * 60 * 1000);

    return {
        user: storedUser || null, // Initialize user to stored user or null
        isLoggedIn: isLoggedIn, // Set isLoggedIn based on the check
        setUser: (user) => {
            set({ user, isLoggedIn: true });
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(user)); // Save user data to local storage
            }
        },
        isLoading: true,
        setLoading: (isLoading) => set({ isLoading }),
    };
});

export default useLoggedUserStore;
