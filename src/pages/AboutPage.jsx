function AboutPage() {
  return (
    <div className="about-container">
      <h2>About Our Todo Application</h2>
      <p>Manage your tasks efficiently with our modern single-page application framework.</p>
      
      <h3>Key App Features</h3>
      <ul>
        <li>Secure User Authentication</li>
        <li>Real-time Todo Status Filtering (All, Active, Completed)</li>
        <li>Persisted URL Parameters for Easy Sharing</li>
        <li>Responsive Interface & Profile Metrics</li>
      </ul>

      <h3>Technologies Used</h3>
      <ul>
        <li><strong>React:</strong> UI component architecture</li>
        <li><strong>React Router v7:</strong> Seamless client-side navigation</li>
        <li><strong>Vite:</strong> Ultra-fast frontend build tooling</li>
      </ul>
    </div>
  );
}

export default AboutPage;