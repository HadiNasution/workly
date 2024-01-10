export default function ShimmerCard() {
  return (
    <div className="load-card w-100 h-25 mt-2" style={styles.card}>
      <div className="shimmer" style={styles.shimmer}></div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  shimmer: {
    width: "100%",
    height: "80px",
    background:
      "linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmerAnimation 1s infinite",
  },
};
