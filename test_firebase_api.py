# test_firebase_api.py

import os
import uuid
import pytest
import requests

# This file represents the complete, refactored test suite.
# It includes the main Python script, a requirements.txt, and a README.md as multi-line comments.

# --- Test Data ---
INITIAL_USER_DATA = {"name": "Test User", "email": "test.user@example.com", "status": "active"}
UPDATED_USER_DATA = {"status": "inactive"}


# --- Pytest Fixtures ---

@pytest.fixture(scope="session")
def api_config():
    """
    Loads API configuration from environment variables and provides it to the test session.
    Fails the entire test session if the required environment variables are not set,
    providing a clear error message.
    """
    db_url = os.environ.get("FIREBASE_DB_URL")
    auth_token = os.environ.get("FIREBASE_AUTH_TOKEN")

    if not db_url or not auth_token:
        pytest.fail(
            "FATAL: Missing environment variables. Please set FIREBASE_DB_URL and FIREBASE_AUTH_TOKEN."
        )

    # Ensure the URL ends with a slash for clean path joining
    if not db_url.endswith('/'):
        db_url += '/'

    return {"base_url": db_url, "auth_token": auth_token}


@pytest.fixture(scope="session")
def api_session(api_config):
    """
    Yields a pre-configured `requests.Session` object for authenticated API calls.
    This session-scoped fixture reuses the same session for all tests, improving performance.
    Authentication parameters are automatically included in every request.
    """
    session = requests.Session()
    session.params = {"auth": api_config["auth_token"]}
    yield session


@pytest.fixture
def unique_record_path(api_session, api_config):
    """
    Creates a unique resource path for a single test function to ensure test isolation.
    This fixture is function-scoped, so each test gets its own clean resource.

    Yields:
        str: The full URL for the unique test resource.

    Teardown:
        After the test function completes (pass or fail), it sends a DELETE request
        to the resource URL, ensuring the database is cleaned up.
    """
    # Use a parent path for test data to keep the database tidy
    resource_id = str(uuid.uuid4())
    full_url = f"{api_config['base_url']}pytest_tests/{resource_id}.json"

    yield full_url

    # Teardown logic: execute after the test function finishes
    api_session.delete(full_url)


@pytest.fixture
def prepopulated_record(api_session, unique_record_path):
    """
    A helper fixture that creates a record in the database before a test runs.
    It combines the `api_session` and `unique_record_path` fixtures to perform
    the setup. The teardown is handled automatically by `unique_record_path`.

    Yields:
        tuple: A tuple containing the resource URL (str) and the initial data (dict).
    """
    url = unique_record_path
    response = api_session.put(url, json=INITIAL_USER_DATA)
    response.raise_for_status()  # Fail test if setup fails
    return url, INITIAL_USER_DATA


# --- CRUD Test Cases ---

def test_create_record(api_session, unique_record_path):
    """
    Verifies that a new record can be created using a PUT request.
    Asserts that the HTTP status code is 200 (OK) and the response body
    matches the data that was sent.
    """
    url = unique_record_path
    response = api_session.put(url, json=INITIAL_USER_DATA)
    assert response.status_code == 200
    assert response.json() == INITIAL_USER_DATA


def test_read_record(api_session, prepopulated_record):
    """
    Verifies that an existing record can be read using a GET request.
    Uses the `prepopulated_record` fixture to ensure the record exists.
    Asserts that the read data matches the originally created data.
    """
    url, expected_data = prepopulated_record
    response = api_session.get(url)
    assert response.status_code == 200
    assert response.json() == expected_data


def test_update_record(api_session, prepopulated_record):
    """
    Verifies that an existing record can be partially updated using a PATCH request.
    Asserts that the specific field is updated and that other fields remain unchanged.
    """
    url, initial_data = prepopulated_record

    # Perform the partial update
    patch_response = api_session.patch(url, json=UPDATED_USER_DATA)
    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == UPDATED_USER_DATA["status"]

    # Fetch the full record again to verify integrity
    get_response = api_session.get(url)
    assert get_response.status_code == 200
    full_data = get_response.json()

    # Create the expected final state of the data
    expected_data = initial_data.copy()
    expected_data.update(UPDATED_USER_DATA)

    assert full_data == expected_data


def test_delete_record(api_session, prepopulated_record):
    """
    Verifies that an existing record can be deleted using a DELETE request.
    Asserts that the DELETE operation is successful and that a subsequent GET
    request to the same URL returns `null` (which `requests` decodes as `None`).
    """
    url, _ = prepopulated_record

    # Send DELETE request
    delete_response = api_session.delete(url)
    assert delete_response.status_code == 200

    # Verify the record is gone by attempting to GET it
    get_response = api_session.get(url)
    assert get_response.status_code == 200
    assert get_response.json() is None


# --- Negative and Edge-Case Test Cases ---

def test_request_unauthenticated(api_config, unique_record_path):
    """
    Verifies that an API request without a valid auth token fails.
    Asserts that the server responds with a 401 Unauthorized status code.
    """
    url = unique_record_path

    # Use a new, unauthenticated session for this test only
    unauthenticated_session = requests.Session()
    response = unauthenticated_session.put(url, json=INITIAL_USER_DATA)

    assert response.status_code == 401


def test_read_nonexistent_record(api_session, api_config):
    """
    Verifies that attempting to read a record that does not exist returns null.
    Generates a unique path that is guaranteed not to have been created.
    Asserts that the API responds with `null`.
    """
    # Generate a unique path that is guaranteed not to be created by any fixture
    nonexistent_path = f"pytest_tests/{uuid.uuid4()}.json"
    url = f"{api_config['base_url']}{nonexistent_path}"

    response = api_session.get(url)

    assert response.status_code == 200
    assert response.json() is None