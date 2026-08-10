import streamlit as st
import pandas as pd
import pickle

st.title("Metric Mind: Analytics & Prediction")
st.write("Analyze historical data and predict future outcomes.")

# Load data and model
df = pd.read_csv("data.csv")
with open("model.pkl", "rb") as file:
    model = pickle.load(file)

# Display historical data
st.subheader("Historical Performance")
st.line_chart(df.set_index("Student_ID")[["Score", "Mock_Test_Score"]])

st.divider()

# Prediction Section
st.subheader("Predict Student Status")
st.write("Adjust the sliders below to see if a student is likely to pass.")

# Simplified UI using sliders to prevent data entry fatigue
col1, col2 = st.columns(2)
with col1:
    study_hours = st.slider("Study Hours", min_value=0.0, max_value=15.0, value=5.0, step=0.5)
with col2:
    mock_score = st.slider("Mock Test Score", min_value=0, max_value=100, value=60, step=1)

# Make prediction
if st.button("Predict Outcome"):
    input_data = pd.DataFrame({'Study_Hours': [study_hours], 'Mock_Test_Score': [mock_score]})
    prediction = model.predict(input_data)[0]
    
    if prediction == "Pass":
        st.success(f"Prediction: **{prediction}** ✅")
    else:
        st.error(f"Prediction: **{prediction}** ❌")
