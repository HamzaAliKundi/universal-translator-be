const createVerificationPage = (status, message, buttonText, buttonLink) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Arial', sans-serif;
                  background-color: #f0f8ff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
              }
              .container {
                  background-color: white;
                  padding: 2rem;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  max-width: 400px;
                  width: 90%;
              }
              h1 {
                  color: #0066cc;
                  margin-bottom: 1rem;
              }
              p {
                  color: #444;
                  line-height: 1.6;
                  margin-bottom: 1.5rem;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #0066cc;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  transition: background-color 0.3s;
              }
              .button:hover {
                  background-color: #0052a3;
              }
              .icon {
                  font-size: 48px;
                  margin-bottom: 1rem;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="icon">
                  ${status === 'success' ? '✅' : '❌'}
              </div>
              <h1>${status === 'success' ? 'Success!' : 'Oops!'}</h1>
              <p>${message}</p>
              <a href="${buttonLink}" class="button">${buttonText}</a>
          </div>
      </body>
      </html>
    `;
  };
  
  export { createVerificationPage };