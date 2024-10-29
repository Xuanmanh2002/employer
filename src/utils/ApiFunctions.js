import axios from "axios"

export const api = axios.create({
	baseURL: "http://localhost:9090"
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}

export async function checkRoleEmployer(token) {
	try {
		const response = await api.get("/check-role", {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		});

		if (response.status >= 200 && response.status < 300) {
			const { role } = response.data;
			return role === "ROLE_EMPLOYER";
		} else {
			throw new Error(`Role check failed with status: ${response.status}`);
		}
	} catch (error) {
		console.error("Role check error:", error);
		return false;
	}
}

export async function loginEmployer(login) {
	try {
		const response = await api.post("/login-employer", login);
		if (response.status >= 200 && response.status < 300) {
			const token = response.data.token;
			const employerData = response.data;

			if (token) {
				localStorage.setItem("token", token);
				localStorage.setItem("adminId", employerData.id);
				localStorage.setItem("email", employerData.email);
				localStorage.setItem("firstName", employerData.firstName);
				localStorage.setItem("lastName", employerData.lastName);
				localStorage.setItem("avatar", employerData.avatar);

				const isAdmin = await checkRoleEmployer(token);
				if (isAdmin) {
					return employerData;
				} else {
					localStorage.removeItem("token");
					throw new Error("Access restricted to employers only.");
				}
			} else {
				throw new Error("No token received from server");
			}
		} else {
			throw new Error(`Login failed with status: ${response.status}`);
		}
	} catch (error) {
		console.error("Login error:", error);
		return null;
	}
}

export async function registerEmployer(registration) {
	try {
		const response = await api.post("/register-employer", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Employer registration error : ${error.message}`)
		}
	}
}

export async function getAllService() {
	try {
		const result = await api.get("/admin/service/all", {
			headers: getHeader(),
		});
		if (result.status === 204 || !result.data || result.data.length === 0) {
			return [];
		}
		return result.data;
	} catch (error) {
		console.error("Error fetching services:", error);
		throw new Error(`Error fetching services: ${error.response?.data?.message || error.message}`);
	}
}

export async function getAllJob() {
    try {
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("adminId");
        if (!token || !adminId) {
            throw new Error("User is not authenticated or adminId is not found.");
        }
        const result = await api.get("/employer/job/all-job-by-employer", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (result.status === 204 || !result.data || result.data.length === 0) {
            return [];
        }
        return result.data;
    } catch (error) {
        console.error("Error fetching job:", error);
        throw new Error(`Error fetching job: ${error.response?.data?.message || error.message}`);
    }
}
export async function createJob(jobName, experience, applicationDeadline, recruitmentDetails, categoryId) {
    const data = {
        jobName: jobName,
        experience: experience,
        applicationDeadline: applicationDeadline,
        recruitmentDetails: recruitmentDetails,
        categoryId: categoryId,
    };

    try {
        const response = await api.post("/employer/job/create", data, {
            headers: getHeader(),
        });
        if (response.status === 200 && response.data.status === "success") {
            return {
                success: true,
                message: response.data.message,
            };
        } else {
            return {
                success: false,
                message: response.data.message || "Failed to create job",
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
}

export async function getAllCategories() {
	try {
		const result = await api.get("/admin/category/all");
		if (result.status === 204 || !result.data || result.data.length === 0) {
			return [];
		}
		return result.data;
	} catch (error) {
		console.error("Error fetching categories:", error);
		throw new Error(`Error fetching categories: ${error.response?.data?.message || error.message}`);
	}
}

