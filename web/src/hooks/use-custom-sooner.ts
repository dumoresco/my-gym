import { toast } from "sonner";

export const useCustomSooner = () => {
  // Success sooner
  const successSooner = (message: string) => {
    return toast(message, {
      style: {
        backgroundColor: "#34D399",
        color: "#ffffff",
      },
    });
  };

  // Error sooner
  const errorSooner = (message: string) => {
    return toast(message, {
      style: {
        backgroundColor: "#EF4444",
        color: "#ffffff",
      },
    });
  };

  return { successSooner, errorSooner };
};
