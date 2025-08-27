const Countdown = ({ tick }) => {
  return (
    <div className="card">
      <h2>Prochain round dans {tick || "..."}</h2>
    </div>
  );
};

export default Countdown;
