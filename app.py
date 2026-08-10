import streamlit as st
import pandas as pd

st.title("Metric Mind: Analytics Dashboard")
st.write("A simplified overview of performance metrics.")

# Load the dataset
df = pd.read_csv("data.csv")

# Display the raw data
st.subheader("Raw Data")
st.dataframe(df)

# Create a simple bar chart
st.subheader("Score Visualization")
st.bar_chart(df.set_index("Student_ID")["Score"])
