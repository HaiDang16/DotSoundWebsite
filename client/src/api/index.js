import axios from "axios";

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
    const res = await axios.get(`${baseURL}api/artists/getAll`);
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
    const res = axios.delete(`${baseURL}api/users/delete/${userId}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const getAllSongs = async () => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getAll`);
    console.log("getAllSongs: ", res.data);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllAlbums = async () => {
  try {
    const res = await axios.get(`${baseURL}api/albums/getAll`);
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

export const saveNewArtist = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/artists/save`, { ...data });
    return (await res).data.artist;
  } catch (error) {
    return null;
  }
};

export const saveNewAlbum = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/albums/save`, { ...data });
    return (await res).data.album;
  } catch (error) {
    return null;
  }
};

export const saveNewSong = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/songs/save`, { ...data });
    return (await res).data.song;
  } catch (error) {
    return null;
  }
};

export const deleteSongById = async (id) => {
  try {
    const res = axios.delete(`${baseURL}api/songs/delete/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};
export const deleteAlbumsById = async (id) => {
  try {
    const res = axios.delete(`${baseURL}api/albums/delete/${id}`);
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
