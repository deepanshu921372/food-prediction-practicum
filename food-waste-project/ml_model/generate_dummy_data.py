import pandas as pd
import random
from datetime import datetime, timedelta

# Define event types and their typical ranges for attendees
EVENT_TYPES = {
    "Wedding": (100, 500),
    "Corporate Event": (50, 200),
    "Birthday Party": (20, 100),
    "Festival": (200, 1000),
    "Small Gathering": (10, 50)
}

# Generate dummy data for one year
def generate_dummy_data(start_date, end_date):
    data = []
    current_date = start_date

    while current_date <= end_date:
        event_type = random.choice(list(EVENT_TYPES.keys()))
        attendees = random.randint(*EVENT_TYPES[event_type])
        food_prepared = attendees * random.uniform(0.8, 1.2)
        food_consumed = food_prepared * random.uniform(0.7, 0.95)
        wasted_food = food_prepared - food_consumed

        data.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "event_type": event_type,
            "attendees": attendees,
            "food_prepared": round(food_prepared, 2),
            "food_consumed": round(food_consumed, 2),
            "wasted_food": round(wasted_food, 2)
        })

        current_date += timedelta(days=1)

    return pd.DataFrame(data)

if __name__ == "__main__":
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 12, 31)
    dataset = generate_dummy_data(start_date, end_date)
    dataset.to_csv("dummy_food_data.csv", index=False)
    print("Dummy dataset generated and saved as 'dummy_food_data.csv'") 