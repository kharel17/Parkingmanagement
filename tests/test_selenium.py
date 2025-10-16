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
    # Remove headless for demo so you can see it working
    # options.add_argument('--headless')
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    driver.implicitly_wait(10)
    driver.maximize_window()
    yield driver
    driver.quit()

class TestLogin:
    """Test 1: Login Tests"""
    
    def test_successful_login(self, driver):
        """Test admin can login successfully"""
        driver.get('http://localhost:5173/')
        
        # Enter credentials
        email = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email.send_keys('admin@parking.com')
        
        password = driver.find_element(By.ID, "password")
        password.send_keys('admin123')
        
        # Click login
        login_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_btn.click()
        
        # Verify dashboard loads
        WebDriverWait(driver, 10).until(
            EC.url_contains('/dashboard')
        )
        
        assert '/dashboard' in driver.current_url
        print("✓ Login test passed")

class TestNavigation:
    """Test 2: Navigation Tests"""
    
    @pytest.fixture(autouse=True)
    def login(self, driver):
        """Auto login before each test"""
        driver.get('http://localhost:5173/')
        
        email = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email.send_keys('admin@parking.com')
        
        password = driver.find_element(By.ID, "password")
        password.send_keys('admin123')
        
        login_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_btn.click()
        
        WebDriverWait(driver, 10).until(EC.url_contains('/dashboard'))
    
    def test_navigate_to_system(self, driver):
        """Test navigation to System view"""
        system_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'System')]"))
        )
        system_btn.click()
        
        time.sleep(1)
        
        # Verify parking grid appears
        grid = driver.find_element(By.CLASS_NAME, "grid")
        assert grid.is_displayed()
        print("✓ System navigation test passed")
    
    def test_switch_floor(self, driver):
        """Test switching between floors"""
        # Go to System view
        system_btn = driver.find_element(By.XPATH, "//button[contains(., 'System')]")
        system_btn.click()
        
        time.sleep(1)
        
        # Click B2 floor
        b2_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'B2')]"))
        )
        b2_btn.click()
        
        time.sleep(1)
        
        # Verify B2 is active
        assert 'bg-primary' in b2_btn.get_attribute('class')
        print("✓ Floor switch test passed")

class TestParkingOperations:
    """Test 3: Parking Operations"""
    
    @pytest.fixture(autouse=True)
    def login(self, driver):
        """Auto login"""
        driver.get('http://localhost:5173/')
        
        email = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email.send_keys('admin@parking.com')
        
        password = driver.find_element(By.ID, "password")
        password.send_keys('admin123')
        
        login_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_btn.click()
        
        WebDriverWait(driver, 10).until(EC.url_contains('/dashboard'))
    
    def test_park_vehicle(self, driver):
        """Test parking a vehicle"""
        # Go to System
        system_btn = driver.find_element(By.XPATH, "//button[contains(., 'System')]")
        system_btn.click()
        
        time.sleep(1)
        
        # Click available spot
        spot = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'bg-status-available')]"))
        )
        spot.click()
        
        # Enter license plate
        license = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "licensePlate"))
        )
        license.send_keys('TEST-1234')
        
        # Click Park
        park_btn = driver.find_element(By.XPATH, "//button[contains(., 'Park Vehicle')]")
        park_btn.click()
        
        time.sleep(2)
        
        # Verify spot is occupied
        occupied = driver.find_elements(By.XPATH, "//button[contains(@class, 'bg-status-occupied')]")
        assert len(occupied) > 0
        print("✓ Park vehicle test passed")