import { create } from "zustand";

const token = localStorage.getItem("accessToken");

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const userInfo = token ? parseJwt(token)?.UserInfo : null;

export const useUserStore = create((set) => ({
  users: [],
  currentUser: userInfo,
  currentUsers: [],
  setUser: (users) => set({ users }),

  // Function to create a new user
  createUser: async (newUser) => {
    if (!newUser.name || !newUser.email || !newUser.user_password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    return { success: true, message: "User created successfully" };
  },

  // Create a new admin
  // Update User / Admin
  // Read User

  // Auth functions
  // Function to signin a user
  signin: async (newUser) => {
    if (!newUser.email || !newUser.user_password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();

    if (!data.success)
      return { success: false, message: "Incorrect email or password. Please try again." };

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    set((state) => ({ users: [...state.users, data.data] }));
    return { success: true, message: "Sign In successfully" };
  },

  // Function to logout a user
  logout: async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, message: "Failed to logout. Please try again." };
    }

    localStorage.removeItem("accessToken");
    set({ users: [] });
    return { success: true, message: "Logout successfully" };
  },

  // Function to handle forgot password
  forgotPassword: async (newUser) => {
    if (!newUser.email) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    return { success: true, message: data.message };
  },
}));
