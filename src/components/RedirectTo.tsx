import { Navigate, Route } from "react-router-dom";

const RedirectTo = ({ to = "/" }) => <Navigate to={to} replace />;

export default RedirectTo;

<Route path="/new" element={<RedirectTo />} />;
