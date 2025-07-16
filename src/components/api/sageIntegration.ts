/**
 * Sage Integration API
 * 
 * This file contains functions for interacting with the Sage API
 * to synchronize purchase orders, vendors, inventory, and other data.
 */
import axios from 'axios';
import { InventoryItem, SageInventoryItem } from '../../types/inventory';
import { mapSageToLocalInventory, mapLocalToSageInventory } from '../../utils/sageDataMapping';
import { getSageAccessToken, sageAuthConfig } from '../../config/sageAuth';

// Base API client for Sage
const createSageClient = async () => {
  const token = await getSageAccessToken();
  
  return axios.create({
    baseURL: sageAuthConfig.apiBaseUrl,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Error handling helper
const handleSageError = (error: any): never => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  console.error(`Sage API Error: ${errorMessage}`, error);
  throw new Error(`Sage API Error: ${errorMessage}`);
};

/**
 * Fetch inventory items from Sage
 * @returns Promise with array of inventory items
 */
export async function fetchInventoryFromSage(): Promise<InventoryItem[]> {
  try {
    const client = await createSageClient();
    const response = await client.get('/inventory-items');
    
    // Map Sage format to local format
    return response.data.items.map((item: SageInventoryItem) => 
      mapSageToLocalInventory(item)
    );
  } catch (error) {
    return handleSageError(error);
  }
}

/**
 * Synchronize local inventory item to Sage
 * @param itemData The inventory item data to synchronize
 * @returns Promise with the synchronized item
 */
export async function syncInventoryItemToSage(itemData: InventoryItem): Promise<InventoryItem> {
  try {
    const client = await createSageClient();
    const sageItemData = mapLocalToSageInventory(itemData);
    
    // Determine if this is a new item or an update
    const isNewItem = !itemData.id;
    const url = isNewItem 
      ? '/inventory-items' 
      : `/inventory-items/${itemData.id}`;
    const method = isNewItem ? 'post' : 'put';
    
    const response = await client.request({
      method,
      url,
      data: sageItemData
    });
    
    // Return the updated item with Sage ID
    return mapSageToLocalInventory(response.data);
  } catch (error) {
    return handleSageError(error);
  }
}

/**
 * Fetch single inventory item from Sage
 * @param itemId The Sage item ID to fetch
 * @returns Promise with inventory item
 */
export async function fetchInventoryItemFromSage(itemId: string): Promise<InventoryItem> {
  try {
    const client = await createSageClient();
    const response = await client.get(`/inventory-items/${itemId}`);
    
    return mapSageToLocalInventory(response.data);
  } catch (error) {
    return handleSageError(error);
  }
}

/**
 * Update inventory item quantity in Sage
 * @param itemId The Sage item ID to update
 * @param newQuantity The new quantity
 * @returns Promise with the updated item
 */
export async function updateInventoryQuantity(itemId: string, newQuantity: number): Promise<InventoryItem> {
  try {
    const client = await createSageClient();
    
    // First get the current item
    const response = await client.get(`/inventory-items/${itemId}`);
    const currentItem = response.data;
    
    // Update just the quantity
    const updateData = {
      quantityInStock: newQuantity
    };
    
    const updateResponse = await client.patch(`/inventory-items/${itemId}`, updateData);
    
    return mapSageToLocalInventory(updateResponse.data);
  } catch (error) {
    return handleSageError(error);
  }
}

/**
 * Delete inventory item in Sage
 * @param itemId The Sage item ID to delete
 * @returns Promise with success status
 */
export async function deleteInventoryItem(itemId: string): Promise<boolean> {
  try {
    const client = await createSageClient();
    await client.delete(`/inventory-items/${itemId}`);
    return true;
  } catch (error) {
    return handleSageError(error);
  }
}
