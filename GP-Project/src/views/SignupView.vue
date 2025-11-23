<template>
  <div class="signup-container">
    <div class="signup-box" :class="{ 'error-border': hasError }">
      <h2 class="signup-heading">Sign Up</h2>
      <form @submit.prevent="handleSignUp" class="signup-form">
        <div class="form-group">
          <label for="username" class="form-label" :class="{ active: username }">Username</label>
          <input type="text" id="username" v-model="username" class="form-input" placeholder=" " />
        </div>
        <div class="form-group">
          <label for="email" class="form-label" :class="{ active: email }">Email</label>
          <input type="email" id="email" v-model="email" class="form-input" placeholder=" " />
        </div>
        <div class="form-group password-toggle">
          <label for="password" class="form-label" :class="{ active: password }">Password</label>
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="form-input" placeholder=" " />
          <span class="toggle-icon" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        
        <div class="form-group password-toggle">
          <label for="confirmPassword" class="form-label" :class="{ active: confirmPassword }">Confirm Password</label>
          <input :type="showPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" class="form-input" placeholder=" " />
          <span class="toggle-icon" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        
        <div class="form-group">
          <label for="profileImage" class="form-label" :class="{ active: profileImage }">Profile Image URL</label>
          <input type="text" id="profileImage" v-model="profileImage" class="form-input" placeholder=" " />
        </div>
        <div v-if="profileImage" class="image-preview">
          <img :src="profileImage" alt="Profile Preview" class="preview-img" @error="onImageError" />
        </div>
        
        <transition name="fade">
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </transition>

        <transition name="fade">
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </transition>

        <button type="submit" class="signup-button">Sign Up</button>
      </form>
      <p class="login-link">
        Already have an account? <router-link to="/login" class="login-link-text">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios'; // Import axios
import { isTokenValid } from '@/utils/authUtils';
const showPassword = ref(false); // New toggle

export default defineComponent({
  name: 'SignUp',
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const profileImage = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');

    onMounted(() => {
      if (isTokenValid()) {
        alert('You are already logged in. Redirecting to the home page.');
        window.location.href = '/'; // Redirect to home page
      }
    });

    const hasError = computed(() => errorMessage.value !== '');

    const validateForm = () => {
      if (!username.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'All fields are required.';
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        errorMessage.value = 'Please enter a valid email.';
        return false;
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return false;
      }

      errorMessage.value = '';
      return true;
    };
    const imageError = ref(false);

const onImageError = () => {
  imageError.value = true;
};


    const handleSignUp = async () => {
      if (validateForm()) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/user`,
            {
              username: username.value,
              email: email.value,
              password: password.value,
              profileImage: profileImage.value, // Include image URL
            }
          );

          successMessage.value = 'Sign up successful! Redirecting to login...';
          errorMessage.value = '';
          username.value = '';
          email.value = '';
          password.value = '';
          confirmPassword.value = '';
          profileImage.value = ''; // Reset input

          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            errorMessage.value = error.response.data.message;
          } else {
            errorMessage.value = 'Failed to connect to the server. Please try again later.';
          }
          successMessage.value = '';
          console.error(error);
        }
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      profileImage,
      errorMessage,
      successMessage,
      hasError,
      handleSignUp,
      showPassword,
      imageError,
      onImageError,
    };
  },
});
</script>

<style scoped>
/* Container */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
  padding: 2rem;
  margin-top: 25px;
}

/* Signup box with dynamic border */
.signup-box {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  border: 4px solid #00ff99;
  transition: border-color 0.5s ease-in-out;
  margin-top: 60px;
}

/* Red border on error */
.signup-box.error-border {
  border-color: #ff4444;
}

/* Heading */
.signup-heading {
  color: #00ff99;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: bold;
}

/* Form Styling */
.signup-form {
  display: flex;
  flex-direction: column;
}

/* Form Group */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

/* Floating Labels */
.form-label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
  font-size: 0.9rem;
  transition: 0.3s;
  pointer-events: none;
}

.form-label.active,
.form-input:focus ~ .form-label {
  top: 5px;
  font-size: 0.8rem;
  color: #00ff99;
}

/* Input Fields */
.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #222;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: 0.3s;
}

.form-input:focus {
  border-color: #00ff99;
  box-shadow: 0 0 8px rgba(0, 255, 153, 0.6);
}

/* Error Message */
.error-message {
  color: #ff4444;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* Success Message */
.success-message {
  color: #00ff99;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* Sign-Up Button */
.signup-button {
  background: linear-gradient(135deg, #00ff99, #00cc88);
  color: #1e1e1e;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.signup-button:hover {
  background: linear-gradient(135deg, #00cc88, #009966);
  box-shadow: 0 4px 10px rgba(0, 255, 153, 0.5);
}
.login-link-text {
  color: #00ff99;
  text-decoration: none;
  transition: 0.3s;
}

.login-link-text:hover {
  color: #00cc88;
}
.password-toggle {
  position: relative;
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
  font-size: 1rem;
}
.toggle-icon:hover {
  color: #00ff99;
}
.image-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.preview-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #00ff99;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 255, 153, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.preview-img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 153, 0.6);
}

</style>