
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

interface Item {
  id: string;
  name: string;
  description: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDescription, setNewItemDescription] = useState<string>('');

  useEffect(() => {
    const getItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const itemsData: Item[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
      }));
      setItems(itemsData);
    };

    getItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    try {
      await addDoc(collection(db, 'items'), {
        name: newItemName,
        description: newItemDescription,
      });
      setNewItemName('');
      setNewItemDescription('');

      
      setItems(prevItems => [
        ...prevItems,
        { id: Math.random().toString(), name: newItemName, description: newItemDescription },
      ]); 
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Check console.');
    }
  };

  return (
    <div>
      <h1>My App</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Name"
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItemDescription}
          onChange={e => setNewItemDescription(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default App;


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


{
  "name": "my-react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.34",
    "@types/react": "^18.2.7",
    "@types/react-dom": "^18.2.4",
    "firebase": "^9.6.11",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "eslint": "^8.43.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^2.8.8"
  }
}


module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jsx-a11y/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function"
      }
    ],
  },
};


module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
};

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})

[build]
  command = "npm run build"
  publish = "dist"

[dev]
  framework = "#custom"
  command = "npm run start"
  port = 3000


import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

public class FCMService {

    public static void main(String[] args) throws Exception {

        
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(FCMService.class.getResourceAsStream("/path/to/your/serviceAccountKey.json")))
            .build();

        FirebaseApp.initializeApp(options);

        
        String registrationToken = "YOUR_DEVICE_REGISTRATION_TOKEN";

        Message message = Message.builder()
            .setNotification(Notification.builder()
                .setTitle("Hello from Firebase")
                .setBody("This is a test notification!")
                .build())
            .setToken(registrationToken)
            .build();

        
        String response = FirebaseMessaging.getInstance().send(message);
        System.out.println("Successfully sent message: " + response);
    }
}

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.Message
import com.google.firebase.messaging.Notification

fun main() {
    try {
        
        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(object {}.javaClass.getResourceAsStream("/path/to/your/serviceAccountKey.json")))
            .build()

        FirebaseApp.initializeApp(options)

        
        val registrationToken = "YOUR_DEVICE_REGISTRATION_TOKEN"

        val message = Message.builder()
            .setNotification(
                Notification.builder()
                    .setTitle("Hello from Firebase Kotlin")
                    .setBody("This is a test notification from Kotlin!")
                    .build()
            )
            .setToken(registrationToken)
            .build()

        
        val response = FirebaseMessaging.getInstance().send(message)
        println("Successfully sent message: $response")

    } catch (e: Exception) {
        e.printStackTrace()
    }
}

import FirebaseCore
import FirebaseMessaging
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()

        UNUserNotificationCenter.current().delegate = self

        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        UNUserNotificationCenter.current().requestAuthorization(
            options: authOptions,
            completionHandler: { _, _ in }
        )

        application.registerForRemoteNotifications()

        Messaging.messaging().delegate = self

        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("Firebase registration token: \(String(describing: fcmToken))")

        let dataDict: [String: String] = ["token": fcmToken ?? ""]
        NotificationCenter.default.post(
            name: Notification.Name("FCMToken"),
            object: nil,
            userInfo: dataDict
        )
        
        
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound]) 
    }
}

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        
        Log.d(TAG, "From: ${remoteMessage.from}")

        
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            
        }

        
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Body: ${it.body}")
            sendNotification(it.body)
        }
    }

    override fun onNewToken(token: String) {
        Log.d(TAG, "Refreshed token: $token")

        
        
        
        sendRegistrationToServer(token)
    }

    private fun sendNotification(messageBody: String?) {
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = getString(R.string.default_notification_channel_id)
            val channelName = "Default Channel"
            val channelDescription = "Default channel description"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, channelName, importance).apply {
                description = channelDescription
            }
            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }

        
        val builder = NotificationCompat.Builder(this, getString(R.string.default_notification_channel_id))
            .setSmallIcon(R.drawable.ic_notification) 
            .setContentTitle("FCM Notification")
            .setContentText(messageBody)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(0, builder.build())
    }

    private fun sendRegistrationToServer(token: String?) {
        
        Log.d(TAG, "Sending token to server: $token")
    }

    companion object {
        private const val TAG = "MyFirebaseMsgService"
    }
}

