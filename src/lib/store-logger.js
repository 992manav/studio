import { create } from "zustand";
import { mockLogs } from "../components/logger/mock-logs";

export const useLoggerStore = create((set, get) => ({
  maxLogs: 500,
  logs: [], // mockLogs,
  log: ({ date, type, message }) => {
    set((state) => {
      const prevLog = state.logs.at(-1);
      if (prevLog && prevLog.type === type && prevLog.message === message) {
        return {
          logs: [
            ...state.logs.slice(0, -1),
            {
              date,
              type,
              message,
              count: prevLog.count ? prevLog.count + 1 : 1,
            },
          ],
        };
      }
      return {
        logs: [
          ...state.logs.slice(-(get().maxLogs - 1)),
          {
            date,
            type,
            message,
          },
        ],
      };
    });
  },

  clearLogs: () => {
    console.log("clear log");
    set({ logs: [] });
  },

  setMaxLogs: (n) => set({ maxLogs: n }),
}));
