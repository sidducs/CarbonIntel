# Model Performance Evaluation Report

This report summarizes the comparative performance of Machine Learning models trained to predict agricultural carbon footprints (kg CO₂e/ha).

## 1. Model Comparison Table

| Model Name | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | R-squared ($R^2$) |
| :--- | :---: | :---: | :---: |
| Linear Regression | 61.40 | 83.41 | 0.9686 |
| Random Forest | 25.17 | 32.91 | 0.9951 |
| XGBoost | 23.69 | 30.28 | 0.9959 |
| XGBoost (Tuned) | 22.15 | 27.97 | 0.9965 |

## 2. Best Model Selection

*   **Best Model**: **XGBoost**
*   **Selected Parameters**:
```python
{'regressor__learning_rate': 0.07, 'regressor__max_depth': 5, 'regressor__n_estimators': 300, 'regressor__subsample': 0.8}
```

## 3. Key Findings

*   The machine learning models demonstrate high capability in predicting carbon emissions using soil properties, fertilizer applications, and local weather patterns.
*   Tree-based ensemble models (Random Forest and XGBoost) outperform Linear Regression due to their ability to capture non-linear interactions, particularly weather scaling effects on nitrous oxide emissions and organic matter sequestration offsets.
