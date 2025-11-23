<template>
    <div class="edit-profile">
        <h2 class="greeting">Hi, {{ user.username }}</h2>

        <div class="profile-container">
            <!-- Profile Image Section -->
            <div class="profile-card">
                <label for="profileImageUpload">
                    <img :src="previewImage || user.profileImage" alt="Profile Image" class="profile-image" />
                </label>
                <input type="file" id="profileImageUpload" accept="image/*" @change="handleImageUpload" />
                <p class="image-instruction">Click on the image to change it</p>
            </div>

            <!-- Form Fields -->
            <div class="form-card">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="user.username"
                        placeholder="Enter new username (optional)" />
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="user.email" placeholder="Enter new email (optional)" />
                </div>

                <div class="form-group">
                    <label for="password">New Password:</label>
                    <input type="password" id="password" v-model.trim="user.newPassword"
                        placeholder="Enter new password (optional)" @input="updatePassword" />
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" v-model.trim="user.confirmPassword"
                        placeholder="Confirm new password" />
                    <p class="error" v-if="passwordMismatch">Passwords do not match!</p>
                </div>

                <!-- Save Button -->
                <button :disabled="!isValidForm" @click="saveChanges">Save Changes</button>
                <!-- Delete Profile Button -->
                <button class="delete-button" @click="deleteProfile">Delete Profile</button>

                <!-- Success/Error Messages -->
                <p class="success-message" v-if="successMessage">{{ successMessage }}</p>
                <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
            </div>
        </div>
        <!-- Custom Confirmation Modal -->
        <div v-if="showConfirmModal" class="modal-overlay">
            <div class="modal-box">
                <h3 class="modal-title">Confirm Deletion</h3>
                <p class="modal-message">Are you absolutely sure you want to delete your profile? This action
                    <strong>cannot</strong> be undone.</p>
                <div class="modal-buttons">
                    <button class="cancel-button" @click="showConfirmModal = false">Cancel</button>
                    <button class="delete-button" @click="confirmDelete">Yes, Delete</button>
                </div>
            </div>
        </div>

        <!-- Custom Success Message Modal -->
        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="modal-box">
                <h3 class="modal-title">Profile Deleted</h3>
                <p class="modal-message">Your account has been successfully deleted.</p>
                <div class="modal-buttons">
                    <button class="delete-button" @click="redirectToLogin">OK</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        id: "",
        username: "",
        email: "",
        profileImage: "",
        newPassword: "",
        confirmPassword: "",
      },
      token: "",
      previewImage: null,
      successMessage: "",
      errorMessage: "",
      selectedFile: null,
      showConfirmModal: false,
      showSuccessModal: false,
    };
  },
  computed: {
    passwordMismatch() {
      return (
        this.user.newPassword &&
        this.user.confirmPassword &&
        this.user.newPassword !== this.user.confirmPassword
      );
    },
    isValidForm() {
      return !this.passwordMismatch;
    },
  },
  methods: {
    loadUserData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      this.token = localStorage.getItem("token");

      if (storedUser) {
        this.user.id = storedUser.id;
        this.user.username = storedUser.username;
        this.user.email = storedUser.email;
        this.user.profileImage =
          storedUser.profileImage || "https://via.placeholder.com/150";
      }
    },

    async saveChanges() {
      this.successMessage = "";
      this.errorMessage = "";

      if (!this.token) {
        this.errorMessage = "Unauthorized: No token provided.";
        return;
      }

      try {
        if (this.passwordMismatch) {
          this.errorMessage = "Passwords do not match!";
          return;
        }

        let updateData = {
          email: this.user.email,
          username: this.user.username,
        };

        if (this.user.newPassword.trim() !== "") {
          updateData.password = this.user.newPassword;
        }

        if (this.selectedFile) {
          updateData.profileImage = await this.convertImageToBase64(
            this.selectedFile
          );
        }

        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${this.user.id}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.data.success) {
          this.successMessage = "Profile updated successfully!";

          const updatedUser = {
            id: this.user.id,
            username: response.data.updatedUser.username,
            email: response.data.updatedUser.email,
            profileImage: response.data.updatedUser.profileImage,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          this.user.profileImage = updatedUser.profileImage;
          this.previewImage = null;
          this.selectedFile = null;
          this.user.newPassword = "";
          this.user.confirmPassword = "";

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          this.errorMessage = "Failed to update profile.";
        }
      } catch (error) {
        this.errorMessage =
          "An error occurred while updating your profile.";
        console.error("Profile update error:", error);
      }
    },

    async convertImageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    updatePassword(event) {
      this.user.newPassword = event.target.value;
    },

    deleteProfile() {
      // Show confirmation modal instead of browser alert
      this.showConfirmModal = true;
    },

    async confirmDelete() {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${this.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          // Clear state
          this.user = {
            id: "",
            username: "",
            email: "",
            profileImage: "",
            newPassword: "",
            confirmPassword: "",
          };

          this.showConfirmModal = false;
          this.showSuccessModal = true;
        } else {
          this.errorMessage = "Failed to delete profile.";
        }
      } catch (error) {
        this.errorMessage = "An error occurred while deleting your profile.";
        console.error("Profile delete error:", error);
      }
    },

    redirectToLogin() {
      this.showSuccessModal = false;
      window.location.href = "/login";
    },
  },
  mounted() {
    this.loadUserData();
  },
};
</script>


