import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

def train_model():
    # Load the dataset
    try:
        data = pd.read_csv("dummy_food_data.csv")
    except:
        print("Generating new dummy data...")
        from generate_dummy_data import generate_dummy_data
        from datetime import datetime
        start_date = datetime(2024, 1, 1)
        end_date = datetime(2024, 12, 31)
        data = generate_dummy_data(start_date, end_date)
        data.to_csv("dummy_food_data.csv", index=False)

    # Prepare features
    data['date'] = pd.to_datetime(data['date'])
    data['day_of_week'] = data['date'].dt.dayofweek
    data['month'] = data['date'].dt.month
    
    # Encode categorical variables
    le = joblib.dump(LabelEncoder().fit(data['event_type']), 'event_type_encoder.pkl')
    data['event_type_encoded'] = le.transform(data['event_type'])

    # Select features for training
    features = ['event_type_encoded', 'attendees', 'day_of_week', 'month']
    X = data[features]
    y = data['food_prepared']

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Save model
    joblib.dump(model, 'food_prediction_model.pkl')
    print("Model trained and saved successfully")

if __name__ == "__main__":
    train_model()