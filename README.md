# Firebase Realtime Database API Test Suite

This project contains a `pytest` suite for running robust, maintainable, and secure integration tests against a Firebase Realtime Database REST API.

## 1. Setup

### Install Dependencies
Install the required Python packages using pip and the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

### Configure Environment Variables
The test suite requires the Firebase Database URL and an Auth Token to be set as environment variables. This practice avoids hardcoding secrets in the source code.

-   **`FIREBASE_DB_URL`**: Your full Firebase Realtime Database URL (e.g., `https://your-project-id-default-rtdb.firebaseio.com`).
-   **`FIREBASE_AUTH_TOKEN`**: Your database secret. You can find this in your Firebase project settings under `Service accounts` > `Database secrets`. **Note: Keep this secret secure.**

You can set these variables in your shell before running the tests.

**On macOS/Linux:**
```bash
export FIREBASE_DB_URL="<your-database-url>"
export FIREBASE_AUTH_TOKEN="<your-auth-token>"
```

**On Windows (PowerShell):**
```powershell
$env:FIREBASE_DB_URL="<your-database-url>"
$env:FIREBASE_AUTH_TOKEN="<your-auth-token>"
```

If these variables are not set, the test suite will fail immediately with a clear error message.

## 2. Running the Tests

Once the environment is configured, you can execute the entire test suite using the `pytest` command from the root of the project directory.

```bash
pytest -v
```

The `-v` flag enables verbose output, showing the status of each test function.

### Test Suite Design

-   **Test Isolation**: Each test operates on a unique, randomly generated database path.
-   **Automatic Cleanup**: After each test completes, the resources it created are automatically deleted, ensuring the database remains clean and tests are independent.
-   **Configuration Management**: All configuration is handled centrally via fixtures, making the tests easy to maintain.
-   **Comprehensive Coverage**: The suite includes tests for all standard CRUD (Create, Read, Update, Delete) operations as well as critical negative test cases like authentication failures.