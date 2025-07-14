import { useContext } from "react";
import { useAuth } from "../contexts/AuthProvider";

export const useRole = () => {
  const { userRole } = useAuth();
  return userRole;
};
