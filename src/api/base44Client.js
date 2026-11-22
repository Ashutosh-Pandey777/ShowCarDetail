const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const tokenKey = 'showcardetial_access_token';

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem(tokenKey);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers, signal: controller.signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The server is taking too long to respond. Please try again in a moment.');
    }
    throw new Error('Unable to reach the server. Please check the connection and try again.');
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const error = new Error(data?.message || data?.title || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

const asArray = value => Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : Array.isArray(value?.data) ? value.data : Array.isArray(value?.results) ? value.results : Array.isArray(value?.$values) ? value.$values : [];
const entityApi = name => ({
  list: async (sort, limit=100) => asArray(await request(`/entities/${name}?sort=${encodeURIComponent(sort||'')}&limit=${limit}`)),
  filter: async (filter={},sort,limit=100) => asArray(await request(`/entities/${name}?sort=${encodeURIComponent(sort||'')}&limit=${limit}&filter=${encodeURIComponent(JSON.stringify(filter))}`)),
  get: id => request(`/entities/${name}/${id}`),
  create: data => request(`/entities/${name}`,{method:'POST',body:JSON.stringify(data)}),
  update: (id,data) => request(`/entities/${name}/${id}`,{method:'PUT',body:JSON.stringify(data)}),
  delete: id => request(`/entities/${name}/${id}`,{method:'DELETE'})
});

export const base44 = {
  entities: {
    Car:entityApi('Car'), Brand:entityApi('Brand'), GalleryImage:entityApi('GalleryImage'),
    Bike:entityApi('Bike'), BikeGalleryImage:entityApi('BikeGalleryImage'),
    ElectricVehicle:entityApi('ElectricVehicle'), ElectricVehicleGalleryImage:entityApi('ElectricVehicleGalleryImage'),
    CommercialVehicle:entityApi('CommercialVehicle'), CommercialVehicleGalleryImage:entityApi('CommercialVehicleGalleryImage'),
    Visit:entityApi('Visit'), Review:entityApi('Review'), User:entityApi('User'), Contact:entityApi('Contact'), News:entityApi('News')
  },
  integrations:{Core:{UploadFile:async({file})=>request('/files/upload',{method:'POST',body:(()=>{const form=new FormData();form.append('file',file);return form;})()})}},
  auth:{
    me:()=>request('/auth/me'),
    loginViaEmailPassword:async(email,password)=>{
      const result=await request('/auth/login',{method:'POST',body:JSON.stringify({email,password})});
      if (!result?.access_token) throw new Error('The server did not return a login token. Please contact the administrator.');
      localStorage.setItem(tokenKey,result.access_token);
      return result;
    },
    register:async({email,password})=>request('/auth/register',{method:'POST',body:JSON.stringify({email,password})}),
    sendOtp:mobile=>request('/auth/otp/send',{method:'POST',body:JSON.stringify({mobile})}),
    verifyMobileOtp:(mobile,otp)=>request('/auth/otp/verify',{method:'POST',body:JSON.stringify({mobile,otp})}),
    setToken:token=>localStorage.setItem(tokenKey,token),
    logout:()=>localStorage.removeItem(tokenKey),
    redirectToLogin:()=>{window.location.href='/login';},
    loginWithProvider:()=>{throw new Error('Google login is not configured. Use email and password.');},
    resetPasswordRequest:email=>request('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})}),
    resetPassword:({resetToken,newPassword})=>request('/auth/reset-password',{method:'POST',body:JSON.stringify({resetToken,newPassword})})
  }
};
