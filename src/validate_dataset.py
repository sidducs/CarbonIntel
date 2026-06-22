import pandas as pd

df = pd.read_csv("data/agriculture_dataset.csv")

print("Before Fix:")
print(df["Fertilizer_Type"].isnull().sum())

df["Fertilizer_Type"] = df["Fertilizer_Type"].fillna("None")

df.to_csv(
    "data/agriculture_dataset.csv",
    index=False
)

print("\nAfter Fix:")
print(df["Fertilizer_Type"].isnull().sum())

print("\nFertilizer Distribution:")
print(df["Fertilizer_Type"].value_counts())