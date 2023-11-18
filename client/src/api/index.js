import axios from "axios";

//const baseURL = "https://dotsounds.onrender.com/";
const baseURL = "http://localhost:4000/";

export const validateUser = async (token) => {
  try {
    const res = await axios.get(`${baseURL}api/users/Login`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log("validateUser res: ", res);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllArtist = async () => {
  try {
    const res = await axios.get(`${baseURL}api/artists/GetAllArtist`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}api/users/GetAllUsers`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const removeUser = async (userId) => {
  try {
    const res = axios.delete(`${baseURL}api/users/DeleteUser/${userId}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const getAllSongs = async () => {
  try {
    const res = await axios.get(`${baseURL}api/songs/GetAllSongs`);
    console.log("getAllSongs: ", res.data);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllAlbums = async () => {
  try {
    const res = await axios.get(`${baseURL}api/albums/GetAllAlbums`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const changingUserRole = async (userId, role) => {
  try {
    const res = axios.put(`${baseURL}api/users/updateRole/${userId}`, {
      data: { role: role },
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const createArtist = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/artists/CreateArtist`, { ...data });
    return await res;
  } catch (error) {
    return null;
  }
};

export const createAlbum = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/albums/CreateAlbum`, { ...data });
    return await res;
  } catch (error) {
    return null;
  }
};

export const createSong = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/songs/CreateSong`, { ...data });
    return await res;
  } catch (error) {
    return null;
  }
};

export const deleteSongById = async (id) => {
  try {
    const res = axios.delete(`${baseURL}api/songs/DeleteSong/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};
export const deleteAlbumsById = async (id) => {
  try {
    const res = axios.delete(`${baseURL}api/albums/DeleteAlbum/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const loginAccount = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/users/Login`, data);
    return res;
  } catch (error) {
    return null;
  }
};

export const register = async (dataReq) => {
  try {
    const res = axios.post(`${baseURL}api/users/Register`, { ...dataReq });
    return res;
  } catch (error) {
    return null;
  }
};

export const checkAccountForgotPassword = async (dataReq) => {
  try {
    const res = axios.post(`${baseURL}api/users/CheckAccountForgotPassword`, {
      ...dataReq,
    });
    return res;
  } catch (error) {
    return null;
  }
};
export const resetPassword = async (dataReq) => {
  try {
    const res = axios.post(`${baseURL}api/users/ResetPassword`, { ...dataReq });
    return res;
  } catch (error) {
    return null;
  }
};
export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${baseURL}api/categories/GetAllCategories`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getUserDetails = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/users/GetUserDetails/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};
export const updateUser = async (dataReq) => {
  try {
    const res = axios.put(`${baseURL}api/users/UpdateUserProfile`, {
      ...dataReq,
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const getSongDetails = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/songs/GetSongDetails/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};
export const updateSong = async (dataReq) => {
  try {
    const res = axios.put(`${baseURL}api/songs/UpdateSong`, {
      ...dataReq,
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const getArtistDetails = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/artists/GetArtistDetails/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};
export const updateArtist = async (dataReq) => {
  try {
    const res = axios.put(`${baseURL}api/artists/UpdateArtist`, {
      ...dataReq,
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const getNewReleaseSong = async () => {
  try {
    const res = await axios.get(`${baseURL}api/songs/GetNewReleaseSong`);
    return res.data;
  } catch (error) {
    return null;
  }
};
