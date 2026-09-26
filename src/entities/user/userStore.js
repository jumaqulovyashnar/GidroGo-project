import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      userInfo: null,
      userToken: null,
      actions: {
        setUserInfo: (userInfo) => set({ userInfo }),
        setUserInfoAndToken: (userInfo, userToken) =>
          set({ userInfo, userToken }),
        clearUserInfoAndToken: () =>
          set({ userInfo: null, userToken: null }),
      },
    }),
    {
      name: "gidrogo-user-storage",
      partialize: (state) => ({
        userInfo: state.userInfo,
        userToken: state.userToken,
      }),
    }
  )
)
export default useUserStore;