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
		const formData = new FormData();
		formData.append("email", registration.email);
		formData.append("password", registration.password);
		formData.append("firstName", registration.firstName);
		formData.append("lastName", registration.lastName);
		formData.append("birthDate", registration.birthDate);
		formData.append("gender", registration.gender);
		formData.append("telephone", registration.telephone);
		formData.append("addressId", registration.addressId);
		formData.append("companyName", registration.companyName);
		formData.append("scale", registration.scale);
		formData.append("fieldActivity", registration.fieldActivity);

		if (registration.avatar) {
			formData.append("avatar", registration.avatar);
		}

		const response = await api.post("/register-employer", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data);
		} else {
			throw new Error(`Employer registration error: ${error.message}`);
		}
	}
}

export async function updateEmployer(email, firstName, lastName, gender, avatarFile, telephone, birthDate, companyName,  scale, fieldActivity, addressId) {
	const formData = new FormData();
	formData.append("firstName", firstName);
	formData.append("lastName", lastName);
	formData.append("gender", gender);
	formData.append("telephone", telephone);
	formData.append("companyName", companyName);
	formData.append("scale", scale);
	formData.append("fieldActivity", fieldActivity);
	formData.append("addressId", addressId);

	if (birthDate) {
		formData.append("birthDate", birthDate);
	}

	if (avatarFile) {
		formData.append("avatar", avatarFile);
	}

	try {
		const response = await api.put(`/employer/update/${email}`, formData, {
			headers: {
				...getHeader(),
				'Content-Type': 'multipart/form-data'
			},
		});

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			throw new Error(`Update failed with status: ${response.status}`);
		}
	} catch (error) {
		throw new Error(error.response?.data?.message || "Error updating employer.");
	}
}

