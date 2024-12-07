from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# Load data for plant locations
data = pd.read_csv('data.csv')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/plants')
def get_plants():
    # Filter data to include only rows where the 'Country' column is 'IND' (India)
    country_data = data[data['Country'] == 'IND']
    
    # Replace NaN in each specified column with a default value
    country_data['Project name'] = country_data['Project name'].fillna('Unknown')
    country_data['Technology'] = country_data['Technology'].fillna('Unknown')
    country_data['Status'] = country_data['Status'].fillna('Unknown')
    country_data['Latitude'] = pd.to_numeric(country_data['Latitude'], errors='coerce').fillna(0)
    country_data['Longitude'] = pd.to_numeric(country_data['Longitude'], errors='coerce').fillna(0)
    country_data['Capacity_MWel'] = pd.to_numeric(country_data['Capacity_MWel'], errors='coerce').fillna(0)

    # Filter relevant columns and return the sanitized data
    plants_data = country_data[['Project name', 'Status', 'Latitude', 'Longitude', 'Technology', 'Capacity_MWel']]
    
    # Return as JSON
    return jsonify(plants_data.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True)
