
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_fuel_behavior(data):
    """
    Analyzes driver fuel consumption behavior from a pandas DataFrame.

    Args:
        data (pd.DataFrame): DataFrame containing driver data with at least
                             'driver_id', 'date', 'distance', and 'fuel_consumed' columns.

    Returns:
        dict: A dictionary containing analysis results, including:
              - average_fuel_efficiency: Average fuel efficiency across all drivers.
              - driver_fuel_efficiency: Fuel efficiency for each driver.
              - fuel_efficiency_over_time: Trend of fuel efficiency over time.
              - outlier_drivers: Drivers with significantly low fuel efficiency.
    """

    # 1. Data Cleaning and Preprocessing
    data = data.copy()
    data.dropna(inplace=True)
    data = data[data['distance'] > 0]
    data = data[data['fuel_consumed'] > 0]
    data['date'] = pd.to_datetime(data['date'])

    # 2. Calculate Fuel Efficiency
    data['fuel_efficiency'] = data['distance'] / data['fuel_consumed']

    # 3. Overall Average Fuel Efficiency
    average_fuel_efficiency = data['fuel_efficiency'].mean()

    # 4. Fuel Efficiency per Driver
    driver_fuel_efficiency = data.groupby('driver_id')['fuel_efficiency'].mean()

    # 5. Fuel Efficiency Trend Over Time
    fuel_efficiency_over_time = data.groupby('date')['fuel_efficiency'].mean()

    # 6. Identify Outlier Drivers
    Q1 = driver_fuel_efficiency.quantile(0.25)
    Q3 = driver_fuel_efficiency.quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    outlier_drivers = driver_fuel_efficiency[driver_fuel_efficiency < lower_bound]

    # 7. Return Analysis Results
    results = {
        'average_fuel_efficiency': average_fuel_efficiency,
        'driver_fuel_efficiency': driver_fuel_efficiency,
        'fuel_efficiency_over_time': fuel_efficiency_over_time,
        'outlier_drivers': outlier_drivers
    }

    return results

def visualize_fuel_behavior(analysis_results):
    """
    Visualizes the fuel behavior analysis results.

    Args:
        analysis_results (dict): A dictionary containing the analysis results
                                  from the analyze_fuel_behavior function.
    """

    # 1. Plot Driver Fuel Efficiency
    plt.figure(figsize=(12, 6))
    sns.barplot(x=analysis_results['driver_fuel_efficiency'].index,
                y=analysis_results['driver_fuel_efficiency'].values)
    plt.xlabel('Driver ID')
    plt.ylabel('Average Fuel Efficiency')
    plt.title('Fuel Efficiency per Driver')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

    # 2. Plot Fuel Efficiency Trend Over Time
    plt.figure(figsize=(12, 6))
    analysis_results['fuel_efficiency_over_time'].plot()
    plt.xlabel('Date')
    plt.ylabel('Average Fuel Efficiency')
    plt.title('Fuel Efficiency Trend Over Time')
    plt.tight_layout()
    plt.show()

    # 3. Display Outlier Drivers
    if not analysis_results['outlier_drivers'].empty:
        print("Outlier Drivers (Low Fuel Efficiency):")
        print(analysis_results['outlier_drivers'])
    else:
        print("No outlier drivers detected.")

if __name__ == '__main__':
    # Create sample data (replace with your actual data)
    data = pd.DataFrame({
        'driver_id': [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
        'date': ['2023-01-01', '2023-01-02', '2023-01-01', '2023-01-02', '2023-01-01', '2023-01-02', '2023-01-01', '2023-01-02', '2023-01-01', '2023-01-02'],
        'distance': [100, 120, 150, 130, 80, 90, 200, 180, 50, 60],
        'fuel_consumed': [10, 12, 15, 13, 8, 9, 20, 18, 10, 30]
    })

    # Analyze fuel behavior
    analysis_results = analyze_fuel_behavior(data)

    # Visualize the results
    visualize_fuel_behavior(analysis_results)

    # Print average fuel efficiency
    print(f"Average Fuel Efficiency: {analysis_results['average_fuel_efficiency']:.2f}")
