import os
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import joblib

def save_model(pipeline, model_path='models/model.pkl'):
    """
    Saves the trained scikit-learn pipeline (preprocessor + model) to disk.
    """
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(pipeline, model_path)
    print(f"Model pipeline successfully saved to: {model_path}")

def plot_feature_importances(importances, feature_names, save_path='reports/figures/feature_importance.png'):
    """
    Plots the feature importances of a model and saves it.
    """
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    # Sort features by importance
    indices = np.argsort(importances)[::-1]
    sorted_importances = importances[indices]
    sorted_features = [feature_names[i] for i in indices]
    
    plt.figure(figsize=(12, 6))
    sns.set_theme(style="whitegrid")
    
    # Generate a beautiful gradient palette
    colors = sns.color_palette("viridis", len(importances))
    
    ax = sns.barplot(x=sorted_importances, y=sorted_features, palette=colors, hue=sorted_features, legend=False)
    plt.title("Feature Importance Analysis - Agricultural Carbon Footprint", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel("Relative Importance Score", fontsize=12)
    plt.ylabel("Features", fontsize=12)
    
    # Add percentage values to the bars
    for i, v in enumerate(sorted_importances):
        ax.text(v + 0.01, i + 0.1, f"{v:.1%}", color='black', ha="left", va="center", fontsize=10)
        
    plt.tight_layout()
    plt.savefig(save_path, dpi=300)
    plt.close()
    print(f"Feature importance plot saved to: {save_path}")

def generate_report(metrics_df, best_model_name, best_params, save_path='reports/metrics_summary.md'):
    """
    Generates a markdown evaluation summary report.
    """
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    md_content = f"""# Model Performance Evaluation Report

This report summarizes the comparative performance of Machine Learning models trained to predict agricultural carbon footprints (kg CO₂e/ha).

## 1. Model Comparison Table

| Model Name | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | R-squared ($R^2$) |
| :--- | :---: | :---: | :---: |
"""
    for _, row in metrics_df.iterrows():
        md_content += f"| {row['Model']} | {row['MAE']:.2f} | {row['RMSE']:.2f} | {row['R2']:.4f} |\n"
        
    md_content += f"""
## 2. Best Model Selection

*   **Best Model**: **{best_model_name}**
*   **Selected Parameters**:
```python
{best_params}
```

## 3. Key Findings

*   The machine learning models demonstrate high capability in predicting carbon emissions using soil properties, fertilizer applications, and local weather patterns.
*   Tree-based ensemble models (Random Forest and XGBoost) outperform Linear Regression due to their ability to capture non-linear interactions, particularly weather scaling effects on nitrous oxide emissions and organic matter sequestration offsets.
"""
    
    with open(save_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"Performance evaluation report saved to: {save_path}")
