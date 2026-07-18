import axios from "axios";

const API =
    "http://localhost:5000/api/consume";

const getToken = () =>
    localStorage.getItem("token");

export const consumeItem = async (
    id,
    quantity
) => {
    const response =
        await axios.post(
            `${API}/${id}`,
            { quantity },
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );

    return response.data;
};