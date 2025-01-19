import pandas as pd
import joblib
import sys
import json
from datetime import datetime
import os

def predict_food_preparation(event_data):
    try:
        # Get current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Load model and encoder with full paths
        model_path = os.path.join(current_dir, 'food_prediction_model.pkl')
        encoder_path = os.path.join(current_dir, 'event_type_encoder.pkl')
        
        model = joblib.load(model_path)
        le = joblib.load(encoder_path)
        
        # Prepare input data
        date = pd.to_datetime(event_data['date'])
        
        # Ensure event_type is in the known categories
        event_type = event_data['event_type']
        if event_type not in le.classes_:
            raise ValueError(f"Unknown event type: {event_type}")
            
        event_type_encoded = le.transform([event_type])[0]
        attendees = int(event_data['attendees'])
        
        # Create feature array
        features = pd.DataFrame({
            'event_type_encoded': [event_type_encoded],
            'attendees': [attendees],
            'day_of_week': [date.dayofweek],
            'month': [date.month]
        })
        
        # Make prediction
        prediction = model.predict(features)[0]
        return round(prediction, 2)
        
    except Exception as e:
        print(f"Prediction error: {str(e)}", file=sys.stderr)
        raise

if __name__ == "__main__":
    try:
        # Get input data from command line argument
        input_data = json.loads(sys.argv[1])
        prediction = predict_food_preparation(input_data)
        print(prediction)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1) 