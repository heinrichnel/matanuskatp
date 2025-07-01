// Diagnostic and Fix Script for Driver Behavior Event Sync Issue
// Run this in the browser console when you're on the Driver Behavior page

(async function() {
  console.log('🔍 Starting Driver Behavior Event Diagnostic Tool...');
  
  // Step 1: Check if we're on the Driver Behavior page
  if (!window.location.pathname.includes('driver-behavior')) {
    console.error('❌ Error: You must be on the Driver Behavior page to run this script.');
    console.log('📋 Please navigate to the Driver Behavior page and try again.');
    return;
  }

  // Step 2: Get references to key application objects
  if (!window.firebase || !window.firebase.firestore) {
    console.error('❌ Error: Firebase Firestore is not initialized in this page.');
    console.log('📋 Make sure you\'re logged in and the app is fully loaded.');
    return;
  }

  const firestore = window.firebase.firestore();
  
  // Step 3: Try to find the AppContext in React DevTools
  console.log('🔍 Looking for application context...');
  let appContext = null;
  let syncService = null;
  
  // Find React instance
  let foundReactRoot = false;
  for (const key in window) {
    if (key.startsWith('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
      foundReactRoot = true;
      console.log('✅ Found React DevTools hook.');
      break;
    }
  }
  
  if (!foundReactRoot) {
    console.warn('⚠️ Could not detect React DevTools hook. Some automatic fixes may not work.');
  }
  
  // Step 4: Check the driver behavior event in Firestore
  try {
    console.log('🔍 Checking Firestore for the driver behavior event...');
    const eventId = '28H_Harsh Braking_2025-06-29T13:15:30.000Z';
    const eventDoc = await firestore.collection('driverBehavior').doc(eventId).get();
    
    if (eventDoc.exists) {
      console.log('✅ Found the driver behavior event in Firestore!');
      const eventData = eventDoc.data();
      console.log('📋 Event data:', eventData);
      
      // Check if all required fields are present
      const requiredFields = [
        'driverName', 'fleetNumber', 'eventType', 'severity', 
        'eventDate', 'description', 'reportedBy', 'reportedAt'
      ];
      
      const missingFields = requiredFields.filter(field => !eventData[field]);
      
      if (missingFields.length > 0) {
        console.warn(`⚠️ Event is missing some required fields: ${missingFields.join(', ')}`);
        
        // Attempt to fix the missing fields
        console.log('🔧 Attempting to fix missing fields...');
        
        const fixes = {};
        
        if (!eventData.driverName) {
          fixes.driverName = 'Unknown Driver';
        }
        
        if (!eventData.fleetNumber) {
          fixes.fleetNumber = '28H';
        }
        
        if (!eventData.eventType) {
          fixes.eventType = 'harsh_braking';
        }
        
        if (!eventData.severity) {
          fixes.severity = 'medium';
        }
        
        if (!eventData.eventDate) {
          fixes.eventDate = '2025-06-29';
        }
        
        if (!eventData.description) {
          fixes.description = 'Harsh braking event detected';
        }
        
        if (!eventData.reportedBy) {
          fixes.reportedBy = 'System';
        }
        
        if (!eventData.reportedAt) {
          fixes.reportedAt = new Date().toISOString();
        }
        
        if (!eventData.status) {
          fixes.status = 'pending';
        }
        
        if (Object.keys(fixes).length > 0) {
          console.log('🔧 Applying these fixes:', fixes);
          
          try {
            await firestore.collection('driverBehavior').doc(eventId).update(fixes);
            console.log('✅ Successfully updated the event with missing fields!');
          } catch (updateError) {
            console.error('❌ Error updating the event:', updateError);
          }
        }
      } else {
        console.log('✅ Event has all required fields.');
      }
    } else {
      console.error('❌ Event not found in Firestore!');
      console.log('📋 Creating the event in Firestore...');
      
      // Create the event if it doesn't exist
      const newEvent = {
        id: eventId,
        driverName: 'Unknown Driver',
        driverId: 'unknown',
        fleetNumber: '28H',
        eventType: 'harsh_braking',
        severity: 'medium',
        eventDate: '2025-06-29',
        eventTime: '13:15:30',
        description: 'Harsh braking event detected',
        followUpRequired: false,
        reportedBy: 'System',
        reportedAt: new Date().toISOString(),
        status: 'pending',
        points: 3
      };
      
      try {
        await firestore.collection('driverBehavior').doc(eventId).set(newEvent);
        console.log('✅ Successfully created the event in Firestore!');
      } catch (createError) {
        console.error('❌ Error creating the event:', createError);
      }
    }
  } catch (firestoreError) {
    console.error('❌ Error accessing Firestore:', firestoreError);
  }
  
  // Step 5: Force a sync by clicking the "Sync Now" button
  console.log('🔄 Attempting to force a sync...');
  
  const syncButtons = Array.from(document.querySelectorAll('button'))
    .filter(button => {
      const buttonText = button.textContent || '';
      return buttonText.includes('Sync Now') || buttonText.includes('Sync');
    });
  
  if (syncButtons.length > 0) {
    console.log('✅ Found Sync Now button, clicking it...');
    syncButtons[0].click();
    console.log('🔄 Sync triggered via button click.');
  } else {
    console.warn('⚠️ Could not find a Sync Now button to click.');
    console.log('📋 Please manually click the Sync Now button.');
  }
  
  // Step 6: Clear any filters that might be hiding the event
  console.log('🔍 Checking for active filters...');
  
  const selects = document.querySelectorAll('select');
  let foundFilters = false;
  
  selects.forEach(select => {
    if (select.value && select.value !== '') {
      console.log(`⚠️ Found active filter: ${select.name || 'unknown'} = ${select.value}`);
      foundFilters = true;
    }
  });
  
  if (foundFilters) {
    console.log('📋 Try clearing all filters to see if the event appears.');
  } else {
    console.log('✅ No active filters detected.');
  }
  
  // Final instructions
  console.log('');
  console.log('📋 DIAGNOSTIC COMPLETE');
  console.log('📋 ==================');
  console.log('📋 If the event still doesn\'t appear after syncing:');
  console.log('📋 1. Try refreshing the browser page');
  console.log('📋 2. Clear all filters in the UI');
  console.log('📋 3. Check the browser console for any errors during sync');
  console.log('📋 4. Verify that you have permission to view driver behavior events');
})();