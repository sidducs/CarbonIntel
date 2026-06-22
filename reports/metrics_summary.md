# Model Performance Evaluation Report

This report summarizes the comparative performance of Machine Learning models trained to predict agricultural carbon footprints (kg CO₂e/ha).

## 1. Model Comparison Table

| Model Name | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | R-squared ($R^2$) |
| :--- | :---: | :---: | :---: |
| Linear Regression | 60.02 | 82.43 | 0.9669 |
| Random Forest | 24.24 | 30.57 | 0.9954 |
| XGBoost | 22.34 | 28.16 | 0.9961 |
| XGBoost (Tuned) | 21.30 | 26.72 | 0.9965 |

## 2. Best Model Selection

*   **Best Model**: **XGBoost**
*   **Selected Parameters**:
```python
{'regressor__learning_rate': 0.07, 'regressor__max_depth': 5, 'regressor__n_estimators': 300, 'regressor__subsample': 0.8}
```

## 3. Key Findings

*   The machine learning models demonstrate high capability in predicting carbon emissions using soil properties, fertilizer applications, and local weather patterns.
*   Tree-based ensemble models (Random Forest and XGBoost) outperform Linear Regression due to their ability to capture non-linear interactions, particularly weather scaling effects on nitrous oxide emissions and organic matter sequestration offsets.
