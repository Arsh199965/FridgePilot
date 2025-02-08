#!/bin/bash

echo "Creating virtual environment if it doesn't exist..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting the server..."
python app.py 