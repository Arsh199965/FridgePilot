#!/bin/bash

echo "Creating virtual environment if it doesn't exist..."
if [ ! -d "venv" ]; then
    python -m venv venv
fi

echo "Activating virtual environment..."
source venv/Scripts/activate

echo "Installing dependencies..."
pip install --upgrade pip
pip install wheel
pip install numpy==1.24.3
pip install -r requirements.txt

echo "Starting the server..."
python app.py 