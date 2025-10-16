import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

@pytest.fixture
def driver():
    """Setup Chrome driver"""
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in background
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

class TestLogin:
    """Test login functionality"""
    
    def test_successful_login(self, driver):
        """Test successful admin login"""
        driver.get('http://localhost:5173/')
        
        # Find and fill email field
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys('admin@parking.com')
        
        # Find and fill password field
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys('admin123')
        
        # Click login button
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        # Wait for dashboard to load
        WebDriverWait(driver, 10).until(
            EC.url_contains('/dashboard')
        )
        
        assert '/dashboard' in driver.current_url
        
    def test_invalid_login(self, driver):
        """Test login with invalid credentials"""
        driver.get('http://localhost:5173/')
        
        email_input = driver.find_element(By.ID, "email")
        email_input.send_keys('wrong@email.com')
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys('wrongpassword')
        
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        # Should show alert
        time.sleep(1)
        alert = driver.switch_to.alert
        assert 'Invalid credentials' in alert.text
        alert.accept()

class TestParkingOperations:
    """Test parking operations"""
    
    @pytest.fixture(autouse=True)
    def login(self, driver):
        """Login before each test"""
        driver.get('http://localhost:5173/')
        
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys('admin@parking.com')
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys('admin123')
        
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        WebDriverWait(driver, 10).until(
            EC.url_contains('/dashboard')
        )
    
    def test_navigate_to_system_view(self, driver):
        """Test navigation to system view"""
        system_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'System')]"))
        )
        system_button.click()
        
        # Check if parking grid is visible
        parking_grid = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "grid"))
        )
        assert parking_grid.is_displayed()
    
    def test_switch_floor(self, driver):
        """Test switching between floors"""
        # Navigate to system view
        system_button = driver.find_element(By.XPATH, "//button[contains(., 'System')]")
        system_button.click()
        
        # Click B2 floor button
        b2_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'B2')]"))
        )
        b2_button.click()
        
        time.sleep(1)
        
        # Verify B2 is selected (has active styling)
        assert 'bg-primary' in b2_button.get_attribute('class')
    
    def test_park_vehicle(self, driver):
        """Test parking a vehicle"""
        # Navigate to system view
        system_button = driver.find_element(By.XPATH, "//button[contains(., 'System')]")
        system_button.click()
        
        # Find available spot and click
        available_spot = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'bg-status-available')]"))
        )
        available_spot.click()
        
        # Fill license plate in modal
        license_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "licensePlate"))
        )
        license_input.send_keys('TEST-1234')
        
        # Click park button
        park_button = driver.find_element(By.XPATH, "//button[contains(., 'Park Vehicle')]")
        park_button.click()
        
        time.sleep(1)
        
        # Verify spot is now occupied
        occupied_spots = driver.find_elements(By.XPATH, "//button[contains(@class, 'bg-status-occupied')]")
        assert len(occupied_spots) > 0
    
    def test_vehicle_exit(self, driver):
        """Test vehicle exit and fare calculation"""
        # First park a vehicle
        system_button = driver.find_element(By.XPATH, "//button[contains(., 'System')]")
        system_button.click()
        
        available_spot = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'bg-status-available')]"))
        )
        available_spot.click()
        
        license_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "licensePlate"))
        )
        license_input.send_keys('EXIT-5678')
        
        park_button = driver.find_element(By.XPATH, "//button[contains(., 'Park Vehicle')]")
        park_button.click()
        
        time.sleep(1)
        
        # Now click on occupied spot
        occupied_spot = driver.find_element(By.XPATH, "//button[contains(@class, 'bg-status-occupied')]")
        occupied_spot.click()
        
        # Verify exit modal appears with fare
        fare_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Total Fare')]"))
        )
        assert fare_element.is_displayed()
        
        # Confirm exit
        confirm_button = driver.find_element(By.XPATH, "//button[contains(., 'Confirm Exit')]")
        confirm_button.click()
        
        time.sleep(1)

class TestDashboard:
    """Test dashboard statistics"""
    
    @pytest.fixture(autouse=True)
    def login(self, driver):
        """Login before each test"""
        driver.get('http://localhost:5173/')
        
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys('admin@parking.com')
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys('admin123')
        
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        WebDriverWait(driver, 10).until(
            EC.url_contains('/dashboard')
        )
    
    def test_dashboard_displays_stats(self, driver):
        """Test dashboard displays statistics correctly"""
        # Dashboard should be default view
        revenue_card = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Revenue')]"))
        )
        assert revenue_card.is_displayed()
        
        total_parkings = driver.find_element(By.XPATH, "//*[contains(text(), 'Total Parkings')]")
        assert total_parkings.is_displayed()

class TestThemeToggle:
    """Test theme switching"""
    
    @pytest.fixture(autouse=True)
    def login(self, driver):
        """Login before each test"""
        driver.get('http://localhost:5173/')
        
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys('admin@parking.com')
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys('admin123')
        
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        WebDriverWait(driver, 10).until(
            EC.url_contains('/dashboard')
        )
    
    def test_theme_toggle(self, driver):
        """Test toggling between light and dark theme"""
        # Find theme toggle button (Sun/Moon icon)
        theme_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@aria-label]"))
        )
        
        # Get initial theme
        html_element = driver.find_element(By.TAG_NAME, 'html')
        initial_classes = html_element.get_attribute('class')
        
        # Toggle theme
        theme_button.click()
        time.sleep(0.5)
        
        # Check theme changed
        new_classes = html_element.get_attribute('class')
        assert initial_classes != new_classes

class TestNotifications:
    """Test notification system"""
    
    @pytest.fixture(autouse=True)
    def login(self, driver):
        """Login before each test"""
        driver.get('http://localhost:5173/')
        
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys('admin@parking.com')
        
        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys('admin123')
        
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        WebDriverWait(driver, 10).until(
            EC.url_contains('/dashboard')
        )
    
    def test_notification_panel_opens(self, driver):
        """Test notification panel opens"""
        bell_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='Open notifications']"))
        )
        bell_button.click()
        
        # Check notification panel is visible
        notification_panel = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Notifications')]"))
        )
        assert notification_panel.is_displayed()