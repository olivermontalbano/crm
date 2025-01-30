# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy the project files to the working directory
COPY . .

# Install dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Expose port 8000 for Django
EXPOSE 8000

# Start the Django application
CMD ["gunicorn", "appserver.wsgi:application", "--bind", "0.0.0.0:8000"]