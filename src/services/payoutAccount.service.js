import api from "../utils/axiosInstance";

const unwrap = (res) => {
  if (!res) return res;
  if (res.success !== undefined && res.data !== undefined) return res.data;
  if (res.data !== undefined) return res.data;
  return res;
};

export const payoutAccountService = {
  getMe: async () => {
    const { data } = await api.get("/payout-account/me");
    return unwrap(data);
  },
  createMe: async (payload) => {
    const { data } = await api.post("/payout-account/me", payload);
    return unwrap(data);
  },
  patchMe: async (payload) => {
    const { data } = await api.patch("/payout-account/me", payload);
    return unwrap(data);
  },
};
