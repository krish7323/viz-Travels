function Card({ children, className = "" }) {
  return (
    <div className={`bg-navycard border border-gray-700 rounded-2xl shadow-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

export default Card;