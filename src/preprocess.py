import os
import pandas as pd
from sklearn.model_selection import train_test_split

def run_preprocessing(dataset_path='data/agriculture_dataset.csv', test_size=0.2, random_seed=42):
    """
    Loads the agriculture dataset, splits it into train and test sets,
    and saves them. Categorical encoding and scaling are left to be
    handled within the ML Pipeline during training to ensure robust deployment.
    """
    print(f"Loading dataset from {dataset_path}...")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Please run data_generator.py first.")
        
    df = pd.read_csv(dataset_path, keep_default_na=False)
    
    # Define features and target
    X = df.drop(columns=['Carbon_Footprint'])
    y = df['Carbon_Footprint']
    
    print(f"Features: {list(X.columns)}")
    print(f"Target: Carbon_Footprint")
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_seed, shuffle=True
    )
    
    print(f"Train size: {X_train.shape[0]} samples")
    print(f"Test size: {X_test.shape[0]} samples")
    
    # Combine back to save as CSV
    train_df = pd.concat([X_train, y_train], axis=1)
    test_df = pd.concat([X_test, y_test], axis=1)
    
    train_path = 'data/train.csv'
    test_path = 'data/test.csv'
    
    train_df.to_csv(train_path, index=False)
    test_df.to_csv(test_path, index=False)
    
    print(f"Saved split sets to {train_path} and {test_path}")

if __name__ == '__main__':
    run_preprocessing()
