import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./src/App";
import "@testing-library/jest-dom";


test("renders dashboard and sidebar", () => {
  render(<App />);
  // Sidebar title
  expect(screen.getByText(/MATANUSKA TRANSPORT/i)).toBeInTheDocument();
  // Dashboard header
  expect(screen.getByText(/Fleet Analytics Dashboard/i)).toBeInTheDocument();
  // Filters label
  expect(screen.getByText(/Filters/i)).toBeInTheDocument();
});
