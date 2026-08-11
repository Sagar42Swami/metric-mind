# metric-mind
KPI row — total students, pass rate, avg score, avg study hours, right up top
Sidebar prediction panel — sliders and the Predict button moved out of the main flow, plus it now shows a confidence percentage with a progress bar, not just Pass/Fail
Interactive Plotly charts — the line chart is now hover-friendly; added a scatter plot (study hours vs. score, colored by pass/fail, sized by mock score) and a pass/fail distribution bar chart
Collapsible raw data table at the bottom instead of it competing for space
Caching (@st.cache_data / @st.cache_resource) so reloading the data/model doesn't slow things down
Updated requirements.txt to include plotly
