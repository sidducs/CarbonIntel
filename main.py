import os
import sys

# Add src/ to python path so we can import modules properly if run from root
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from preprocess import run_preprocessing
from train import train_and_evaluate

def main():
    print("==================================================================")
    # 1. Run Data Preprocessing (splitting train/test)
    run_preprocessing()
    
    print("==================================================================")
    # 2. Train and Evaluate Models
    train_and_evaluate()
    
    print("==================================================================")
    print("Pipeline Execution Completed!")
    print("Check the 'models/' directory for the saved 'model.pkl'.")
    print("Check the 'reports/' directory for evaluation metrics and plots.")
    print("==================================================================")

if __name__ == '__main__':
    main()
