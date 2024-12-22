document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('passwordForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Show loading state
        btnText.textContent = 'جاري تغيير كلمة المرور...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;
        messageDiv.className = 'message';
        messageDiv.textContent = '';

        try {
            const response = await fetch('http://localhost:4000/api/password/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    confirmNewPassword: confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = data.message;
                form.reset();
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.message;
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'حدث خطأ أثناء الاتصال بالخادم';
        } finally {
            // Reset button state
            btnText.textContent = 'تغيير كلمة المرور';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});