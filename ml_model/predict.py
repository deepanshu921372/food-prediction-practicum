import pandas as pd
import joblib
import sys
import json
from datetime import datetime

def predict_food_preparation(event_data):
    # Load model and encoder
    model = joblib.load('food_prediction_model.pkl')
    le = joblib.load('event_type_encoder.pkl')
    
    # Prepare input data
    date = pd.to_datetime(event_data['date'])
    event_type_encoded = le.transform([event_data['event_type']])[0]
    
    # Create feature array
    features = pd.DataFrame({
        'event_type_encoded': [event_type_encoded],
        'attendees': [event_data['attendees']],
        'day_of_week': [date.dayofweek],
        'month': [date.month]
    })
    
    # Make prediction
    prediction = model.predict(features)[0]
    return round(prediction, 2)

if __name__ == "__main__":
    # Get input data from command line argument
    input_data = json.loads(sys.argv[1])
    prediction = predict_food_preparation(input_data)
    print(prediction) 