import http from 'src/utils/interceptor';


//No token yet
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function getResource<T>(url: string): Promise<T> {
  try {
    const response = await http.get<T>(url, { 
      ...defaultConfig, 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to Get:', error);
    throw error;
  }
}

export async function postResource<T>(url: string, body: any, extraOptions: any = {}): Promise<T> {
  try {
    const response = await http.post<T>(url, body, { 
      ...defaultConfig, 
      ...extraOptions 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to Create:', error);
    throw error;
  }
}

export async function putResource<T>(url: string, body: any, extraOptions: any = {}): Promise<T> {
  try {
    const response = await http.put<T>(url, body, { 
      ...defaultConfig, 
      ...extraOptions 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to Update:', error);
    throw error;
  }
}

export async function deleteResource<T>(url: string, extraOptions: any = {}): Promise<T | undefined> {
  try {
    const response = await http.delete<T>(url, { 
      ...defaultConfig, 
      ...extraOptions 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to Delete:', error);
    throw error;
  }
}

export const apiHelper = {
  getResource,
  postResource,
  putResource,
  deleteResource,
};