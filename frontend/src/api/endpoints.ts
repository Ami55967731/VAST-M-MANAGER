export const ENDPOINTS = {
  auth: {
    register: "/auth/signup",
    login: "/auth/login",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    verifyOtp: "/auth/verify-otp",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
  },

  user: {
    profile: "/user",
    getOne: "/user/one",
    update: (id: string) => `/user/${id}`,
    delete: (id: string) => `/user/${id}`,
  },

  meetings: {
    all: "/meetings",
    create: "/meetings/create",
    update: (id: string) => `/meetings/update/${id}`,
    delete: (id: string) => `/meetings/${id}`,
    status: (id: string) => `/meetings/status/${id}`,
    updateStatus: "/meetings/status",
  },
};