<manifest xmlns:android="http:
    package="your.package.name">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyApp">

        <service
            android:name=".MyFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@drawable/ic_notification" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/colorAccent" />

        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="@string/default_notification_channel_id" />
        </application>
</manifest>

<resources>
    <string name="app_name">MyApp</string>
    <string name="default_notification_channel_id">default_channel</string>
</resources>

plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'com.google.gms.google-services' 
}

dependencies {
    implementation("com.google.firebase:firebase-messaging-ktx:23.0.0") 
}


buildscript {
    dependencies {
        classpath("com.google.gms:google-services:4.3.10") 
    }
}

node_modules
.env
/dist
/build

# Code style/formatting (Prettier, ESLint):
#   - Use Prettier for code formatting (consistent spacing, line breaks, etc.).
#   - Use ESLint for code linting (detecting errors, enforcing code style, etc.).
#   - Integrate Prettier and ESLint with your IDE for automatic formatting and linting on save.
#   - Configure ESLint to work with TypeScript and React (using appropriate plugins).
#   - Consider using a shared ESLint configuration (e.g., Airbnb, Standard) for consistency across the team.
#   - Enforce code style rules in your CI/CD pipeline to prevent code with style violations from being merged.
# Git workflow:
#   - Use a branching strategy (e.g., Gitflow, GitHub Flow) for managing code changes.
#   - Create pull requests for all code changes, even small ones.
#   - Require code reviews for all pull requests.
#   - Use descriptive commit messages.
#   - Keep branches up-to-date with the main branch.
# Error handling
#   - Use try-catch blocks to handle potential errors in asynchronous operations.
#   - Display user-friendly error messages to the user.
#   - Log errors to a centralized logging system for debugging and monitoring.
# Performance
#   - Optimize images and other assets for web use.
#   - Use code splitting to reduce the initial load time of your application.
#   - Lazy-load components and resources that are not immediately needed.
#   - Use memoization techniques to avoid unnecessary re-renders.
# Authentication and authorization
#   - Use Firebase Authentication for user authentication.
#   - Implement authorization rules to control access to data and resources.
#   - Follow security best practices for storing and handling user credentials.
import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../components/mobile/MobileLayout';
import MobileNavigation from '../../components/mobile/MobileNavigation';
import TyreListMobile from '../../components/mobile/tyre/TyreListMobile';
import TyreInspectionMobile from '../../components/mobile/tyre/TyreInspectionMobile';
import TyreScanner from '../../components/mobile/tyre/TyreScanner';
import TyreFormModal from '../../components/Models/Tyre/TyreFormModal';
import { collection, query, getDocs, orderBy, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface TyreMobilePageProps {
  mode?: 'list' | 'inspection' | 'scanner' | 'add';
  tyreId?: string;
}

const TyreMobilePage: React.FC<TyreMobilePageProps> = ({
  mode = 'list',
  tyreId: _tyreId // Renamed with underscore to indicate it's intentionally unused
}) => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState(mode);
  const [tyres, setTyres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTyre, setSelectedTyre] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
    fetchTyres();
  }, []);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const fetchTyres = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'tyres'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const tyresList: any[] = [];
      querySnapshot.forEach((doc) => {
        tyresList.push({ id: doc.id, ...doc.data() });
      });
      
      setTyres(tyresList);
    } catch (error) {
      console.error('Error fetching tyres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanTyre = (tyre: any) => {
    setSelectedTyre(tyre);
    setCurrentMode('inspection');
  };

  const handleEditTyre = (tyre: any) => {
    setSelectedTyre(tyre);
    setShowAddModal(true);
  };

  const handleViewDetails = (tyre: any) => {
    setSelectedTyre(tyre);
    // Navigate to detailed view or open modal
    navigate(`/tyres/${tyre.id}`);
  };

  const handleAddNew = () => {
    setSelectedTyre(null);
    setShowAddModal(true);
  };

  const handleScanComplete = (scanData: { barcode?: string; photo?: string }) => {
    if (scanData.barcode) {
      const foundTyre = tyres.find(tyre => 
        tyre.tyreNumber === scanData.barcode ||
        tyre.id === scanData.barcode
      );
      
      if (foundTyre) {
        handleScanTyre(foundTyre);
      } else {
        // Start inspection for new tyre
        setSelectedTyre({ tyreNumber: scanData.barcode });
        setCurrentMode('inspection');
      }
    }
    
    if (currentMode === 'scanner') {
      setCurrentMode('list');
    }
  };

  const handleInspectionSave = async (inspectionData: any) => {
    try {
      // Save inspection to Firebase
      await addDoc(collection(db, 'tyreInspections'), {
        ...inspectionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update tyre's last inspection date
      if (inspectionData.tyreId) {
        const tyreRef = doc(db, 'tyres', inspectionData.tyreId);
        await updateDoc(tyreRef, {
          lastInspection: inspectionData.inspectionDate,
          updatedAt: serverTimestamp()
        });
      }

      // Refresh tyres list
      await fetchTyres();
      
      // Return to list view
      setCurrentMode('list');
      setSelectedTyre(null);
    } catch (error) {
      console.error('Error saving inspection:', error);
      throw error;
    }
  };

  const handleTyreSave = async (tyreData: any) => {
    try {
      if (selectedTyre?.id) {
        // Update existing tyre
        const tyreRef = doc(db, 'tyres', selectedTyre.id);
        await updateDoc(tyreRef, {
          ...tyreData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new tyre
        await addDoc(collection(db, 'tyres'), {
          ...tyreData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Refresh tyres list
      await fetchTyres();
      
      // Close modal
      setShowAddModal(false);
      setSelectedTyre(null);
    } catch (error) {
      console.error('Error saving tyre:', error);
      throw error;
    }
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'inspection':
        return (
          <TyreInspectionMobile
            tyreId={selectedTyre?.id}
            tyreNumber={selectedTyre?.tyreNumber}
            onSave={handleInspectionSave}
            onCancel={() => {
              setCurrentMode('list');
              setSelectedTyre(null);
            }}
          />
        );

      case 'scanner':
        return (
          <TyreScanner
            scanMode="barcode"
            title="Scan Tyre QR Code"
            onScanComplete={handleScanComplete}
            onCancel={() => setCurrentMode('list')}
          />
        );

      case 'list':
      default:
        return (
          <>
            <TyreListMobile
              tyres={tyres}
              loading={loading}
              onRefresh={fetchTyres}
              onAddNew={handleAddNew}
              onScanTyre={handleScanTyre}
              onEditTyre={handleEditTyre}
              onViewDetails={handleViewDetails}
              enableScanner={isNativeApp}
            />
            
            {/* Bottom navigation - only show in list mode */}
            <MobileNavigation
              onNewTyre={handleAddNew}
              onScanTyre={() => setCurrentMode('scanner')}
              notificationCount={tyres.filter(t => 
                !t.lastInspection || 
                new Date(t.lastInspection) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            />
          </>
        );
    }
  };

  return (
    <MobileLayout
      title="Tyre Management"
      showStatusBar={true}
      statusBarStyle="dark"
      backgroundColor="#ffffff"
    >
      {renderContent()}

      {/* Add/Edit Tyre Modal */}
      {showAddModal && (
        <TyreFormModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedTyre(null);
          }}
          initialData={selectedTyre}
          onSubmit={handleTyreSave}
          editMode={!!selectedTyre?.id}
        />
      )}

      {/* Mobile-specific styles */}
      <style>{`
        /* Ensure content doesn't go behind navigation */
        .mobile-content {
          padding-bottom: 80px; /* Account for bottom navigation */
        }

        /* Optimize for mobile performance */
        * {
          box-sizing: border-box;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }

        /* Touch-friendly interactive elements */
        button, 
        .clickable {
          min-height: 44px;
          min-width: 44px;
        }

        /* Optimize text for mobile readability */
        body {
          font-size: 16px;
          line-height: 1.5;
        }

        /* Reduce animations on lower-end devices */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Optimize for PWA */
        @media all and (display-mode: standalone) {
          body {
            padding-top: env(safe-area-inset-top);
          }
        }
      `}</style>
    </MobileLayout>
  );
};

export default TyreMobilePage;
