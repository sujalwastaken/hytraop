import pandas as pd

# Read the CSV
data = pd.read_csv('data.csv')

# Filter and clean the data (as in your Flask code)
country_data = data[data['Country'] == 'IND']
country_data['Project name'] = country_data['Project name'].fillna('Unknown')
country_data['Technology'] = country_data['Technology'].fillna('Unknown')
country_data['Status'] = country_data['Status'].fillna('Unknown')
country_data['Latitude'] = pd.to_numeric(country_data['Latitude'], errors='coerce').fillna(0)
country_data['Longitude'] = pd.to_numeric(country_data['Longitude'], errors='coerce').fillna(0)
country_data['Capacity_MWel'] = pd.to_numeric(country_data['Capacity_MWel'], errors='coerce').fillna(0)

# Select relevant columns
filtered_data = country_data[['Project name', 'Status', 'Latitude', 'Longitude', 'Technology', 'Capacity_MWel']]

# Save to JSON
filtered_data.to_json('data.json', orient='records')
