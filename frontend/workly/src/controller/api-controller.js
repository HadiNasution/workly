import axios from "axios";

export const axiosGet = async (endpoint, token) => {
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const axiosGetFormData = async (endpoint, token) => {
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const axiosPut = async (endpoint) => {
  try {
    const { data } = await axios.put(endpoint, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const axiosGetBlobContent = async (endpoint, token) => {
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });
    if (data) {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const axiosPutNoContent = async (endpoint, token) => {
  try {
    const { data } = await axios.put(endpoint, null, {
      headers: {
        Authorization: token,
      },
    });
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const axiosDelete = async (endpoint, token) => {
  try {
    const { data } = await axios.delete(endpoint, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return data.data;
  } catch (error) {
    throw error;
  }
};
