import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useReservationStore = create((set) => ({
  reservations: [],
  setReservation: (reservations) => set({ reservations }),

  // Function to create a new reservation
  createReservation: async (pid, newReservation) => {
    if (!newReservation.event_id) {
      return { success: false, message: "Event not found" };
    }

    newReservation.user_id = pid;

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReservation),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    return { success: true, message: "Reservation successfully" };
  },

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
}));
