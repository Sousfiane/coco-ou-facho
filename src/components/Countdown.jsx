import Title from "./Title";

const Countdown = ({ tick }) => {
  return (
    <div className="rounded-md shadow-xl max-w-xl w-full p-4 h-full">
      <Title children={`Prochain round dans ${tick || "..."}`} center={true} />
    </div>
  );
};

export default Countdown;
