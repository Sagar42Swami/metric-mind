import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

df = pd.read_csv("data.csv")

# 2. Separate features (X) and target (y)
X = df[['Study_Hours', 'Mock_Test_Score']]
y = df['Status']

# 3. Train a Random Forest model
model = RandomForestClassifier(random_state=42)
model.fit(X, y)

# 4. Save the trained model to a file
with open("model.pkl", "wb") as file:
    pickle.dump(model, file)

print("Model trained and saved successfully as model.pkl!")
