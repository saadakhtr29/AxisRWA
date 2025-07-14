import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold text-red-500">403 - Unauthorized</h1>
    <p className="mt-4">You don’t have permission to access this page.</p>
    <Link to="/" className="text-blue-600 underline mt-4 block">
      Go to Home
    </Link>
  </div>
);

export default Unauthorized;
