const forgotPasswordButton = document.getElementById('forgot-password-button');
const forgotPasswordForm = document.getElementById('forgot-password-form');

const forgotPasswordFormElement = document.getElementById('forgot-password');
forgotPasswordFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const response = await axios.post('http://localhost:3000/api/forgotpassword', {email});
        alert("Email Sent Successfully...!")
        // if (response.ok) {
        //    console.log(response);
        // } else {
            // const errorData = await response.json();
            // alert(`Failed to send email: ${errorData.error}`);
        // }
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        alert('Failed to send email. Please try again.');
    }
});