<style scoped>
.edit-profile {
    background: rgba(30, 30, 30, 0.9);
    padding: 50px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    color: #00ff88;
    font-family: "Roboto", sans-serif;
    max-width: 1000px;
    width: 95%;
    margin: auto;
    margin-top: 100px;
    margin-bottom: 50px;
}

.greeting {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 30px;
}

/* Layout container */
.profile-container {
    display: flex;
    align-items: center;
    gap: 40px;
}

/* Profile Card */
.profile-card {
    background: #252525;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 255, 136, 0.3);
    text-align: center;
}

.profile-image {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #00ff88;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 255, 136, 0.5);
}

/* Form Card */
.form-card {
    flex-grow: 1;
    background: #252525;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 255, 136, 0.3);
}

/* Form Fields */
.form-group {
    margin-bottom: 20px;
    text-align: left;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #00ff88;
    background-color: #212121;
    color: #00ff88;
    font-size: 1rem;
}

/* Buttons */
button {
    background-color: #00ff88;
    color: #121212;
    font-size: 1.2rem;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: background 0.3s ease;
}

button:hover {
    background-color: #00cc66;
}

#profileImageUpload {
    display: none;
    /* Hide the default file input */
}

/* Custom Button for Upload */
.profile-image-container label {
    display: inline-block;
    background-color: #00ff88;
    color: #121212;
    font-size: 1rem;
    font-weight: bold;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
}

/* Hover & Active Effects */
.profile-image-container label:hover {
    background-color: #00cc66;
    transform: scale(1.05);
}

.profile-image-container label:active {
    background-color: #008f4c;
    transform: scale(0.98);
}

/* File Upload Instruction */
.image-instruction {
    font-size: 0.9rem;
    color: #cccccc;
    margin-top: 5px;
}

.delete-button {
    margin-top: 1rem;
    background: #ff4444;
    color: #fff;
    padding: 10px;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.delete-button:hover {
    background: #cc0000;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-box {
    background-color: #111;
    border: 2px solid #00ff99;
    border-radius: 10px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    color: white;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 255, 153, 0.3);
  }
  
  .modal-title {
    color: #00ff99;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .modal-message {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .cancel-button {
    background: transparent;
    border: 2px solid #00ff99;
    color: #00ff99;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .cancel-button:hover {
    background: #00ff99;
    color: #111;
  }
  
  .delete-button {
    background: #ff4444;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .delete-button:hover {
    background: #cc0000;
  }
  
</style>
