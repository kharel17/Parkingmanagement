from locust import HttpUser, task, between
import json
import random

class ParkingSystemUser(HttpUser):
    """Simulate user behavior on parking system"""
    
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    def on_start(self):
        """Login before starting tasks"""
        self.login()
    
    def login(self):
        """Simulate user login"""
        response = self.client.post("/api/login", json={
            "email": "admin@parking.com",
            "password": "admin123"
        })
        if response.status_code == 200:
            print("Login successful")
    
    @task(3)
    def view_dashboard(self):
        """View dashboard - most common action"""
        self.client.get("/dashboard")
    
    @task(2)
    def view_parking_spots(self):
        """View parking spots on a floor"""
        floor = random.choice(['B1', 'B2', 'B3'])
        self.client.get(f"/api/spots?floor={floor}")
    
    @task(1)
    def park_vehicle(self):
        """Simulate parking a vehicle"""
        license_plate = f"TEST-{random.randint(1000, 9999)}"
        spot_id = f"B1-{random.randint(1, 15):02d}"
        vehicle_type = random.choice(['car', 'bike'])
        
        self.client.post("/api/park", json={
            "spotId": spot_id,
            "licensePlate": license_plate,
            "type": vehicle_type
        })
    
    @task(1)
    def vehicle_exit(self):
        """Simulate vehicle exit"""
        spot_id = f"B1-{random.randint(1, 15):02d}"
        
        self.client.post("/api/exit", json={
            "spotId": spot_id
        })
    
    @task(2)
    def view_history(self):
        """View parking history"""
        self.client.get("/api/history")
    
    @task(1)
    def switch_theme(self):
        """Toggle theme"""
        self.client.post("/api/theme")

class StressTestUser(HttpUser):
    """Heavy load testing scenarios"""
    
    wait_time = between(0.5, 1)  # Faster requests for stress testing
    
    @task
    def rapid_parking_operations(self):
        """Simulate rapid parking operations"""
        for i in range(5):
            spot_id = f"B{random.randint(1, 3)}-{random.randint(1, 15):02d}"
            self.client.post("/api/park", json={
                "spotId": spot_id,
                "licensePlate": f"STRESS-{random.randint(1000, 9999)}",
                "type": random.choice(['car', 'bike'])
            })
