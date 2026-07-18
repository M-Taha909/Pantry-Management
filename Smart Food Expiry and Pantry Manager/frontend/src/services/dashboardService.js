import axios from "axios";

const API =
    "http://localhost:5000/api/dashboard";

const getToken = () => localStorage.getItem("token");

export const getNotifications =
async () => {

    const response = await axios.get(
        `${API}/notifications`,
        {
            headers: {
                Authorization:
                    `Bearer ${getToken()}`
            }
        }
    );
    

    return response.data;
};

export const getFinancialSummary = async () => {
  const response = await axios.get(
    `${API}/financial-summary`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const getCategoryStats = async () => {
  const response = await axios.get(
    `${API}/category-stats`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const getStats = async () => {
  const response = await axios.get(
    `${API}/stats`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const getConsumeFirst = async () => {
  const response = await axios.get(
    `${API}/consume-first`,
    {
      headers:{
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};
