import pandas as pd

df = pd.read_csv("data/agriculture_dataset.csv")

corr = df.select_dtypes(include="number").corr()

print(
    corr["Carbon_Footprint"]
    .sort_values(ascending=False)
)