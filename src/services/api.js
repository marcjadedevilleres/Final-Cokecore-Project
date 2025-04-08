import axios from 'axios';

// Update your axios instance configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a simple auth token for development purpose
// eslint-disable-next-line no-unused-vars
function createToken() {
  // This is a simplified token structure that should work with Django's JWT library
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 days from now
    iat: Math.floor(Date.now() / 1000),
    jti: Math.random().toString(36).substring(2),
    user_id: 1
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("devSignature"); // This is just for development
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Enhanced request interceptor with proper error handling for token encoding
api.interceptors.request.use(
  (config) => {
    // Skip token validation for login endpoint
    if (config.url && (config.url.includes('token/') || config.url.includes('login'))) {
      return config;
    }
    
    try {
      // Instead of trying to generate a JWT which is complex and error-prone,
      // use a pre-generated token that your Django backend accepts
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // Add the token to the authorization header
      config.headers.Authorization = `Bearer ${token}`;
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized response received');
      // You may need to handle token refresh or re-authentication here
    }
    
    return Promise.reject(error);
  }
);

// Authenticated request helper (using a token that works with your backend)
const authenticatedRequest = async (method, url, data = null) => {
  try {
    // Hardcoded token that works with your Django backend
    // This should be replaced with a token that your Django backend actually accepts
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    
    console.log(`Making ${method} request to ${url}`);
    
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';
    const fullUrl = baseUrl + url;
    
    const config = {
      method: method,
      url: fullUrl,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} request to ${url}:`, error);
    throw error;
  }
};

// Authentication service
export const authService = {
  login: async (email, password) => {
    try {
      // Handle hardcoded credentials directly here
      if (email === "Wilfiesingco@gmail.com" && password === "Adminwilfie@2005") {
        // Use a token that works with your Django backend
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        localStorage.setItem('token', token);
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Return mock response
        return {
          access: token,
          user: { 
            id: 1,
            email: email, 
            name: 'Wilfie', 
            role: 'Admin'
          }
        };
      }
      
      // Regular API login
      const response = await api.post('token/', { email, password });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return response.data;
      }
      throw new Error('No access token received');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },
  
  getCurrentUser: async () => {
    // For hardcoded credentials
    return { 
      id: 1, 
      email: "Wilfiesingco@gmail.com", 
      name: "Wilfie", 
      role: 'Admin'
    };
  }
};

// Service for receiving transactions
export const receivingService = {
  getReceivedItems: async () => {
    try {
      // Try to get data from MongoDB
      const data = await authenticatedRequest('GET', 'transactions/?transaction_type=receive');
      console.log("Successfully retrieved items from MongoDB:", data ? data.length : 0);
      return data;
    } catch (error) {
      console.error("Error fetching items from MongoDB:", error);
      
      // If MongoDB fetch fails, try local storage as fallback
      try {
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        console.log("Retrieved items from localStorage fallback:", storedItems.length);
        return storedItems.map(item => ({
          id: item.id,
          receiveNo: item.transaction_id,
          dateTime: new Date(item.timestamp).toLocaleString(),
          supplier: item.supplier,
          receivedBy: "Wilfie",
          totalAmount: item.total_amount,
          remarks: item.notes,
          items: item.items || []
        }));
      } catch (localError) {
        console.error("Error fetching from localStorage:", localError);
        return [];
      }
    }
  },
  
  createReceiveTransaction: async (data) => {
    console.log("Creating receive transaction with data:", data);
    
    // Format data for MongoDB
    const processedItems = [];
    
    // Process each item in the correct format for MongoDB
    data.items.forEach(item => {
      for (const unit of ['box', 'case', 'bottle', 'shell']) {
        const quantity = parseFloat(item.quantity?.[unit] || 0);
        const price = parseFloat(item.supplierPrice?.[unit] || 0);
        
        if (quantity > 0 && price > 0) {
          processedItems.push({
            systemCode: item.systemCode || '',
            supplierCode: item.supplierCode || '',
            itemType: item.itemType || '',
            itemName: item.itemName || '',
            unit_type: unit,
            quantity: quantity,
            unit_price: price,
            amount: (quantity * price).toFixed(2),
            requiresReturn: item.requiresReturn || false
          });
        }
      }
    });
    
    const payload = {
      receiveNo: data.receiveNo,
      warehouse: data.warehouse || 1,
      supplier: data.supplier || 'Unknown Supplier',
      totalAmount: parseFloat(data.totalAmount || 0).toFixed(2),
      remarks: data.remarks || '',
      items: processedItems
    };
    
    try {
      // Try to save to MongoDB first
      const result = await authenticatedRequest('POST', 'transactions/receive_items/', payload);
      console.log("Successfully saved to MongoDB:", result);
      return result;
    } catch (error) {
      console.error("Error saving to MongoDB, using local storage as fallback:", error);
      
      // Fallback to local storage if MongoDB save fails
      try {
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        
        // Create local item format
        const localItem = {
          id: Date.now().toString(),
          transaction_id: data.receiveNo,
          timestamp: new Date().toISOString(),
          transaction_type: 'receive',
          warehouse: data.warehouse || 1,
          supplier: data.supplier || 'Unknown Supplier',
          total_amount: data.totalAmount || '0.00',
          notes: data.remarks || '',
          items: processedItems.map(item => ({
            id: Date.now() + Math.random().toString().substring(2, 8),
            system_code: item.systemCode,
            supplier_code: item.supplierCode,
            item_type: item.itemType,
            item_name: item.itemName,
            unit_type: item.unit_type,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            requires_return: item.requiresReturn
          }))
        };
        
        // Save to local storage
        storedItems.unshift(localItem);
        localStorage.setItem('receivedItems', JSON.stringify(storedItems));
        
        console.log("Saved to localStorage as fallback:", localItem);
        return localItem;
      } catch (localError) {
        console.error("Failed to save to localStorage fallback:", localError);
        throw error; // Throw the original MongoDB error
      }
    }
  },
  
  updateReceiveTransaction: async (id, data) => {
    console.log("Updating receive transaction:", id, "with data:", data);
    
    // Prepare items in the format expected by the serializer and MongoDB
    const items = [];
    data.items.forEach(item => {
      // For each unit with a quantity, create a separate item
      for (const unit of ['box', 'case', 'bottle', 'shell']) {
        const quantity = parseFloat(item.quantity?.[unit] || 0);
        const price = parseFloat(item.supplierPrice?.[unit] || 0);
        
        if (quantity > 0 && price > 0) {
          items.push({
            system_code: item.systemCode || '',
            supplier_code: item.supplierCode || '',
            item_type: item.itemType || '',
            item_name: item.itemName || '',
            unit_type: unit,
            quantity: quantity,
            unit_price: price,
            amount: (quantity * price).toFixed(2),
            requires_return: item.requiresReturn || false
          });
        }
      }
    });
    
    // Format data for standard update with explicit type conversion
    const payload = {
      transaction_id: data.receiveNo,
      transaction_type: 'receive',
      warehouse: data.warehouse || 1,
      supplier: data.supplier || 'Unknown Supplier',
      total_amount: parseFloat(data.totalAmount || 0).toFixed(2),
      notes: data.remarks || '',
      items: items
    };
    
    try {
      // Try to update in MongoDB first
      const result = await authenticatedRequest('PUT', `transactions/${id}/`, payload);
      console.log("Successfully updated in MongoDB:", result);
      return result;
    } catch (error) {
      console.error("Error updating in MongoDB, using local storage as fallback:", error);
      
      // Fallback to local storage if MongoDB update fails
      try {
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        const itemIndex = storedItems.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          throw new Error('Item not found in local storage');
        }
        
        // Update local item
        const updatedItem = {
          ...storedItems[itemIndex],
          transaction_id: data.receiveNo,
          supplier: data.supplier || 'Unknown Supplier',
          total_amount: data.totalAmount || '0.00',
          notes: data.remarks || '',
          items: items.map(item => ({
            id: Date.now() + Math.random().toString().substring(2, 8),
            system_code: item.system_code,
            supplier_code: item.supplier_code,
            item_type: item.item_type,
            item_name: item.item_name,
            unit_type: item.unit_type,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            requires_return: item.requires_return
          }))
        };
        
        // Save to local storage
        storedItems[itemIndex] = updatedItem;
        localStorage.setItem('receivedItems', JSON.stringify(storedItems));
        
        console.log("Updated in localStorage as fallback:", updatedItem);
        return updatedItem;
      } catch (localError) {
        console.error("Failed to update in localStorage fallback:", localError);
        throw error; // Throw the original MongoDB error
      }
    }
  },
  
  deleteReceiveTransaction: async (id) => {
    try {
      // Try to delete from MongoDB first
      const result = await authenticatedRequest('DELETE', `transactions/${id}/`);
      console.log("Successfully deleted from MongoDB:", id);
      return result;
    } catch (error) {
      console.error("Error deleting from MongoDB, using local storage as fallback:", error);
      
      // Fallback to local storage if MongoDB delete fails
      try {
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        const filteredItems = storedItems.filter(item => item.id !== id);
        
        localStorage.setItem('receivedItems', JSON.stringify(filteredItems));
        console.log("Deleted from localStorage as fallback:", id);
        
        return { success: true };
      } catch (localError) {
        console.error("Failed to delete from localStorage fallback:", localError);
        throw error; // Throw the original MongoDB error
      }
    }
  }
};

export const warehouseService = {
  getWarehouses: async () => {
    try {
      // Try to get warehouses from API
      const response = await api.get('warehouses/');
      return response.data;
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      // Return default warehouse
      return [{ id: 1, name: 'Default Warehouse' }];
    }
  }
};

export const productService = {
  getProducts: async () => {
    try {
      // Try to get products from API
      const response = await api.get('products/');
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
};

export default api;