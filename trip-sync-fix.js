// Diagnostic and Fix Script for Trip Sync Issues
// Run this in the browser console when you're on the Active Trips page

(async function() {
  console.log('🔍 Starting Trip Sync Diagnostic Tool...');
  
  // Step 1: Check if we're on the Active Trips page
  if (!window.location.pathname.includes('trips') && !window.location.pathname.includes('dashboard')) {
    console.error('❌ Error: You must be on the Active Trips page to run this script.');
    console.log('📋 Please navigate to the Active Trips page and try again.');
    return;
  }

  // Step 2: Get references to key application objects
  if (!window.firebase || !window.firebase.firestore) {
    console.error('❌ Error: Firebase Firestore is not initialized in this page.');
    console.log('📋 Make sure you\'re logged in and the app is fully loaded.');
    return;
  }

  const firestore = window.firebase.firestore();
  
  // Step 3: Find application context and access the trips state
  console.log('🔍 Looking for application context...');
  
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
  
  // Step 4: Check for recently imported trips in Firestore
  try {
    console.log('🔍 Checking Firestore for recently added trips...');
    
    // Get the 10 most recently created trips
    const tripsSnapshot = await firestore.collection('trips')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    if (tripsSnapshot.empty) {
      console.log('⚠️ No trips found in Firestore.');
    } else {
      console.log(`✅ Found ${tripsSnapshot.size} recent trips in Firestore:`);
      
      // Display trip information
      tripsSnapshot.forEach(doc => {
        const trip = doc.data();
        console.log(`Trip ID: ${doc.id}`);
        console.log(`- Fleet: ${trip.fleetNumber}`);
        console.log(`- Status: ${trip.status}`);
        console.log(`- Driver: ${trip.driverName}`);
        console.log(`- Route: ${trip.route}`);
        console.log(`- Created: ${trip.createdAt}`);
        console.log('------------------------');
      });
      
      // Check for active trips specifically
      const activeTrips = tripsSnapshot.docs.filter(doc => doc.data().status === 'active');
      if (activeTrips.length === 0) {
        console.warn('⚠️ No active trips found among the recent trips.');
        console.log('📋 Check if the imported trips have status set to "active".');
      } else {
        console.log(`✅ Found ${activeTrips.length} active trips among the recent trips.`);
      }
    }
  } catch (firestoreError) {
    console.error('❌ Error accessing Firestore:', firestoreError);
  }
  
  // Step 5: Force a sync by finding and clicking the refresh button or by executing the refresh function
  console.log('🔄 Attempting to force a sync...');
  
  // Look for the refreshTrips function in the React component instance
  let refreshTripsFound = false;
  
  // First, try to find a refresh button
  const refreshButtons = Array.from(document.querySelectorAll('button'))
    .filter(button => {
      const buttonText = button.textContent || '';
      return buttonText.includes('Refresh') || buttonText.includes('Sync Now');
    });
  
  if (refreshButtons.length > 0) {
    console.log('✅ Found Refresh button, clicking it...');
    refreshButtons[0].click();
    console.log('🔄 Refresh triggered via button click.');
    refreshTripsFound = true;
  }
  
  // If no button found, try to access the refreshTrips function from global scope
  if (!refreshTripsFound) {
    console.log('⚠️ No Refresh button found. Looking for refreshTrips function...');
    
    // Create a custom refresh button
    console.log('📋 Adding a custom Refresh button to the page...');
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '🔄 Refresh Trips Data';
    refreshButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 15px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      z-index: 9999;
    `;
    
    refreshButton.addEventListener('click', () => {
      console.log('🔄 Manual refresh button clicked');
      
      // Try to find and execute the refreshTrips function
      try {
        // Use the browser console to execute a window reload
        console.log('🔄 Refreshing the page to force data reload...');
        window.location.reload();
      } catch (error) {
        console.error('❌ Error executing refresh:', error);
      }
    });
    
    document.body.appendChild(refreshButton);
    console.log('✅ Custom refresh button added to the page. Click it to force a refresh.');
  }
  
  // Step 6: Check for active filters that might be hiding trips
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
    console.log('📋 Try clearing all filters to see if imported trips appear.');
    
    // Look for a "Clear Filters" button
    const clearFiltersButton = Array.from(document.querySelectorAll('button'))
      .find(button => (button.textContent || '').includes('Clear Filters'));
    
    if (clearFiltersButton) {
      console.log('✅ Found Clear Filters button, clicking it...');
      clearFiltersButton.click();
      console.log('🔄 Filters cleared.');
    } else {
      console.log('⚠️ Could not find a Clear Filters button. Try clearing filters manually.');
    }
  } else {
    console.log('✅ No active filters detected.');
  }
  
  // Final instructions
  console.log('');
  console.log('📋 DIAGNOSTIC COMPLETE');
  console.log('📋 ==================');
  console.log('📋 If trips still don\'t appear after syncing:');
  console.log('📋 1. Check that the imported trips have status = "active"');
  console.log('📋 2. Verify trip data in Firebase Console');
  console.log('📋 3. Try refreshing the browser page');
  console.log('📋 4. Check browser console for any errors during sync');
  console.log('📋 5. If using Web Book, ensure the schema matches exactly what the app expects');
})();