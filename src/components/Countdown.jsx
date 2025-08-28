const Countdown = ({ tick }) => {
  return (
    <div className="card">
      <h2 className="countdown">Prochain round dans {tick || "..."}</h2>
    </div>
  );
};

export default Countdown;
