# Model Performance Evaluation Report

This report summarizes the comparative performance of Machine Learning models trained to predict agricultural carbon footprints (kg CO₂e/ha).

## 1. Model Comparison Table

| Model Name | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | R-squared ($R^2$) |
| :--- | :---: | :---: | :---: |
| Linear Regression | 59.58 | 81.34 | 0.9689 |
| Random Forest | 24.19 | 31.26 | 0.9954 |
| XGBoost | 22.43 | 28.52 | 0.9962 |
| XGBoost (Tuned) | 21.36 | 27.06 | 0.9966 |

## 2. Best Model Selection

*   **Best Model**: **XGBoost**
*   **Selected Parameters**:
```python
{'regressor__learning_rate': 0.07, 'regressor__max_depth': 6, 'regressor__n_estimators': 300, 'regressor__subsample': 0.8}
```

## 3. Key Findings

*   The machine learning models demonstrate high capability in predicting carbon emissions using soil properties, fertilizer applications, and local weather patterns.
*   Tree-based ensemble models (Random Forest and XGBoost) outperform Linear Regression due to their ability to capture non-linear interactions, particularly weather scaling effects on nitrous oxide emissions and organic matter sequestration offsets.
