<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-heading">Log In</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label" :class="{ active: email }">Email</label>
          <input type="email" id="email" v-model="email" class="form-input"  />
        </div>

        <!-- Password Field with Visibility Toggle -->
        <div class="form-group password-group">
          <label for="password" class="form-label" :class="{ active: password }">Password</label>
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="form-input"
             />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </transition>

        <!-- Submit Button -->
        <button type="submit" class="login-button">Log In</button>

        <!-- Signup Link -->
        <p class="signup-link">
          Don't have an account?
          <router-link to="/signup" class="signup-link-text">Sign Up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios, { AxiosError } from 'axios';
import { isTokenValid } from '@/utils/authUtils'; // Ensure this path is correct

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const profileImg = ref('');

    // Check token validity on mount and redirect if valid
    onMounted(() => {
      if (isTokenValid()) {
        // alert('You are already logged in. Redirecting to the home page.');
        window.location.href = '/'; // Redirect to home page
      }
    });

    const validateForm = () => {
      if (!email.value || !password.value) {
        errorMessage.value = 'All fields are required.';
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        errorMessage.value = 'Please enter a valid email.';
        return false;
      }

      errorMessage.value = '';
      return true;
    };
    const showPassword = ref(false);
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };


    const handleLogin = async () => {
      if (validateForm()) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/user/login`,
            {
              username: username.value,
              email: email.value,
              password: password.value,
              profileImg: profileImg.value

            }
          );

          const { token, user } = response.data;

          // Save token and user info in localStorage, including profileImage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({
            ...user,
            profileImage: user.profileImage || '/default-profile.png', // Ensure profileImage is stored
          }));

          errorMessage.value = '';
          // alert('Login successful! Redirecting...');
          window.location.href = '/'; // Redirect to dashboard
        } catch (error) {
          // Type assertion for AxiosError
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            errorMessage.value = error.response.data.message; // Access the error message
          } else {
            errorMessage.value =
              'Failed to connect to the server. Please try again later.';
          }
        }
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin,
      showPassword,
      togglePassword,

    };
  },
});
</script>

<style scoped>
/* Container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1c1c1e, #292929);
  padding: 2rem;
}

/* Box */
.login-box {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
  animation: fadeIn 0.8s ease-in-out;
  border: 4px solid transparent;
  transition: border-color 0.3s ease-in-out;
}

.login-box:hover {
  border-color: #00ff99;
}

/* Heading */
.login-heading {
  color: #00ff99;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: bold;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
}

/* Form Group */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

/* Floating Label */
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
.form-input:focus~.form-label {
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

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Button */
.login-button {
  background: linear-gradient(135deg, #00ff99, #00cc88);
  color: #1e1e1e;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button:hover {
  background: linear-gradient(135deg, #00cc88, #009966);
  box-shadow: 0 4px 10px rgba(0, 255, 153, 0.5);
}

/* Signup Link */
.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #cccccc;
  font-size: 0.9rem;
}

.signup-link-text {
  color: #00ff99;
  text-decoration: none;
  transition: 0.3s;
}

.signup-link-text:hover {
  color: #00cc88;
}
.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #00ff99;
}


/* Fade-in Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>