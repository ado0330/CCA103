"use client";

import { create } from "zustand";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mock-data";

interface UserStore {
  users: User[];
  currentUser: User;
  currentRole: UserRole;

  // Actions
  setCurrentRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  suspendUser: (id: string) => void;
  reactivateUser: (id: string) => void;
  verifyUser: (id: string) => void;

  // Getters
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: UserRole) => User[];
}

// Default to student s1
const defaultUser = mockUsers.find((u) => u.id === "s1")!;

export const useUserStore = create<UserStore>((set, get) => ({
  users: mockUsers,
  currentUser: defaultUser,
  currentRole: "student",

  setCurrentRole: (role: UserRole) => {
    const users = get().users;
    // Pick the first user of that role
    const roleUser = users.find((u) => u.role === role && u.status === "active");
    if (roleUser) {
      set({ currentRole: role, currentUser: roleUser });
    }
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user, currentRole: user.role });
  },

  updateUser: (id: string, updates: Partial<User>) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      currentUser:
        state.currentUser.id === id
          ? { ...state.currentUser, ...updates }
          : state.currentUser,
    }));
  },

  suspendUser: (id: string) => {
    get().updateUser(id, { status: "suspended" });
  },

  reactivateUser: (id: string) => {
    get().updateUser(id, { status: "active" });
  },

  verifyUser: (id: string) => {
    get().updateUser(id, { verified: true });
  },

  getUserById: (id: string) => {
    return get().users.find((u) => u.id === id);
  },

  getUsersByRole: (role: UserRole) => {
    return get().users.filter((u) => u.role === role);
  },
}));
