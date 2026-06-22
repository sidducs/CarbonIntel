import os
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor

# Import helper utilities
from utils import save_model, plot_feature_importances, generate_report

def train_and_evaluate():
    """
    Main training script.
    1. Loads train/test data.
    2. Builds preprocessing pipelines.
    3. Trains and compares baseline Linear Regression, Random Forest, and XGBoost.
    4. Conducts grid search hyperparameter tuning on the best performing model.
    5. Saves the final pipeline to models/model.pkl.
    6. Generates evaluation reports and feature importance plots.
    """
    print("Loading data...")
    if not os.path.exists('data/train.csv') or not os.path.exists('data/test.csv'):
        raise FileNotFoundError("Train or Test split files not found in 'data/' directory. Please run src/preprocess.py first.")
        
    train_df = pd.read_csv('data/train.csv', keep_default_na=False)
    test_df = pd.read_csv('data/test.csv', keep_default_na=False)
    
    X_train = train_df.drop(columns=['Carbon_Footprint'])
    y_train = train_df['Carbon_Footprint']
    X_test = test_df.drop(columns=['Carbon_Footprint'])
    y_test = test_df['Carbon_Footprint']
    
    print(f"Train features shape: {X_train.shape}, Test features shape: {X_test.shape}")
    
    # 1. Define Preprocessing Pipeline
    numerical_features = ['SOC', 'N_Content', 'P_Content', 'K_Content', 'pH', 
                          'Fertilizer_Amount', 'Temperature', 'Rainfall', 'Humidity']
    categorical_features = ['Crop_Type', 'Fertilizer_Type']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )
    
    # 2. Evaluate Baseline Models
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(random_state=42),
        'XGBoost': XGBRegressor(random_state=42)
    }
    
    baseline_results = []
    trained_pipelines = {}
    
    print("\n--- Training and evaluating baseline models ---")
    for name, regressor in models.items():
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', regressor)
        ])
        
        # Fit model
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline
        
        # Predict
        y_pred = pipeline.predict(X_test)
        
        # Evaluate
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        baseline_results.append({
            'Model': name,
            'MAE': mae,
            'RMSE': rmse,
            'R2': r2
        })
        print(f"{name:18} -> MAE: {mae:.2f} | RMSE: {rmse:.2f} | R2: {r2:.4f}")
        
    metrics_df = pd.DataFrame(baseline_results)
    
    # Determine the best baseline model based on R-squared
    best_baseline_row = metrics_df.loc[metrics_df['R2'].idxmax()]
    best_model_name = best_baseline_row['Model']
    print(f"\nBest baseline model: {best_model_name} (R2 = {best_baseline_row['R2']:.4f})")
    
    # 3. Hyperparameter Tuning for the Best Model (specifically focusing on XGBoost / Random Forest)
    print(f"\n--- Hyperparameter tuning for {best_model_name} ---")
    
    if best_model_name == 'XGBoost':
        # XGBoost Parameter Grid
        param_grid = {
            'regressor__n_estimators': [100, 200, 300],
            'regressor__max_depth': [4, 5, 6],
            'regressor__learning_rate': [0.03, 0.07, 0.1],
            'regressor__subsample': [0.8, 1.0]
        }
        tuning_model = XGBRegressor(random_state=42)
    elif best_model_name == 'Random Forest':
        # Random Forest Parameter Grid
        param_grid = {
            'regressor__n_estimators': [100, 200],
            'regressor__max_depth': [10, 15, None],
            'regressor__min_samples_split': [2, 5]
        }
        tuning_model = RandomForestRegressor(random_state=42)
    else:
        # Fallback if Linear Regression is somehow the best
        param_grid = {}
        tuning_model = LinearRegression()
        
    tuning_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', tuning_model)
    ])
    
    if param_grid:
        grid_search = GridSearchCV(
            tuning_pipeline,
            param_grid,
            cv=3,
            scoring='neg_mean_squared_error',
            verbose=1,
            n_jobs=-1
        )
        grid_search.fit(X_train, y_train)
        best_pipeline = grid_search.best_estimator_
        best_params = grid_search.best_params_
        print(f"Optimal hyperparameters: {best_params}")
    else:
        best_pipeline = trained_pipelines[best_model_name]
        best_params = "No hyperparameter tuning performed (Linear Regression)"
        
    # 4. Final Evaluation of Tuned Model
    y_pred_tuned = best_pipeline.predict(X_test)
    tuned_mae = mean_absolute_error(y_test, y_pred_tuned)
    tuned_rmse = np.sqrt(mean_squared_error(y_test, y_pred_tuned))
    tuned_r2 = r2_score(y_test, y_pred_tuned)
    
    print("\n--- Final Tuned Model Evaluation ---")
    print(f"Model: {best_model_name} (Tuned)")
    print(f"MAE  : {tuned_mae:.2f}")
    print(f"RMSE : {tuned_rmse:.2f}")
    print(f"R2   : {tuned_r2:.4f}")
    
    # Update metrics_df with the tuned model performance for the report
    tuned_row = pd.DataFrame([{
        'Model': f"{best_model_name} (Tuned)",
        'MAE': tuned_mae,
        'RMSE': tuned_rmse,
        'R2': tuned_r2
    }])
    metrics_df = pd.concat([metrics_df, tuned_row], ignore_index=True)
    
    # 5. Save the best pipeline model
    save_model(best_pipeline, 'models/model.pkl')
    
    # 6. Extract & Plot Feature Importances
    print("\nGenerating feature importance analysis...")
    fitted_preprocessor = best_pipeline.named_steps['preprocessor']
    fitted_regressor = best_pipeline.named_steps['regressor']
    
    # Retrieve feature names from ColumnTransformer
    raw_feature_names = fitted_preprocessor.get_feature_names_out()
    # Clean the names (remove 'num__' and 'cat__')
    clean_feature_names = [f.replace('num__', '').replace('cat__', '') for f in raw_feature_names]
    
    if hasattr(fitted_regressor, 'feature_importances_'):
        importances = fitted_regressor.feature_importances_
        plot_feature_importances(importances, clean_feature_names)
    elif hasattr(fitted_regressor, 'coef_'):
        # For linear model, take absolute values of coefficients as importances
        importances = np.abs(fitted_regressor.coef_)
        # Normalize to sum to 1
        importances = importances / np.sum(importances)
        plot_feature_importances(importances, clean_feature_names)
    else:
        print("Model does not support coefficient or feature importance extraction.")
        
    # 7. Write Markdown Report
    generate_report(metrics_df, best_model_name, best_params)
    print("Training process finished successfully!")

if __name__ == '__main__':
    train_and_evaluate()
