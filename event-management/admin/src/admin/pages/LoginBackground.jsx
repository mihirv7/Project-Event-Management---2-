const LoginBackground = () => {
  return (
    <>
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-grid"></div>

        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>

        <div className="floating-card card1">
          <span className="card-number">2.4K+</span>
          <span className="card-title">Users</span>
        </div>

        <div className="floating-card card2">
          <span className="card-number">540</span>
          <span className="card-title">Events</span>
        </div>

        <div className="floating-card card3">
          <span className="card-number">₹4L</span>
          <span className="card-title">Revenue</span>
        </div>

        <div className="floating-card card4">
          <span className="card-number">96%</span>
          <span className="card-title">Success</span>
        </div>

        <div className="line line1"></div>
        <div className="line line2"></div>
      </div>
    </>
  );
};

export default LoginBackground;