"use client";

import { create } from "zustand";
import { Property } from "@/types";
import { mockProperties } from "@/data/mock-data";

interface PropertyStore {
  properties: Property[];

  // Actions
  addProperty: (property: Omit<Property, "id" | "createdAt">) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string) => void;
  updateAvailability: (id: string, availableRooms: number) => void;

  // Getters
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByLandlord: (landlordId: string) => Property[];
  getApprovedProperties: () => Property[];
  getPendingProperties: () => Property[];
  getFilteredProperties: (filters: PropertyFilters) => Property[];
}

export interface PropertyFilters {
  minBudget?: number;
  maxBudget?: number;
  propertyType?: string;
  amenities?: string[];
  searchQuery?: string;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: mockProperties,

  addProperty: (property) => {
    const newProperty: Property = {
      ...property,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ properties: [...state.properties, newProperty] }));
  },

  updateProperty: (id, updates) => {
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProperty: (id) => {
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    }));
  },

  approveProperty: (id) => {
    get().updateProperty(id, { status: "approved" });
  },

  rejectProperty: (id) => {
    get().updateProperty(id, { status: "rejected" });
  },

  updateAvailability: (id, availableRooms) => {
    get().updateProperty(id, { availableRooms });
  },

  getPropertyById: (id) => {
    return get().properties.find((p) => p.id === id);
  },

  getPropertiesByLandlord: (landlordId) => {
    return get().properties.filter((p) => p.landlordId === landlordId);
  },

  getApprovedProperties: () => {
    return get().properties.filter((p) => p.status === "approved");
  },

  getPendingProperties: () => {
    return get().properties.filter((p) => p.status === "pending");
  },

  getFilteredProperties: (filters) => {
    let results = get().getApprovedProperties();

    if (filters.minBudget) {
      results = results.filter((p) => p.monthlyRent >= filters.minBudget!);
    }
    if (filters.maxBudget) {
      results = results.filter((p) => p.monthlyRent <= filters.maxBudget!);
    }
    if (filters.propertyType) {
      results = results.filter((p) => p.propertyType === filters.propertyType);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter((p) =>
        filters.amenities!.every((a) => p.amenities.includes(a))
      );
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return results;
  },
}));
