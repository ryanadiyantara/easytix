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
  setUser: (currentUsers) => set({ currentUsers }),

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

  // Function to fetch all users
  fetchUser: async () => {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/signin?message=Session Expired`;
      return;
    }

    const data = await res.json();

    set({ users: data.data });
  },

  // Function to fetch current user
  fetchCurrentUser: async () => {
    const res = await fetch(`/api/users/${userInfo.pid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/signin?message=Session Expired`;
      return;
    }

    const data = await res.json();

    set({ currentUsers: data.data });
  },

  // Function to update a user by ID
  updateUser: async (pid, updatedUser) => {
    if (!updatedUser.name || !updatedUser.email) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("name", updatedUser.name);
    formData.append("email", updatedUser.email);
    formData.append("file", updatedUser.profilePict);

    const res = await fetch(`/api/users/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/signin?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      users: state.users.map((user) => (user._id === pid ? data.data : user)),
    }));
    return { success: true, message: data.message };
  },

  // Function to update a user password by ID
  changePassword: async (pid, currentEmail, changedPassword) => {
    if (!changedPassword.old_password || !changedPassword.new_password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("old_password", changedPassword.old_password);
    formData.append("new_password", changedPassword.new_password);
    formData.append("currentEmail", currentEmail);

    const res = await fetch(`/api/users/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/signin?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      users: state.users.filter((user) => user._id !== pid),
    }));
    return { success: true, message: data.message };
  },

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
    return { success: true, message: "Sign In successfully", role: data.role };
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
