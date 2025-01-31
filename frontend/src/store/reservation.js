import { create } from "zustand";

const token = localStorage.getItem("accessToken");

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

  // Function to cancel a reservation by ID
  cancelReservation: async (pid) => {
    const cancelReservation = {
      status: "Cancelled",
    };

    const res = await fetch(`/api/reservations/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cancelReservation),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/signin?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      reservations: state.reservations.map((reservation) =>
        reservation._id === pid ? data.data : reservation
      ),
    }));
    return { success: true, message: data.message };
  },
}));
