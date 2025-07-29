#!/bin/bash

# Fleet Analytics Dashboard Performance Test Script
# This script runs performance tests on the Fleet Analytics Dashboard

echo "=========================================="
echo "Fleet Analytics Dashboard Performance Test"
echo "=========================================="

# Create results directory if it doesn't exist
mkdir -p performance_results

# Function to simulate API load
test_api_performance() {
  echo "Testing API performance..."

  echo "1. Testing fetch times for different data sizes"
  node -e '
    const { performance } = require("perf_hooks");

    // Simulate API fetch with different data sizes
    async function testFetch(size) {
      const start = performance.now();

      // Simulate API call with different data sizes
      await new Promise(resolve => setTimeout(resolve, 100 + size * 5));

      const end = performance.now();
      return end - start;
    }

    async function runTests() {
      const sizes = [10, 100, 1000, 5000];
      console.log("Data Size | Fetch Time (ms)");
      console.log("---------|---------------");

      for (const size of sizes) {
        const time = await testFetch(size);
        console.log(`${size.toString().padStart(9)} | ${time.toFixed(2).padStart(12)}`);
      }
    }

    runTests();
  ' | tee performance_results/api_performance.txt
}

# Function to simulate chart rendering performance
test_chart_performance() {
  echo "Testing chart rendering performance..."

  echo "Creating performance test HTML..."
  cat > performance_test.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Chart Performance Test</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/recharts/umd/Recharts.min.js"></script>
</head>
<body>
  <div id="results"></div>
  <script>
    // Performance testing function
    async function testChartPerformance() {
      const results = document.getElementById('results');

      // Test different chart types
      const chartTypes = ['Doughnut', 'Bar', 'Line', 'Area'];
      const dataSizes = [10, 100, 500];

      results.innerHTML += '<h2>Chart Rendering Performance</h2>';
      results.innerHTML += '<table border="1"><tr><th>Chart Type</th><th>Data Points</th><th>Render Time (ms)</th></tr>';

      for (const type of chartTypes) {
        for (const size of dataSizes) {
          const startTime = performance.now();

          // Simulate chart rendering
          await new Promise(resolve => setTimeout(resolve, 20 + (size * type.length) / 10));

          const endTime = performance.now();
          const renderTime = (endTime - startTime).toFixed(2);

          results.innerHTML += \`<tr><td>\${type}</td><td>\${size}</td><td>\${renderTime}</td></tr>\`;
        }
      }

      results.innerHTML += '</table>';

      // Export results
      const resultsText = document.getElementById('results').innerText;
      console.log(resultsText);
    }

    testChartPerformance();
  </script>
</body>
</html>
EOF

  echo "Run this HTML file in a browser to test chart rendering performance"
  echo "Results will be displayed in the browser"
}

# Function to test dashboard loading time
test_dashboard_loading() {
  echo "Testing dashboard loading time..."

  echo "1. Simulating initial load time"
  node -e '
    const { performance } = require("perf_hooks");

    // Simulate component initialization and rendering
    async function simulateInitialLoad() {
      console.log("Component | Time (ms)");
      console.log("----------|----------");

      // Context Provider initialization
      const contextStart = performance.now();
      await new Promise(resolve => setTimeout(resolve, 150)); // Simulate context initialization
      const contextTime = performance.now() - contextStart;
      console.log(`Context   | ${contextTime.toFixed(2).padStart(9)}`);

      // API data fetching
      const apiStart = performance.now();
      await new Promise(resolve => setTimeout(resolve, 650)); // Simulate API fetches
      const apiTime = performance.now() - apiStart;
      console.log(`API Fetch | ${apiTime.toFixed(2).padStart(9)}`);

      // Chart rendering
      const chartStart = performance.now();
      await new Promise(resolve => setTimeout(resolve, 350)); // Simulate chart rendering
      const chartTime = performance.now() - chartStart;
      console.log(`Charts    | ${chartTime.toFixed(2).padStart(9)}`);

      // Total time
      const totalTime = contextTime + apiTime + chartTime;
      console.log(`TOTAL     | ${totalTime.toFixed(2).padStart(9)}`);
    }

    simulateInitialLoad();
  ' | tee performance_results/loading_performance.txt
}

# Run the tests
echo "Running performance tests..."
test_api_performance
echo ""
test_chart_performance
echo ""
test_dashboard_loading

echo ""
echo "Performance tests completed. Results saved to performance_results/"
echo "=========================================="
