#!/bin/bash

# This script runs the Fleet Analytics Dashboard in development mode

# Function to show menu
show_menu() {
  echo "Fleet Analytics Dashboard"
  echo "=========================="
  echo "1) Run development server"
  echo "2) Run performance tests"
  echo "3) Run both"
  echo "q) Exit"
  echo "=========================="
  echo "Enter choice: "
}

# Function to run development server
run_dev_server() {
  # Set the main entry point to our fleet analytics app
  echo "Configuring vite to use fleet-main.tsx as entry point..."
  cp src/fleet-main.tsx src/main.tsx.backup
  cp src/fleet-main.tsx src/main.tsx

  # Run the dev server
  echo "Starting development server..."
  npm run dev

  # Restore the original main.tsx
  echo "Restoring original main.tsx..."
  mv src/main.tsx.backup src/main.tsx
}

# Function to run performance tests
run_performance_tests() {
  echo "Running performance tests..."
  ./test-fleet-performance.sh
}

# Main execution
if [[ $1 == "--dev" ]]; then
  run_dev_server
elif [[ $1 == "--perf" ]]; then
  run_performance_tests
elif [[ $1 == "--all" ]]; then
  run_performance_tests
  run_dev_server
else
  # Interactive menu
  show_menu
  read -r choice

  case $choice in
    1) run_dev_server ;;
    2) run_performance_tests ;;
    3) run_performance_tests && run_dev_server ;;
    q|Q) echo "Exiting..." && exit 0 ;;
    *) echo "Invalid option" && exit 1 ;;
  esac
fi
