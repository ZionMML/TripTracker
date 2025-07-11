import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>This is protected page</p>
    </div>
  );
};

export default Dashboard;
