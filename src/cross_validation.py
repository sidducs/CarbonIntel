import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import KFold, cross_val_score

# Load full dataset
df = pd.read_csv("data/agriculture_dataset.csv")

X = df.drop(columns=["Carbon_Footprint"])
y = df["Carbon_Footprint"]

# Load trained pipeline
model = joblib.load("models/model.pkl")

# 5-Fold CV
kf = KFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scores = cross_val_score(
    model,
    X,
    y,
    cv=kf,
    scoring="r2",
    n_jobs=-1
)

print("\nCross Validation R² Scores:")
print(scores)

print("\nAverage R²:")
print(np.mean(scores))

print("\nStandard Deviation:")
print(np.std(scores))