export async function getEmployer(email, token) {
	try {
		const response = await api.get(`/employer/show-profile/${email}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
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

export async function createJob(
	jobName,
	experience,
	price,
	applicationDeadline,
	recruitmentDetails,
	categoryId,
	ranker,
	quantity,
	workingForm,
	gender
) {
	const data = {
		jobName,
		experience,
		price,
		applicationDeadline,
		recruitmentDetails,
		categoryId,
		ranker,
		quantity,
		workingForm,
		gender,
	};

	try {
		const response = await api.post("/employer/job/create", data, {
			headers: getHeader(),
		});

		if (response.status === 200 && response.data.status === "success") {
			return {
				success: true,
				message: response.data.message || "Job created successfully",
				job: response.data.job,
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
			message: error.response?.data?.message || error.message || "Internal server error",
		};
	}
}
export async function deleteJob(jobId) {
	try {
		const result = await api.delete(`/employer/job/delete/${jobId}`, {
			headers: getHeader()
		});
		return result.data;
	} catch (error) {
		throw new Error(`Error deleting jobs: ${error.message}`);
	}
}

export async function updateJob(jobId, updatedJob) {
	const data = {
		jobName: updatedJob.jobName,
		experience: updatedJob.experience,
		price: updatedJob.price,
		applicationDeadline: updatedJob.applicationDeadline,
		recruitmentDetails: updatedJob.recruitmentDetails,
		categoryId: updatedJob.categoryId,
		ranker: updatedJob.ranker,
		workingForm: updatedJob.workingForm,
		quantity: updatedJob.quantity,
		gender: updatedJob.gender,
	};

	try {
		const response = await api.put(`/employer/job/update/${jobId}`, data, {
			headers: getHeader(),
		});
		if (response.status === 200) {
			return {
				success: true,
				message: "Job updated successfully",
			};
		} else {
			return {
				success: false,
				message: response.data?.message || "Failed to update job",
			};
		}
	} catch (error) {
		console.error("Error updating job:", error);
		return {
			success: false,
			message: error.response?.data?.message || "Error updating job",
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

export async function getAllAddress() {
	try {
		const result = await api.get("/api/address/all", {
		});
		if (result.status === 204 || !result.data || result.data.length === 0) {
			return [];
		}
		return result.data;
	} catch (error) {
		console.error("Error fetching address:", error);
		throw new Error(`Error fetching address: ${error.response?.data?.message || error.message}`);
	}
}

export async function getAllCartItems() {
	try {
		const result = await api.get("/api/cart/all-item", {
			headers: getHeader()
		});
		if (result.status === 204 || !result.data || result.data.length === 0) {
			return [];
		}
		return result.data;
	} catch (error) {
		console.error("Error fetching cart items:", error);
		throw new Error(`Error fetching cart items: ${error.response?.data?.message || error.message}`);
	}
}

export async function addItemToCart(serviceId, quantity) {
	try {
		const response = await api.post("/api/cart/create", null, {
			headers: getHeader(),
			params: {
				serviceId,
				quantity,
			}
		});
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error("Failed to add item to cart");
		}
	} catch (error) {
		console.error("Error adding item to cart:", error);
		throw new Error(error.message || "Error adding item to cart");
	}
}


export async function updateCartItem(serviceId, quantity) {
	try {
		const response = await api.put("/api/cart/update", null, {
			headers: getHeader(),
			params: { serviceId, quantity },
		});
		if (response.status === 200) {
			return {
				success: true,
				message: "Cập nhật giỏ hàng thành công",
				data: response.data,
			};
		} else {
			return {
				success: false,
				message: "Cập nhật giỏ hàng thất bại",
			};
		}
	} catch (error) {
		return {
			success: false,
			message: error.response ? error.response.data : error.message,
		};
	}
}

export async function deleteCartItem(serviceId) {
	try {
		const response = await api.delete("/api/cart/delete", {
			headers: getHeader(),
			params: { serviceId },
		});
		if (response.status === 200) {
			return {
				success: true,
				message: "Item deleted from cart successfully",
			};
		} else {
			return {
				success: false,
				message: "Failed to delete item from cart",
			};
		}
	} catch (error) {
		console.error("Error deleting cart item:", error);
		return {
			success: false,
			message: error.response ? error.response.data.message : error.message,
		};
	}
}

export async function getCartByEmployer() {
	try {
		const response = await api.get("/api/cart/cart-by-employer", {
			headers: getHeader(),
		});

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			throw new Error(`Failed to fetch cart with status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error fetching employer's cart:", error);
		throw new Error(error.response?.data?.message || "Error fetching employer's cart");
	}
}
export async function createOrder(cart) {
	try {
		const response = await api.post(`/api/order/create?cart=${cart}`, null, {
			headers: getHeader(),
		});

		if (response.status === 200) {
			console.log("Order created successfully:", response.data);
		} else {
			throw new Error("Failed to create order");
		}
	} catch (error) {
		console.error("Error creating order:", error.message);
	}
}

export async function getApplicationsByEmployer() {
	try {
		const token = localStorage.getItem("token");

		if (!token) {
			throw new Error("No token found. Please log in again.");
		}
		const response = await api.get("/api/application-documents/list-applications", {
			headers: getHeader(),
		});
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			throw new Error(`Failed to fetch applications with status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error fetching applications:", error);
		throw new Error(error.response?.data?.message || error.message);
	}
}

export async function deleteApplicationDocuments(applicationDocumentsId) {
	try {
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found. Please log in again.");
		}
		const response = await api.delete(`/api/application-documents/delete/${applicationDocumentsId}`, {
			headers: getHeader(),
		});

		if (response.status === 200) {
			console.log("Application document deleted successfully");
			return response.data;
		} else {
			throw new Error(`Failed to delete application document: ${response.status}`);
		}
	} catch (error) {
		console.error("Error deleting application document:", error);
		throw new Error(`Error deleting application document: ${error.message}`);
	}
}

export async function getOrderDetails() {
	try {
		const response = await api.get("/api/order/order-details", {
			headers: getHeader(),
		});

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			throw new Error(`Failed to fetch order details with status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error fetching order details:", error);
		throw new Error(error.response?.data?.message || error.message);
	}
}

export async function deleteOrderDetail(serviceId) {
	try {
		const response = await api.delete(`/api/order/delete-order-details`, {
			headers: getHeader(),
			params: { serviceId },
		});
		if (response.status === 200) {
			console.log("Order detail deleted successfully:", response.data);
			return response.data;
		} else {
			throw new Error("Failed to delete order detail.");
		}
	} catch (error) {
		console.error("Error deleting order detail:", error);
		throw new Error(error.response?.data?.message || error.message);
	}
}

export async function getServicePackById(serviceId) {
	try {
		const response = await api.get(`/admin/service/${serviceId}`, {
			headers: getHeader(),
		});

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(`Failed to fetch ServicePack with status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error fetching ServicePack:", error);
		throw new Error(error.response?.data?.message || error.message);
	}
}

export async function updateApplicationStatus(id, status) {
    try {
        const response = await api.put(`/api/application-documents/update-status/${id}`, null, {
            headers: getHeader(),
            params: { status },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(`Failed to update status with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error updating application status:", error);
        throw new Error(error.response?.data?.message || error.message || "Error updating application status.");
    }
}

export async function getApplicationDocumentsByStatus(status, adminId) {
	try {
		const response = await api.get("/api/application-documents/status", {
			headers: getHeader(),
			params: { 
				status,
				adminId 
			},
		});

		if (response.status === 204 || !response.data || response.data.length === 0) {
			return []; 
		}
		return response.data; 
	} catch (error) {
		console.error("Error fetching application documents by status:", error);
		throw new Error(
			error.response?.data?.message || "Error fetching application documents"
		);
	}
}