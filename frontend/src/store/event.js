import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useEventStore = create((set) => ({
  events: [],
  setEvent: (events) => set({ events }),

  // Function to create a new event
  createEvent: async (newEvent) => {
    if (
      !newEvent.name ||
      !newEvent.start_date ||
      !newEvent.end_date ||
      !newEvent.venue ||
      !newEvent.description ||
      !newEvent.categories ||
      !newEvent.quantity
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("name", newEvent.name);
    formData.append("start_date", newEvent.start_date);
    formData.append("end_date", newEvent.end_date);
    formData.append("venue", newEvent.venue);
    formData.append("description", newEvent.description);
    formData.append("categories", newEvent.categories);
    formData.append("file", newEvent.poster);
    formData.append("quantity", newEvent.quantity);

    const res = await fetch("/api/events", {
      method: "POST",
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
    set((state) => ({ events: [...state.events, data.data] }));
    return { success: true, message: "Event created successfully" };
  },

  fetchEvent: async () => {
    const res = await fetch("/api/events", {
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

    set({ events: data.data });
  },

  updateEvent: async (pid, updatedEvent) => {
    if (
      !updatedEvent.name ||
      !updatedEvent.start_date ||
      !updatedEvent.end_date ||
      !updatedEvent.venue ||
      !updatedEvent.description ||
      !updatedEvent.categories ||
      !updatedEvent.quantity
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("name", updatedEvent.name);
    formData.append("start_date", updatedEvent.start_date);
    formData.append("end_date", updatedEvent.end_date);
    formData.append("venue", updatedEvent.venue);
    formData.append("description", updatedEvent.description);
    formData.append("categories", updatedEvent.categories);
    formData.append("file", updatedEvent.poster);
    formData.append("quantity", updatedEvent.quantity);

    const res = await fetch(`/api/events/${pid}`, {
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
      events: state.events.map((event) => (event._id === pid ? data.data : event)),
    }));
    return { success: true, message: data.message };
  },

  deleteEvent: async (pid) => {
    const deletedEvent = {
      na: true,
    };

    const res = await fetch(`/api/events/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletedEvent),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/signin?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      events: state.events.filter((event) => event._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
