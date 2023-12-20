import { Navigate } from "react-router-dom";
export default function NotFoundPage() {
  const goBack = () => {
    window.history.back() ?? Navigate("/");
  };

  return (
    <div style={styles.darkContainer}>
      <div style={styles.errorContainer}>
        <img
          src="../../../public/assets/error-404-animated.gif"
          alt="Illustration"
          width={250}
          height={250}
          style={styles.illustration}
        />
        <h1 style={styles.heading}>Page Not Found</h1>
        <p style={styles.paragraph}>
          Oops! The page you are looking for might be in another castle.{" "}
          <br></br>
          <strong>Error 404</strong>
        </p>
        <button
          type="button"
          onClick={() => goBack()}
          className="btn btn-primary w-100 mt-3"
        >
          Go back
        </button>
      </div>
    </div>
  );
}

const styles = {
  darkContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  errorContainer: {
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#555",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
  },
  heading: {
    color: "#d9534f",
  },
  paragraph: {
    color: "#ddd",
    marginBottom: "20px",
  },
  illustration: {
    maxWidth: "100%",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#5bc0de",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
