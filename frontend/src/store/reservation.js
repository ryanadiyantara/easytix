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

export const useReservationStore = create((set) => ({
  reservations: [],
  setReservation: (reservations) => set({ reservations }),

  // Function to create a new reservation

  // Function to fetch all reservations
  fetchReservation: async () => {
    const res = await fetch("/api/reservations", {
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

    set({ reservations: data.data });
  },

  // Function to update a reservation by ID
}));
